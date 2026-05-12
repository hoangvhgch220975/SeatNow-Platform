import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ChevronLeft, 
  RotateCw, 
  Download, 
  FileText, 
  Share2, 
  AlertCircle,
  BarChart
} from 'lucide-react';
import toast from 'react-hot-toast';

import { aiApi } from '../../../ai-assistant/api.js';
import AnalysisLoadingView from '../../../ai-assistant/components/AnalysisLoadingView.jsx';
import { useAuthStore } from '../../../auth/store.js';

/**
 * @file AIRevenueInsightsPage.jsx
 * @description Trang phân tích doanh thu danh mục (Portfolio Insights) trọn gói.
 * Hiển thị báo cáo One-shot thay vì giao diện Chat.
 */
const AIRevenueInsightsPage = ({ restaurantId: restaurantIdProp = null }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const isOwner = user?.role === 'RESTAURANT_OWNER';
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const currentLang = i18n.language || 'en';
    // [Logic]: Nếu có restaurantIdProp => đang xem dữ liệu của 1 nhà hàng cụ thể (Workspace)
    const restaurantId = restaurantIdProp || null;
    const isWorkspaceContext = !!restaurantId;

    // [Action]: Hàm gọi API phân tích
    const fetchAnalysis = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // [API Call]: Nếu có restaurantId => phân tích nhà hàng cụ thể, nếu null => Portfolio
            const res = await aiApi.ownerRevenueSummary(restaurantId, currentLang);
            const content = res?.data?.summary || res?.summary || res?.reply;
            
            if (content) {
                setReport(content);
            } else {
                throw new Error("Empty report content");
            }
        } catch (err) {
            console.error("AI Analysis error:", err);
            setError(t('ai_assistant.error_generic') || "Failed to generate report. Please try again.");
            toast.error("Analysis failed");
        } finally {
            setIsLoading(false);
        }
    }, [currentLang, t, restaurantId]);

    // [Effect]: Tự động chạy khi mở trang
    useEffect(() => {
        fetchAnalysis();
    }, [fetchAnalysis]);

    // [Action]: Quay lại
    const handleBack = () => navigate(-1);

    return (
        <div className="min-h-screen bg-[#FDFCFE] flex flex-col font-sans overflow-hidden">
            {/* 1. Header Báo cáo */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-indigo-100/10">
                <div className="flex items-center gap-4">
                    {/* [Role: OWNER]: Ẩn nút quay lại vì Owner đã có sidebar điều hướng */}
                    {!isOwner && (
                        <button 
                            onClick={handleBack}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            {isWorkspaceContext
                              ? t('ai_assistant.insights.title_restaurant')
                              : t('ai_assistant.insights.title_portfolio')
                            }
                        </h1>
                        <p className="text-xs text-slate-400 font-medium">
                            {isWorkspaceContext 
                              ? (restaurantId) 
                              : 'Portfolio — Powered by SeatNow AI Advisor'
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isLoading && !error && (
                        <>
                            <button 
                                onClick={fetchAnalysis}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-indigo-50 rounded-xl transition-all"
                                title={t('ai_assistant.insights.refresh')}
                            >
                                <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">{t('ai_assistant.insights.refresh')}</span>
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* 2. Main Content Area */}
            <main className="flex-grow overflow-y-auto custom-scrollbar relative">
                <div className="max-w-4xl mx-auto p-6 md:p-10">
                    
                    {/* [State]: Loading */}
                    {isLoading && (
                        <div className="py-20">
                            <AnalysisLoadingView lang={currentLang} />
                        </div>
                    )}

                    {/* [State]: Error */}
                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
                                <AlertCircle className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{t('ai_assistant.insights.error_title')}</h3>
                            <p className="text-slate-500 max-w-sm mb-6">{error}</p>
                            <button 
                                onClick={fetchAnalysis}
                                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <RotateCw className="w-4 h-4" />
                                {t('ai_assistant.insights.retry')}
                            </button>
                        </div>
                    )}

                    {/* [State]: Success (Report Content) */}
                    {report && !isLoading && !error && (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/20 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Report Metadata */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-50 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                        <BarChart className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">
                                            {t('ai_assistant.insights.strategic_report')}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {new Date().toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    {t('ai_assistant.insights.realtime_data')}
                                </div>
                            </div>

                            {/* Markdown Content - Optimized for Premium Reading */}
                            <div className="prose prose-slate prose-indigo max-w-none 
                                prose-headings:font-bold prose-headings:text-slate-800 
                                prose-p:text-slate-600 prose-p:leading-relaxed
                                prose-li:text-slate-600
                                prose-strong:text-indigo-600 prose-strong:font-bold
                                prose-table:border prose-table:rounded-xl prose-table:overflow-hidden 
                                prose-th:bg-slate-50 prose-th:p-4 prose-td:p-4 prose-td:border-t prose-td:border-slate-50
                                prose-table:shadow-sm"
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {report}
                                </ReactMarkdown>
                            </div>

                            {/* Footer / Disclaimer */}
                            <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                                <p className="text-xs text-slate-400 italic text-center md:text-left">
                                    {t('ai_assistant.insights.disclaimer')}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                
                /* Typography & Table Styling for Markdown */
                .prose table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #F1F5F9; border-radius: 12px; overflow: hidden; }
                .prose th { background-color: #F8FAFC; text-align: left; font-weight: 700; color: #1E293B; }
                .prose h1 { font-size: 1.75rem; margin-bottom: 1.5rem; color: #1E293B; border-bottom: 2px solid #EEF2FF; padding-bottom: 0.5rem; }
                .prose h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #1E293B; }
                .prose h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #334155; }
                .prose strong { color: #4F46E5; }
            `}</style>
        </div>
    );
};

export default AIRevenueInsightsPage;
