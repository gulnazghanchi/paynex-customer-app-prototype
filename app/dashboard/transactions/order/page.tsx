"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  Store,
  Calendar,
  CreditCard,
  User,
  ArrowUpDown,
  DollarSign,
  FileText,
  HelpCircle,
  ArrowUpRight
} from "lucide-react";

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids");
  const ids = React.useMemo(() => idsParam ? idsParam.split(',').map(id => id.trim()).filter(id => id.length > 0) : [], [idsParam]);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTxIndex, setActiveTxIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    if (!text || text === "-") return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (ids.length === 0) {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("paynexToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const txns = await Promise.all(
          ids.map(async (id) => {
            const url = `https://api.paynex.world/v1/merchant/transaction?skip=0&take=10&orderBy=createdAt%7Cdesc&search_text=${encodeURIComponent(id)}&search_column=transactionId&gatewayEnv=Live&include=merchant&include=product`;
            const res = await fetch(url, {
              headers: {
                "Accept": "application/json, text/plain, */*",
                "Authorization": `Bearer ${token}`,
                "paynex-mode": "Test"
              }
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.list && Array.isArray(data.list)) {
                return data.list.find((t: any) => t.transactionId === id) || null;
              }
            }
            return null;
          })
        );

        const validTxns = txns.filter(t => t !== null);
        setTransactions(validTxns);
      } catch (e) {
        console.error("Failed to fetch order details", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [ids]);

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(d) + " " + d.toLocaleTimeString('en-US', { hour12: false });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">

      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-[13.5px] font-medium text-gray-500">Loading details...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="w-full flex items-center justify-center py-32 text-gray-500 font-medium">
          No transactions found.
        </div>
      ) : (
        <div className="w-full space-y-6 pt-6 md:pt-8 pb-16 md:pb-20 px-6 md:px-8">
          {(() => {
            const activeTx = (transactions[activeTxIndex] || transactions[0]) as any;
            if (!activeTx) return null;

            const rawStatus = activeTx.transactionStatus?.toLowerCase();
            const statusStr = (rawStatus === "success" || rawStatus === "authorized" || rawStatus === "approved") ? "Approved" : "Declined";

            return (
              <>
                {/* Title and Top Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Transaction Details</h1>
                    <div className="flex items-center gap-1.5 text-[13.5px]">
                      <span className="text-gray-500 font-medium">Transaction ID:</span>
                      <span className="text-blue-600 font-semibold font-mono">{activeTx.transactionId}</span>
                    </div>
                  </div>

                  {/* Middle Tabs: Switch between transactions */}
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {transactions.map((tx: any, idx: number) => {
                      const type = tx.transactionType === "PreAuth" ? "Preauthorization" : tx.transactionType === "Capture" ? "Purchase" : tx.transactionType === "Refund" ? "Refund" : tx.transactionType;
                      const isActive = activeTxIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveTxIndex(idx)}
                          className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-all ${isActive
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer border-none">
                      Refund
                    </button>
                    <button className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer">
                      View Transaction Logs
                    </button>
                  </div>
                </div>

                {/* 6 Grid highlight cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Card 1: Merchant No. */}
                  <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Store className="w-[18px] h-[18px]" />
                      <span className="text-[13px] font-semibold text-gray-400">Merchant No.</span>
                    </div>
                    <div className="text-[16px] font-bold text-gray-900 tracking-tight">
                      0030213746193
                    </div>
                  </div>

                  {/* Card 2: Date & Time */}
                  <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar className="w-[18px] h-[18px]" />
                      <span className="text-[13px] font-semibold text-gray-400">Date & Time</span>
                    </div>
                    <div className="text-[14px] font-bold text-gray-900 tracking-tight leading-snug">
                      {(() => {
                        if (!activeTx.createdAt) return "-";
                        try {
                          const d = new Date(activeTx.createdAt);
                          const datePart = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
                          const timePart = d.toLocaleTimeString('en-US', { hour12: false });
                          return `${datePart} ${timePart}`;
                        } catch {
                          return activeTx.createdAt;
                        }
                      })()}
                    </div>
                  </div>

                  {/* Card 3: Card Type */}
                  <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <CreditCard className="w-[18px] h-[18px]" />
                      <span className="text-[13px] font-semibold text-gray-400">Card Type</span>
                    </div>
                    <div className="flex items-center gap-2 text-[15px] font-bold text-gray-900 tracking-tight capitalize">
                      <div className="flex -space-x-1 flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-[#EA3C12]"></div>
                        <div className="w-4 h-4 rounded-full bg-[#F59E0B]"></div>
                      </div>
                      {activeTx.cardType || "Mastercard"}
                    </div>
                  </div>

                  {/* Card 4: Cardholder */}
                  <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <User className="w-[18px] h-[18px]" />
                      <span className="text-[13px] font-semibold text-gray-400">Cardholder</span>
                    </div>
                    <div className="text-[15px] font-bold text-gray-900 tracking-tight">
                      {activeTx.maskedCardNumber || "5191********0199"}
                    </div>
                  </div>

                  {/* Card 5: Transaction Type */}
                  <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <ArrowUpDown className="w-[18px] h-[18px]" />
                      <span className="text-[13px] font-semibold text-gray-400">Transaction Type</span>
                    </div>
                    <div className="text-[15px] font-bold text-gray-900 tracking-tight capitalize">
                      {activeTx.transactionType === "PreAuth" ? "Preauthorization" : activeTx.transactionType === "Capture" ? "Purchase" : activeTx.transactionType || "Purchase"}
                    </div>
                  </div>

                  {/* Card 6: Amount */}
                  <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <DollarSign className="w-[18px] h-[18px]" />
                      <span className="text-[13px] font-semibold text-gray-400">Amount</span>
                    </div>
                    <div className="text-[16px] font-bold text-gray-900 tracking-tight">
                      {activeTx.currency || "CAD"} ${Number(activeTx.amount || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Main Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                  {/* Left Column (3 spans): Info Panels */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Transaction Information Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <h2 className="text-[15px] font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <ArrowUpDown className="w-4 h-4 text-blue-600" />
                        Transaction Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Transaction ID</span>
                          <span className="text-[13px] font-semibold text-gray-800 font-mono flex items-center gap-1.5">
                            {activeTx.transactionId}
                            <button
                              onClick={() => handleCopy(activeTx.transactionId, "txId")}
                              className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
                            >
                              {copiedField === "txId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Transaction Type</span>
                          <span className="text-[13px] font-semibold text-gray-800 capitalize">{activeTx.transactionType === "PreAuth" ? "Preauthorization" : activeTx.transactionType === "Capture" ? "Purchase" : activeTx.transactionType}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Date & Time</span>
                          <span className="text-[13px] font-semibold text-gray-800">{formatDate(activeTx.createdAt)}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Status</span>
                          <span className={`inline-flex items-center text-[13px] font-bold ${statusStr === "Approved" ? "text-green-600" : "text-red-600"}`}>
                            {statusStr}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Dynamic Payment Link ID</span>
                          <span className="text-[13px] font-semibold text-gray-800 font-mono flex items-center gap-1.5">
                            {activeTx.paymentLinkId || "pay_conx8o3d7yabvthw"}
                            <button
                              onClick={() => handleCopy(activeTx.paymentLinkId || "pay_conx8o3d7yabvthw", "linkId")}
                              className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
                            >
                              {copiedField === "linkId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Product ID</span>
                          <span className="text-[13px] font-semibold text-gray-800">{activeTx.product?.serialNumber || activeTx.productId || "523T546048"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <h2 className="text-[15px] font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        Payment Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Amount</span>
                          <span className="text-[13px] font-semibold text-gray-800">{activeTx.currency || "CAD"} ${Number(activeTx.amount || 0).toFixed(2)}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Currency</span>
                          <span className="text-[13px] font-semibold text-gray-800">{activeTx.currency || "CAD"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Payment Provider</span>
                          <span className="text-[13px] font-semibold text-gray-800">{activeTx.paymentProvider || "Moneris"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Provider Information Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <h2 className="text-[15px] font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <Store className="w-4 h-4 text-blue-600" />
                        Provider Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Provider Transaction ID</span>
                          <span className="text-[13px] font-semibold text-gray-800 font-mono flex items-center gap-1.5">
                            {activeTx.providerTnxId || "txn_buxfj8bl3uycqxde"}
                            <button
                              onClick={() => handleCopy(activeTx.providerTnxId || "txn_buxfj8bl3uycqxde", "provTxId")}
                              className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
                            >
                              {copiedField === "provTxId" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Provider Transaction Number</span>
                          <span className="text-[13px] font-semibold text-gray-800 font-mono flex items-center gap-1.5">
                            {activeTx.providerTnxNumber || "470-0_1542"}
                            <button
                              onClick={() => handleCopy(activeTx.providerTnxNumber || "470-0_1542", "provTxNo")}
                              className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
                            >
                              {copiedField === "provTxNo" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Merchant Information Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <h2 className="text-[15px] font-bold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100">
                        <Store className="w-4 h-4 text-blue-600" />
                        Merchant Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Merchant Name</span>
                          <span className="text-[13px] font-semibold text-gray-800">{activeTx.merchant?.name || "Chargnex Technologies"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Merchant Number</span>
                          <span className="text-[13px] font-semibold text-gray-800">0030213746193</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Store</span>
                          <span className="text-[13px] font-semibold text-gray-800">{activeTx.merchant?.storeName || "Mumbai - Andheri"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Terminal</span>
                          <span className="text-[13px] font-semibold text-gray-800">{activeTx.product?.serialNumber || "PX-204"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Channel</span>
                          <span className="text-[13px] font-semibold text-gray-800">Terminal</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wider block">Entry Method</span>
                          <span className="text-[13px] font-semibold text-gray-800">Tap</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column (1 span): Card graphic & secondary panels */}
                  <div className="space-y-6">
                    {/* Stylized Credit Card Graphic */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#102B4E] to-[#1E3A8A] p-6 text-white shadow-md aspect-[1.586/1] flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[14px] font-semibold tracking-wide uppercase">Mastercard</span>
                        {/* Overlapping circles for MasterCard logo */}
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 rounded-full bg-[#EA3C12] opacity-90"></div>
                          <div className="w-7 h-7 rounded-full bg-[#F59E0B] opacity-90"></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-[20px] font-bold tracking-[0.2em] font-mono">
                          {activeTx.maskedCardNumber ? activeTx.maskedCardNumber.replace(/\*/g, ' •').replace(/(\d{4})/g, '$1 ') : "5191 •••• •••• 0199"}
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-gray-300">
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-gray-400">Cardholder</span>
                            <span className="font-semibold text-white">CUSTOMER NAME</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-gray-400">Expires</span>
                            <span className="font-semibold text-white">12/28</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Information Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                      <h3 className="text-[13.5px] font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Invoice Information
                      </h3>
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Invoice Number</span>
                          <span className="text-[13px] font-semibold text-gray-800 font-mono flex items-center gap-1.5">
                            {activeTx.invoiceNumber || "INV-402049"}
                            <button
                              onClick={() => handleCopy(activeTx.invoiceNumber || "INV-402049", "invoiceNo")}
                              className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
                            >
                              {copiedField === "invoiceNo" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                        </div>

                        {activeTx.invoicePdfUrl ? (
                          <a
                            href={activeTx.invoicePdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full h-10 bg-blue-50 hover:bg-blue-100/80 text-blue-600 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 border border-blue-100"
                          >
                            <Eye className="w-4 h-4" />
                            View Invoice
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full h-10 bg-gray-50 text-gray-400 rounded-xl text-[13px] font-bold cursor-not-allowed opacity-60 flex items-center justify-center gap-2 border border-gray-150"
                          >
                            <Eye className="w-4 h-4" />
                            View Invoice
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Need more help? Panel */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <h3 className="text-[13.5px] font-bold text-gray-900 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        Need more help?
                      </h3>
                      <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                        If you have any questions, contact our support team.
                      </p>
                      <a
                        href="mailto:support@paynex.world"
                        className="inline-flex items-center gap-1 text-[12.5px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Contact Support
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={
      <div className="w-full flex items-center justify-center py-20 bg-white min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#102B4E]" />
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
}
