import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CreditCard,
  QrCode,
  LayoutGrid,
  History,
  CheckCircle2,
  XCircle,
  Banknote,
  ShieldAlert,
  Info,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAdminWithdrawals, useWithdrawalActions } from "../hooks";
import WithdrawalTable from "../components/WithdrawalTable";
import WithdrawalDecisionDialog from "../components/WithdrawalDecisionDialog";
import WithdrawalStats from "../components/WithdrawalStats";
import { formatCurrency } from "../../../../shared/utils/formatCurrency";
import { formatCardNumber } from "../../../../shared/utils/formatCardNumber";
import { useDebounce } from "../../../../shared/hooks/useDebounce";

/**
 * @file AdminWithdrawalsPage.jsx
 * @description Trang quản lý yêu cầu rút tiền tập trung của Admin.
 * Được nâng cấp để hỗ trợ Keyword Search và dữ liệu Risk Metrics mới.
 */
const AdminWithdrawalsPage = () => {
  const { t } = useTranslation();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [decisionModal, setDecisionModal] = useState({
    isOpen: false,
    mode: "approve",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset trạng thái lật khi chọn request khác
  useEffect(() => {
    setIsFlipped(false);
  }, [selectedRequest?.id]);
  
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    toast.success(t("common.copied", "Copied to clipboard"));
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Debounce search query để tránh spam API
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Reset trang về 1 khi tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch dữ liệu yêu cầu rút tiền với endpoint chuyên biệt mới
  const { data: withdrawalsData, isLoading } = useAdminWithdrawals({
    status: "pending",
    keyword: debouncedSearch,
    page: currentPage,
    limit: 5,
  });

  const { approveWithdrawal, rejectWithdrawal, isApproving, isRejecting } =
    useWithdrawalActions();

  const requests = withdrawalsData?.data || [];

  const handleDecision = async (id) => {
    try {
      if (decisionModal.mode === "approve") {
        await approveWithdrawal(id);
      } else {
        await rejectWithdrawal(id);
      }
      setDecisionModal({ ...decisionModal, isOpen: false });
      setSelectedRequest(null);
    } catch (error) {
      // Toast đã được xử lý trong hook
    }
  };

  // Tính toán nhanh số liệu dựa trên dữ liệu thật từ AI/Analytics
  const totalPending = requests.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
            {t("admin.withdrawals.title")}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {t("admin.withdrawals.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder={t("admin.withdrawals.search_placeholder")}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-full w-full md:w-80 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm font-medium outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-violet-500 hover:border-violet-200 transition-all shadow-sm">
            <History size={20} />
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <WithdrawalStats
        stats={
          withdrawalsData?.summary || {
            pendingCount: requests.length,
            totalProcessed: 0,
            systemLiquidity: 0,
          }
        }
        loading={isLoading}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 md:gap-8">
        {/* Left: Withdrawal List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <WithdrawalTable
            requests={requests}
            loading={isLoading}
            onSelectRequest={setSelectedRequest}
            pagination={
              withdrawalsData?.pagination || {
                page: 1,
                totalPages: 1,
                total: 0,
              }
            }
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right: Inspection & Stats Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Inspection Panel */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-violet-600 rounded-lg text-white shadow-lg shadow-violet-200">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">
                {t("admin.withdrawals.details.inspection")}
              </h3>
            </div>
            {selectedRequest ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Request Context */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        Restaurant
                      </p>
                      <p className="font-bold text-slate-900">
                        {selectedRequest.restaurantName}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase rounded shadow-sm">
                      Verified
                    </span>
                  </div>

                  <div className="h-px bg-slate-200/50 my-3" />

                  {/* Payment Details Section - Hiển thị chi tiết ngân hàng hoặc mã QR giải ngân */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {t("admin.withdrawals.details.bank_info")}
                      </p>
                      <span className="text-[10px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded">
                        {selectedRequest.bankDetails?.method || "BANK_TRANSFER"}
                      </span>
                    </div>

                    {selectedRequest.bankDetails?.method === "QR" ? (
                      <div className="space-y-3">
                        {selectedRequest.bankDetails.qrCodeUrl ? (
                          <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-4 group hover:border-violet-200 transition-all">
                            <div className="relative overflow-hidden rounded-2xl border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                              <img
                                src={selectedRequest.bankDetails.qrCodeUrl}
                                alt="Withdrawal QR"
                                className="w-full max-w-[200px] aspect-square object-contain"
                              />
                            </div>
                            <div className="text-center space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                {t("admin.withdrawals.details.qr_instruction")}
                              </p>
                              <div className="flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Digital Payout Ready</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-10 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                              <QrCode size={32} className="text-slate-300" />
                            </div>
                            <p className="text-xs text-slate-400 font-medium whitespace-pre-wrap leading-relaxed max-w-[150px]">
                              {t("admin.withdrawals.details.qr_placeholder")}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="[perspective:1000px] w-full h-[220px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                        <motion.div 
                          className="relative w-full h-full transition-all duration-700"
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* FRONT SIDE (Trang trí, số thẻ rút gọn) */}
                          <div 
                            className="absolute inset-0 w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[32px] p-6 text-white shadow-xl shadow-violet-200"
                            style={{ backfaceVisibility: 'hidden' }}
                          >
                            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                            
                            <div className="relative flex flex-col h-full justify-between">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <h4 className="text-lg font-black tracking-tight uppercase leading-none">
                                    {selectedRequest.bankDetails?.bankName || "N/A"}
                                  </h4>
                                  <p className="text-[10px] font-bold text-violet-200/80 uppercase tracking-widest">Network Verified</p>
                                </div>
                                <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                  <CreditCard size={20} className="text-white" />
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex flex-col gap-3">
                                  {/* Simulated Chip */}
                                  <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-80 border border-yellow-600/20 shadow-inner" />
                                  <span className="text-lg font-mono font-bold tracking-[0.1em] truncate max-w-full">
                                    {formatCardNumber(
                                      selectedRequest.bankDetails?.cardNumber ||
                                      selectedRequest.bankDetails?.accountNumber
                                    ).substring(0, 14) + "...."}
                                  </span>
                                </div>

                                <div className="flex flex-col px-1">
                                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-200/70">BENEFICIARY NAME</span>
                                  <p className="text-sm font-black tracking-wide uppercase truncate">
                                    {selectedRequest.bankDetails?.accountHolder || "Unknown Receiver"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* BACK SIDE (Chi tiết, số thẻ đầy đủ và CVV/Expiry) */}
                          <div 
                            className="absolute inset-0 w-full h-full bg-slate-900 rounded-[32px] overflow-hidden text-white shadow-2xl border border-slate-700"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                          >
                            {/* Magnetic Strip */}
                            <div className="w-full h-12 bg-slate-800 mt-6 shadow-inner" />
                            
                            <div className="p-6 pt-4 space-y-5">
                              {/* Full Card Number with Copy */}
                              <div 
                                onClick={(e) => { e.stopPropagation(); handleCopy(selectedRequest.bankDetails?.cardNumber || selectedRequest.bankDetails?.accountNumber); }}
                                className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between group/copy hover:bg-white/10 transition-all active:scale-95"
                              >
                                <span className="text-xs font-mono font-bold tracking-wider">
                                  {formatCardNumber(selectedRequest.bankDetails?.cardNumber || selectedRequest.bankDetails?.accountNumber)}
                                </span>
                                <div className="p-1 bg-white/10 rounded flex-shrink-0">
                                  {copiedId ? <Check size={12} className="text-green-300" /> : <Copy size={12} className="text-white/50" />}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                {/* Expiry Date */}
                                <div className="space-y-1">
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Expiration Date</span>
                                  <div className="bg-slate-800 p-2 rounded-lg text-center font-mono font-bold text-xs ring-1 ring-white/5">
                                    {selectedRequest.bankDetails?.expiryDate || "--/--"}
                                  </div>
                                </div>
                                {/* CVV Security */}
                                <div className="space-y-1">
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Security CVV</span>
                                  <div className="bg-slate-800 p-2 rounded-lg text-center font-mono font-bold text-xs border-r-4 border-red-500/50">
                                    {selectedRequest.bankDetails?.cvv || "***"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between items-center opacity-40">
                                <span className="text-[8px] font-medium tracking-tighter">AUTHORIZED SIGNATURE REQUIRED</span>
                                <div className="flex gap-1">
                                  <div className="w-4 h-4 rounded-full bg-red-500/50" />
                                  <div className="w-4 h-4 rounded-full bg-yellow-500/50" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Signals Panel */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none px-1">
                    Security Analysis
                  </p>

                  <div
                    className={`p-4 rounded-xl border transition-all ${selectedRequest.riskSignals?.insufficientBalance ? "bg-red-50 border-red-100" : "bg-green-50/50 border-green-100"}`}
                  >
                    <div className="flex gap-3">
                      {selectedRequest.riskSignals?.insufficientBalance ? (
                        <ShieldAlert
                          className="text-red-500 shrink-0"
                          size={18}
                        />
                      ) : (
                        <ShieldCheck
                          className="text-green-500 shrink-0"
                          size={18}
                        />
                      )}
                      <div>
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedRequest.riskSignals?.insufficientBalance ? "text-red-700" : "text-green-700"}`}
                        >
                          Balance Status
                        </p>
                        <p
                          className={`text-xs font-medium leading-relaxed ${selectedRequest.riskSignals?.insufficientBalance ? "text-red-800" : "text-green-800"}`}
                        >
                          {selectedRequest.riskSignals?.insufficientBalance
                            ? "Withdrawal amount exceeds current available verified balance."
                            : "Account has sufficient funds for this transaction."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedRequest.riskSignals?.unusualAmount && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                      <AlertCircle
                        size={18}
                        className="text-amber-500 shrink-0"
                      />
                      <div>
                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
                          Magnitude Warning
                        </p>
                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                          This payout is significantly higher than average.
                          Manual bank verification recommended.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount Row */}
                <div className="flex items-center justify-between p-4 bg-violet-50/50 rounded-xl border border-violet-100">
                  <div className="flex items-center gap-2">
                    <Banknote size={16} className="text-violet-600" />
                    <span className="text-xs font-bold text-violet-700">
                      {t("admin.withdrawals.table.requested")}
                    </span>
                  </div>
                  <span className="text-xl font-black text-violet-700">
                    {formatCurrency(selectedRequest.amount)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={() =>
                      setDecisionModal({ isOpen: true, mode: "approve" })
                    }
                    disabled={selectedRequest.riskSignals?.insufficientBalance}
                    className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={18} />
                    {t("admin.withdrawals.actions.approve")}
                  </button>
                  <button
                    onClick={() =>
                      setDecisionModal({ isOpen: true, mode: "reject" })
                    }
                    className="w-full py-3 bg-white text-red-500 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} />
                    {t("admin.withdrawals.actions.reject")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                <LayoutGrid
                  size={48}
                  className="text-slate-200 mb-4"
                  strokeWidth={1}
                />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t("common.select_to_view") || "Select a request to inspect"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      <WithdrawalDecisionDialog
        isOpen={decisionModal.isOpen}
        onClose={() => setDecisionModal({ ...decisionModal, isOpen: false })}
        request={selectedRequest}
        mode={decisionModal.mode}
        onConfirm={handleDecision}
        loading={isApproving || isRejecting}
      />
    </div>
  );
};

export default AdminWithdrawalsPage;
