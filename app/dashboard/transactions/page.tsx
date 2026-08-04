"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Filter, Search, ChevronDown, FileText, ChevronLeft, ChevronRight, Loader2, Calendar, RefreshCcw, Download, Sliders, ArrowUp, Settings, MoreHorizontal, Eye, CreditCard, Check, CircleDot, ArrowUpDown } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";

const CardIcon = ({ type }: { type: string }) => {
  const normalizedType = (type || "").toLowerCase();

  if (normalizedType.includes("visa")) {
    return <div className="h-4 w-7 bg-[#1434CB] text-white text-[9px] font-bold flex items-center justify-center rounded-[2px] italic tracking-tighter">VISA</div>;
  }
  if (normalizedType.includes("master")) {
    return (
      <div className="h-4 w-7 flex items-center justify-center relative">
        <div className="w-4 h-4 bg-[#EB001B] rounded-full absolute left-0.5 opacity-90 z-10"></div>
        <div className="w-4 h-4 bg-[#F79E1B] rounded-full absolute right-0.5 opacity-90"></div>
      </div>
    );
  }
  if (normalizedType.includes("amex") || normalizedType.includes("american")) {
    return <div className="h-4 w-7 bg-[#006FCF] text-white text-[7px] font-bold flex items-center justify-center rounded-[2px] tracking-tight">AMEX</div>;
  }
  return <CreditCard className="w-4 h-4 text-gray-400" />;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [cardTypeFilter, setCardTypeFilter] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState("All time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const [productsList, setProductsList] = useState<any[]>([]);

  const TAKE = 10;
  const totalPages = Math.ceil(totalCount / TAKE) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("paynexToken");
        if (!token) return;
        const res = await fetch(`https://api.paynex.world/v1/merchant/product?take=50`, {
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer ${token}`,
            "paynex-mode": "Test"
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.list)) {
            setProductsList(data.list);
          }
        }
      } catch (e) {
        console.error("Failed to fetch products for filter", e);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("paynexToken");
        if (!token) return;

        const skip = (currentPage - 1) * TAKE;
        let url = `https://api.paynex.world/v1/merchant/transaction?skip=${skip}&take=${TAKE}&orderBy=createdAt%7Cdesc&include=merchant&include=product&search_column=transactionId&gatewayEnv=Live`;

        if (searchQuery) {
          url += `&search_text=${encodeURIComponent(searchQuery)}`;
        }
        if (statusFilter !== "All") {
          url += `&transactionStatus=${statusFilter.toLowerCase()}`;
        }
        if (typeFilter !== "All") {
          url += `&transactionType=${typeFilter}`;
        }
        if (productFilter !== "All" && productFilter !== "") {
          const matchedProduct = productsList.find((p: any) =>
            (p.serialNumber || "").toLowerCase() === productFilter.toLowerCase() ||
            (p.productId || p.id) === productFilter
          );
          const finalId = matchedProduct ? (matchedProduct.productId || matchedProduct.id) : productFilter;
          url += `&productId=${finalId}`;
        }

        const response = await fetch(url, {
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer ${token}`,
            "paynex-mode": "Test"
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.list)) {
            let currentOrderNum = 1;
            const rootMap = new Map();

            const getRoot = (txId: string, visited = new Set<string>()): string => {
              if (!txId || visited.has(txId)) return txId || '';
              visited.add(txId);
              const tx = data.list.find((t: any) => t && t.transactionId === txId);
              if (tx && tx.parentTransactionId) {
                return getRoot(tx.parentTransactionId, visited);
              }
              return tx ? tx.transactionId : txId;
            };

            let processedTransactions = data.list.map((tx: any) => {
              if (!tx) return tx;
              const rootId = getRoot(tx.transactionId);
              if (rootId && !rootMap.has(rootId)) {
                rootMap.set(rootId, `ORD-${String(currentOrderNum++).padStart(4, '0')}`);
              }
              return { ...tx, orderId: rootId ? rootMap.get(rootId) : '-' };
            });

            if (channelFilter !== "All") {
              processedTransactions = processedTransactions.filter((tx: any) => {
                const channel = tx.transactionType === "CaptureWithToken" ? "e-commerce" : "Terminal";
                return channel.toLowerCase() === channelFilter.toLowerCase();
              });
            }

            if (cardTypeFilter !== "All") {
              processedTransactions = processedTransactions.filter((tx: any) => {
                const ct = (tx.cardType || "").toLowerCase();
                const ft = cardTypeFilter.toLowerCase();

                if (ft === 'amex') {
                  return ct.includes('amex') || ct.includes('american');
                }
                if (ft === 'interac') {
                  return ct.includes('interac') || ct.includes('intract');
                }
                if (ft === 'mastercard') {
                  return ct.includes('mastercard') || ct.includes('master');
                }
                return ct.includes(ft);
              });
            }

            if (timeFilter !== "All time") {
              const now = new Date();
              processedTransactions = processedTransactions.filter((tx: any) => {
                const txDate = new Date(tx.createdAt);
                if (isNaN(txDate.getTime())) return true;
                if (timeFilter === "This week") {
                  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return txDate >= oneWeekAgo;
                }
                if (timeFilter === "This month") {
                  return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
                }
                if (timeFilter === "Custom date" && startDate && endDate) {
                  return txDate >= new Date(startDate) && txDate <= new Date(endDate + 'T23:59:59');
                }
                return true;
              });
            }

            setTransactions(processedTransactions);
            setTotalCount(data.total || 0);
          } else {
            setTransactions([]);
            setTotalCount(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTransactions();
    }, 400);

    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, statusFilter, typeFilter, productFilter, channelFilter, cardTypeFilter, timeFilter, startDate, endDate]);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, productFilter, channelFilter, cardTypeFilter, timeFilter, startDate, endDate]);

  const formatDate = (isoString: string) => {
    try {
      const parsed = typeof isoString === "number" || (typeof isoString === "string" && !isNaN(Number(isoString))) ? Number(isoString) * (String(isoString).length === 10 ? 1000 : 1) : isoString;
      const d = new Date(parsed);
      if (isNaN(d.getTime())) return { date: isoString || "-", time: "" };

      const day = d.getDate();
      const month = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear();
      let hour = d.getHours();
      const minute = d.getMinutes().toString().padStart(2, '0');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      const hourStr = hour.toString().padStart(2, '0');

      return {
        date: `${day} ${month} ${year}`,
        time: `${hourStr}:${minute} ${ampm}`
      };
    } catch {
      return { date: isoString || "-", time: "" };
    }
  };

  const getTxIdsForOrderId = (orderId: string) => {
    if (!orderId || orderId === '-') return '';
    return transactions.filter(t => t.orderId === orderId).map(t => t.transactionId).join(',');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const generatePagination = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };


  return (
    <div className="w-full space-y-6 pt-6 md:pt-8 pb-16 md:pb-20 px-6 md:px-8">

      {/* Redesigned Header and Filter Bar */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Left: Title & Subtitle */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">All Transactions</h1>
          <p className="text-[13px] text-gray-500 font-medium">Manage all transaction here</p>
        </div>

        {/* Row 2: Filter Options (Left) & Actions (Right) */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          {/* Left: All filters by default visible */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="All">Transaction Type</option>
                <option value="Capture">Purchase</option>
                <option value="PreAuth">Preauthorization</option>
              </select>
              <button className={`h-10 px-3.5 border rounded-xl text-[13.5px] flex items-center gap-2 pointer-events-none transition-all shadow-sm font-semibold ${typeFilter !== "All" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
                <ArrowUpDown className={`w-4 h-4 ${typeFilter !== "All" ? "text-blue-600" : "text-gray-400"}`} />
                <span>{typeFilter === "All" ? "Type" : (typeFilter === "PreAuth" ? "Preauthorization" : (typeFilter === "Capture" ? "Purchase" : typeFilter))}</span>
                <ChevronDown className={`w-3.5 h-3.5 ${typeFilter !== "All" ? "text-blue-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="All">Status</option>
                <option value="success">Approved</option>
                <option value="failed">Declined</option>
                <option value="refunded">Refunded</option>
              </select>
              <button className={`h-10 px-3.5 border rounded-xl text-[13.5px] flex items-center gap-2 pointer-events-none transition-all shadow-sm font-semibold ${statusFilter !== "All" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
                <CircleDot className={`w-4 h-4 ${statusFilter !== "All" ? "text-blue-600" : "text-gray-400"}`} />
                <span>{statusFilter === "All" ? "Status" : statusFilter === "success" || statusFilter === "authorized" ? "Approved" : statusFilter === "failed" || statusFilter === "unauthorized" ? "Declined" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                <ChevronDown className={`w-3.5 h-3.5 ${statusFilter !== "All" ? "text-blue-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Card Filter */}
            <div className="relative">
              <select
                value={cardTypeFilter}
                onChange={(e) => setCardTypeFilter(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="All">Card Type</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">Amex</option>
                <option value="Discover">Discover</option>
                <option value="JCB">JCB</option>
                <option value="Interac">Interac</option>
              </select>
              <button className={`h-10 px-3.5 border rounded-xl text-[13.5px] flex items-center gap-2 pointer-events-none transition-all shadow-sm font-semibold ${cardTypeFilter !== "All" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
                <CreditCard className={`w-4 h-4 ${cardTypeFilter !== "All" ? "text-blue-600" : "text-gray-400"}`} />
                <span>{cardTypeFilter === "All" ? "Card Type" : cardTypeFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 ${cardTypeFilter !== "All" ? "text-blue-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Channel Filter */}
            <div className="relative">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="All">Channel</option>
                <option value="e-commerce">E-commerce</option>
                <option value="Terminal">Terminal</option>
              </select>
              <button className={`h-10 px-3.5 border rounded-xl text-[13.5px] flex items-center gap-2 pointer-events-none transition-all shadow-sm font-semibold ${channelFilter !== "All" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
                <Filter className={`w-4 h-4 ${channelFilter !== "All" ? "text-blue-600" : "text-gray-400"}`} />
                <span>{channelFilter === "All" ? "Channel" : (channelFilter === "e-commerce" ? "E-commerce" : "Terminal")}</span>
                <ChevronDown className={`w-3.5 h-3.5 ${channelFilter !== "All" ? "text-blue-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Product Filter */}
            <div className="relative">
              <input
                list="serial-numbers-list"
                value={productFilter === "All" ? "" : productFilter}
                onChange={(e) => setProductFilter(e.target.value || "All")}
                placeholder="Serial Number"
                className={`h-10 pl-4 pr-8 border rounded-xl text-[13.5px] shadow-sm font-semibold w-[170px] transition-colors focus:outline-none focus:border-blue-600 ${productFilter !== "All" ? "bg-blue-50 border-blue-200 text-blue-600 placeholder:text-blue-400" : "bg-white text-gray-700 border-gray-200 placeholder:text-gray-400 hover:bg-gray-50"}`}
              />
              <datalist id="serial-numbers-list">
                {productsList.map((p: any) => (
                  <option key={p.productId || p.id} value={p.serialNumber || p.productId || p.id} />
                ))}
              </datalist>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${productFilter !== "All" ? "text-blue-500" : "text-gray-400"}`} />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="h-11 px-2.5 text-[14px] text-[#22c55e] hover:text-green-700 font-semibold flex items-center gap-2 transition-all cursor-pointer bg-transparent border-none">
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>

            <DateRangePicker
              defaultLabel="All time"
              onApply={(range) => {
                setTimeFilter(range.label);
                if (range.start) setStartDate(range.start.toISOString().split('T')[0]);
                else setStartDate("");
                if (range.end) setEndDate(range.end.toISOString().split('T')[0]);
                else setEndDate("");
              }}
            />

            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="h-10 pl-10 pr-10 w-full bg-white border border-gray-200 rounded-[12px] text-[13px] text-slate-700 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-[22px] w-[22px] bg-white border border-gray-200 rounded-[6px] flex items-center justify-center text-[12px] text-gray-400 font-normal pointer-events-none shadow-sm">
                /
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm relative min-h-[400px] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="border-b border-gray-200 bg-[#f8fafc]">
                {["Date & time", "Order ID", "Card Number", "Card Type", "Amount", "Status", "Type", "Channel", "Serial Number", "Receipt"].map((header, i) => (
                  <th key={i} className="px-5 py-4 text-[13.5px] font-bold text-gray-700 whitespace-nowrap text-left">
                    <div className="flex items-center gap-1.5 justify-start">
                      {header}
                      {header !== "Receipt" && <ArrowUp className="w-3 h-3 text-gray-300" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-900">{formatDate(tx.createdAt).date}</span>
                        {formatDate(tx.createdAt).time && <span className="text-[12px] font-medium text-gray-500">{formatDate(tx.createdAt).time}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                      <Link href={`/dashboard/transactions/order?ids=${getTxIdsForOrderId(tx.orderId)}`} className="text-blue-600 underline">
                        {tx.orderId || `ORD-${String(idx + 1).padStart(4, '0')}`}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                      {tx.maskedCardNumber || "******0758"}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                      <div className="flex items-center gap-2">
                        <CardIcon type={tx.cardType} />
                        <span className="capitalize">{tx.cardType ? tx.cardType.toLowerCase() : "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-900">
                      ${Number(tx.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[12px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                        {["success", "authorized"].includes((tx.transactionStatus || "Success").toLowerCase()) ? "Approved" :
                          ["failure", "unauthorized", "failed", "declined"].includes((tx.transactionStatus || "Success").toLowerCase()) ? "Declined" :
                            (tx.transactionStatus || "Success").toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                      {tx.transactionType === "PreAuth" ? "Preauthorization" : tx.transactionType === "Capture" ? "Purchase" : tx.transactionType}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                      {tx.transactionType === "CaptureWithToken" ? "e-commerce" : "Terminal"}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                      {tx.product?.serialNumber || tx.productId || "-"}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {tx.invoicePdfUrl ? (
                        <a href={tx.invoicePdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 rounded-xl text-[13px] font-bold transition-all">
                          <FileText className="w-4 h-4 text-blue-600" />
                          PDF
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-400 rounded-xl text-[13px] font-bold cursor-not-allowed opacity-60">
                          <FileText className="w-4 h-4 text-gray-400" />
                          PDF
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-gray-500 text-[13px] font-medium">
                    {isLoading ? "Loading transactions..." : "No transactions found matching your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <p className="text-[13px] font-medium text-gray-500">
          Showing {transactions.length > 0 ? (currentPage - 1) * TAKE + 1 : 0} to {Math.min(currentPage * TAKE, totalCount)} of {totalCount} results
        </p>
        <div className="flex items-center gap-2">
          <div className="relative mr-2">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="h-10 px-4 border border-gray-300 rounded-md text-[13px] flex items-center gap-2 transition-colors shadow-sm font-medium bg-white text-[#102B4E] hover:bg-gray-50"
            >
              <Download className="w-4 h-4 text-[#102B4E]" />
              Download
              <ChevronDown className="w-3 h-3 text-[#102B4E]" />
            </button>

            {showDownloadMenu && (
              <div className="absolute left-0 bottom-full mb-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1 flex flex-col">
                <button
                  onClick={() => setShowDownloadMenu(false)}
                  className="px-3 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Download CSV
                </button>
                <button
                  onClick={() => setShowDownloadMenu(false)}
                  className="px-3 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Download PDF
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className="h-10 min-w-[40px] flex items-center justify-center rounded-md border border-gray-300 bg-white text-[#102B4E] hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {generatePagination().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === "..." || isLoading}
              className={`h-10 min-w-[40px] px-2 flex items-center justify-center rounded-md text-[14px] font-medium transition-colors shadow-sm ${page === currentPage
                ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"
                : page === "..."
                  ? "text-gray-400 cursor-default bg-transparent border-transparent shadow-none"
                  : "bg-white text-[#102B4E] border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className="h-10 min-w-[40px] flex items-center justify-center rounded-md border border-gray-300 bg-white text-[#102B4E] hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
