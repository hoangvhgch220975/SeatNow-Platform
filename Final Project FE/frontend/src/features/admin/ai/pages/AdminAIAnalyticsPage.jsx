import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  RotateCw, 
  Download, 
  FileText, 
  AlertCircle,
  BarChart,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

import { aiApi } from '../../../ai-assistant/api.js';
import { useRevenueStats } from '../../dashboard/hooks.js';
import RevenueChart from '../../dashboard/components/RevenueChart.jsx';
import AnalysisLoadingView from '../../../ai-assistant/components/AnalysisLoadingView.jsx';

/**
 * @file AdminAIAnalyticsPage.jsx
 * @description Admin-only page for AI-driven revenue intelligence.
 * Combines real-time chart data with AI-generated strategic summaries.
 */
const AdminAIAnalyticsPage = () => {
    const { t, i18n } = useTranslation();
    const [period, setPeriod] = useState('month');
    const [report, setReport] = useState(null);
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiError, setAIError] = useState(null);
    
    const currentLang = i18n.language || 'en';

    // 1. [Data]: Fetch Raw Revenue Stats for Chart
    const { data: revenueData, isLoading: isChartLoading } = useRevenueStats(period);

    // 2. [Action]: Fetch AI Strategic Report
    const fetchAIAnalysis = useCallback(async () => {
        setIsAILoading(true);
        setAIError(null);
        try {
            // [API Call]: Admin specific revenue summary
            const res = await aiApi.adminRevenueSummary(currentLang);
            const content = res?.data?.summary || res?.summary || res?.reply || res?.data?.reply;
            
            if (content) {
                setReport(content);
            } else {
                throw new Error("Empty report content");
            }
        } catch (err) {
            console.error("Admin AI Analysis error:", err);
            setAIError(t('ai_assistant.insights.error_desc') || "Failed to generate system report.");
            toast.error("AI Analysis failed");
        } finally {
            setIsAILoading(false);
        }
    }, [currentLang, t]);

    // [Effect]: Auto-run AI analysis on page mount
    useEffect(() => {
        fetchAIAnalysis();
    }, [fetchAIAnalysis]);

    const handlePrint = () => window.print();

    return (
        <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1 flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-amber-600" />
                        {t('admin.ai_intelligence.analytics.title')}
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        {t('admin.ai_intelligence.analytics.subtitle')}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchAIAnalysis}
                        disabled={isAILoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 font-bold rounded-xl border border-slate-100 shadow-sm hover:text-amber-600 hover:border-amber-100 transition-all disabled:opacity-50"
                    >
                        <RotateCw className={`w-4 h-4 ${isAILoading ? 'animate-spin' : ''}`} />
                        <span>{t('admin.ai_intelligence.analytics.refresh')}</span>
                    </button>
                    
                    <button 
                        onClick={handlePrint}
                        className="w-11 h-11 bg-amber-600 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-amber-200"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 2. Top Visualization Grid (Bento Style) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Trend */}
                <div className="lg:col-span-2">
                    <RevenueChart 
                        data={revenueData} 
                        loading={isChartLoading} 
                        period={period} 
                    />
                    
                    {/* Period Switcher underneath chart */}
                    <div className="mt-4 flex gap-2">
                        {['week', 'month', 'year'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                    period === p 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'bg-white text-slate-400 border border-slate-100 hover:text-slate-600'
                                }`}
                            >
                                {t(`admin.dashboard.filter.${p}`)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Quick Insight Highlight */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-amber-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-amber-200/50 relative overflow-hidden group">
                        <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-black mb-2 leading-tight">
                                {currentLang === 'vi' ? 'Sẵn sàng phân tích!' : 'Intelligent Analysis Ready!'}
                            </h3>
                            <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">
                                {currentLang === 'vi' 
                                    ? 'AI đã xử lý xong dữ liệu giao dịch toàn sàn. Nhấn nút bên dưới để xem báo cáo chi tiết.' 
                                    : 'AI has finished processing platform-wide transaction data. Scroll down to see the full report.'}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 w-fit px-3 py-1.5 rounded-full border border-white/30 truncate max-w-full overflow-hidden">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{new Date().toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-slate-200 p-6 flex-grow flex flex-col justify-center shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <BarChart className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.ai_intelligence.analytics.realtime_data')}</div>
                                <div className="text-emerald-600 text-sm font-bold animate-pulse flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                    {currentLang === 'vi' ? 'Hệ thống trực tuyến' : 'Live System Online'}
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed">
                            {currentLang === 'vi' 
                                ? 'Các chỉ số được tổng hợp trực tiếp từ Booking Service và Transaction Service.' 
                                : 'Metrics are aggregated directly from the Booking and Transaction Services in real-time.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. AI Strategic Report Section */}
            <div className="relative">
                {/* Loading State */}
                {isAILoading && (
                    <div className="bg-white rounded-[32px] border border-slate-200 p-20 shadow-sm">
                        <AnalysisLoadingView lang={currentLang} />
                    </div>
                )}

                {/* Error State */}
                {aiError && !isAILoading && (
                    <div className="bg-white rounded-[32px] border border-rose-100 p-20 flex flex-col items-center text-center shadow-sm">
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">{currentLang === 'vi' ? 'Lỗi phân tích' : 'Analysis Blocked'}</h3>
                        <p className="text-slate-500 mb-8 max-w-md font-medium">{aiError}</p>
                        <button 
                            onClick={fetchAIAnalysis}
                            className="px-8 py-3 bg-slate-900 text-white font-black rounded-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <RotateCw className="w-4 h-4" />
                            {currentLang === 'vi' ? 'Thử lại' : 'Retry Protocol'}
                        </button>
                    </div>
                )}

                {/* Success State: The Report */}
                {report && !isAILoading && !aiError && (
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
                        {/* Report Header */}
                        <div className="bg-slate-50/50 border-b border-slate-200 px-8 py-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-amber-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">{t('admin.ai_intelligence.analytics.strategic_report')}</h2>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        V.2.4 — PROCESSED BY SEATNOW GEMINI-CORE
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black border border-amber-100 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                {currentLang === 'vi' ? 'Phân tích thông minh' : 'Smart Insight Active'}
                            </div>
                        </div>

                        {/* Report Content */}
                        <div className="p-8 md:p-12">
                            <div className="prose prose-slate prose-amber max-w-none 
                                prose-headings:font-black prose-headings:text-slate-900 
                                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                                prose-li:text-slate-600 prose-li:font-medium
                                prose-strong:text-amber-700 prose-strong:font-black
                                prose-table:border prose-table:rounded-2xl prose-table:overflow-hidden 
                                prose-th:bg-slate-50 prose-th:p-4 prose-th:text-[10px] prose-th:font-black prose-th:uppercase prose-th:tracking-widest
                                prose-td:p-4 prose-td:border-t prose-td:border-slate-50 prose-td:text-sm
                            ">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {report}
                                </ReactMarkdown>
                            </div>

                            {/* Report Footer */}
                            <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <p className="text-[10px] text-slate-400 font-bold italic max-w-md text-center sm:text-left">
                                    {t('admin.ai_intelligence.analytics.disclaimer')}
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">SeatNow Admin Intelligence</span>
                                    <ArrowRight className="w-4 h-4 text-slate-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                /* Markdown Additional Overrides */
                .prose h1 { font-size: 2rem; border-left: 6px solid #8b5cf6; padding-left: 1rem; margin-bottom: 2rem; }
                .prose h2 { font-size: 1.5rem; margin-top: 3rem; margin-bottom: 1.5rem; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; }
                .prose h2::before { content: '◈'; color: #8b5cf6; font-size: 0.8em; }
                .prose h3 { font-size: 1.125rem; margin-top: 2rem; color: #475569; font-weight: 800; }
                .prose blockquote { border-left-color: #8b5cf6; background: #f5f3ff; padding: 1.5rem; border-radius: 0 1rem 1rem 0; font-style: normal; color: #5b21b6; font-weight: 600; }
                .prose table { border: 1px solid #e2e8f0; border-collapse: separate; border-spacing: 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
                .prose th { color: #64748b; }
                .prose strong { background: linear-gradient(to bottom, transparent 60%, #ede9fe 60%); padding: 0 2px; }
            `}</style>
        </div>
    );
};

export default AdminAIAnalyticsPage;
