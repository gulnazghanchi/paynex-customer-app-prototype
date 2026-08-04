"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronRight, MoreHorizontal, Eye, CreditCard, ChevronUp, Loader2, ArrowUp, FileText, Check } from "lucide-react";
import { MerchantLocationModal } from "./MerchantLocationModal";
import { ProjectModal } from "./ProjectModal";
import { MonthlyStatement } from "./MonthlyStatement";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const activeTab = tab === "monthly-statement" ? "Monthly Statement" : "Transaction Report";
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(true);
  const [isTxDetailsOpen, setIsTxDetailsOpen] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [cardTypeFilter, setCardTypeFilter] = useState("All");
  const [dateSelectionMode, setDateSelectionMode] = useState<'all' | 'date'>('all');
  const [startDate, setStartDate] = useState("2026-06-13");
  const [endDate, setEndDate] = useState("2026-07-13");

  const [productSearch, setProductSearch] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [storeSearch, setStoreSearch] = useState("");
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const [productsList, setProductsList] = useState<any[]>([]);
  const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false);
  const [selectedMerchantCount, setSelectedMerchantCount] = useState(1);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProjectCount, setSelectedProjectCount] = useState(1);

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
        if (!hasSearched) return;

        const token = localStorage.getItem("paynexToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

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
        if (productFilter !== "All") {
          url += `&productId=${productFilter}`;
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

            if (channelFilter === "E-Commerce") {
              processedTransactions = processedTransactions.filter((tx: any) => tx.projectId === "project_7f3a91b4de82c6");
            } else if (channelFilter === "TAP") {
              processedTransactions = processedTransactions.filter((tx: any) => tx.projectId !== "project_7f3a91b4de82c6");
            }

            if (cardTypeFilter !== "All") {
              processedTransactions = processedTransactions.filter((tx: any) => {
                const ct = (tx.cardType || "").toLowerCase();
                const ft = cardTypeFilter.toLowerCase();
                return ct.includes(ft) || (ft === 'amex' && ct.includes('american express'));
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
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, hasSearched]);



  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const day = d.getDate();
      const month = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear();
      let hour = d.getHours();
      const minute = d.getMinutes().toString().padStart(2, '0');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      const hourStr = hour.toString().padStart(2, '0');
      return `${day} ${month}, ${year}, ${hourStr}:${minute} ${ampm}`;
    } catch {
      return isoString;
    }
  };

  const formatDateSplit = (isoString: string) => {
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

  const handleCSVDownload = () => {
    setIsDownloadOpen(false);
    const headers = ["Date & time", "Session ID", "Card type", "Amount", "Status", "Type"];
    const rows = transactions.map((tx, idx) => {
      const date = formatDate(tx.createdAt);
      const orderId = tx.orderId || `ORD-${String(idx + 1).padStart(4, '0')}`;
      const cardType = tx.cardType ? tx.cardType.toLowerCase() : "N/A";
      const amount = Number(tx.amount || 0).toFixed(2);
      const statusRaw = (tx.transactionStatus || "Success").toLowerCase();
      const status = ["success", "authorized"].includes(statusRaw) ? "Approved" :
        ["failure", "unauthorized", "failed", "declined"].includes(statusRaw) ? "Declined" : statusRaw;
      const type = tx.transactionType === "PreAuth" ? "Preauthorization" : tx.transactionType === "Capture" ? "Purchase" : tx.transactionType;
      return [`"${date}"`, orderId, cardType, amount, status, type].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePDFDownload = () => {
    setIsDownloadOpen(false);
    const doc = new jsPDF();
    const headers = [["Session ID", "Card", "Card type", "Amount", "Status", "Type", "Channel", "Entry", "Date"]];
    const data = transactions.map((tx, idx) => {
      const orderId = tx.orderId || `ORD-${String(idx + 1).padStart(4, '0')}`;
      const card = tx.maskedCardNumber || "******0758";
      const cardType = tx.cardType ? tx.cardType.toLowerCase() : "N/A";
      const amount = Number(tx.amount || 0).toFixed(2);
      const statusRaw = (tx.transactionStatus || "Success").toLowerCase();
      const status = ["success", "authorized"].includes(statusRaw) ? "Approved" :
        ["failure", "unauthorized", "failed", "declined"].includes(statusRaw) ? "Declined" : statusRaw;
      const type = tx.transactionType === "PreAuth" ? "Preauthorization" : tx.transactionType === "Capture" ? "Purchase" : tx.transactionType;
      const channel = tx.transactionType === "CaptureWithToken" ? "E-Comm" : "Terminal";
      const entryMethod = tx.transactionType === "CaptureWithToken" ? "Manual" : "TAP";
      const date = formatDate(tx.createdAt);
      return [orderId, card, cardType, `$${amount}`, status, type, channel, entryMethod, date];
    });

    doc.text("Transactions Report", 14, 15);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 43, 78] }
    });
    doc.save("transactions_report.pdf");
  };

  const renderSearchForm = () => {
    return (
      <div className="w-full bg-white font-sans text-gray-800">
        <h1 className="text-[22px] font-semibold text-center mb-8 text-gray-900">Find A Transaction</h1>

        <div className="flex gap-8 w-full mx-auto px-6">
          {/* Content / Accordions */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Store and Date Accordion */}
            <div className="border border-[#CBD5E1] bg-white rounded-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E1] bg-white">
                <h2 className="text-[14px] font-bold text-gray-900">Store and Date</h2>
                <ChevronUp className="w-5 h-5 text-[#64748B]" />
              </div>
              <div className="p-8 pb-12 flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <span className="text-[13px] text-gray-900 font-semibold min-w-[80px]">Store(s)<span className="text-red-500">*</span></span>
                  <div className="relative w-[280px]">
                    <button
                      onClick={() => setIsMerchantModalOpen(true)}
                      className="w-full text-left bg-white border border-[#CBD5E1] text-[13px] text-gray-900 px-4 py-2 pr-10 rounded-[2px] focus:outline-none hover:border-gray-400 transition-colors"
                    >
                      {selectedMerchantCount} Selected
                    </button>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-[13px] text-gray-900 font-semibold min-w-[80px]">Project(s)<span className="text-red-500">*</span></span>
                  <div className="relative w-[280px]">
                    <button
                      onClick={() => setIsProjectModalOpen(true)}
                      className="w-full text-left bg-white border border-[#CBD5E1] text-[13px] text-gray-900 px-4 py-2 pr-10 rounded-[2px] focus:outline-none hover:border-gray-400 transition-colors"
                    >
                      {selectedProjectCount} Selected
                    </button>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {isMerchantModalOpen && (
                  <MerchantLocationModal
                    onClose={() => setIsMerchantModalOpen(false)}
                    onApply={(count) => {
                      setSelectedMerchantCount(count);
                      setIsMerchantModalOpen(false);
                    }}
                  />
                )}

                {isProjectModalOpen && (
                  <ProjectModal
                    onClose={() => setIsProjectModalOpen(false)}
                    onApply={(count) => {
                      setSelectedProjectCount(count);
                      setIsProjectModalOpen(false);
                    }}
                  />
                )}

                <div className="flex items-center gap-12 ml-[104px]">
                  <label
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setDateSelectionMode('all')}
                  >
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                      {dateSelectionMode === 'all' && <div className="w-2 h-2 rounded-full bg-gray-600"></div>}
                    </div>
                    <span className="text-[13px] text-gray-900">All Transactions</span>
                  </label>
                </div>

                <div className="flex items-center gap-6 ml-[104px]">
                  <div className="flex items-center gap-12 shrink-0">
                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setDateSelectionMode('date')}
                    >
                      <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                        {dateSelectionMode === 'date' && <div className="w-2 h-2 rounded-full bg-gray-600"></div>}
                      </div>
                      <span className="text-[13px] text-gray-900">Transaction Date</span>
                    </label>
                  </div>

                  <div className={`flex items-center gap-4 transition-opacity ${dateSelectionMode === 'all' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500 mb-1">Start Date</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-[#CBD5E1] px-2 py-1.5 text-[13px] text-gray-900 rounded-sm w-[140px] text-center bg-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500 mb-1">End Date</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-[#CBD5E1] px-2 py-1.5 text-[13px] text-gray-900 rounded-sm w-[140px] text-center bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details Accordion */}
            <div className="border border-[#CBD5E1] bg-white rounded-sm mt-2">
              <button
                onClick={() => setIsTxDetailsOpen(!isTxDetailsOpen)}
                className="w-full flex items-center justify-between px-6 py-4 bg-white"
              >
                <h2 className="text-[14px] font-bold text-gray-900">Transaction Details</h2>
                {isTxDetailsOpen ? <ChevronUp className="w-5 h-5 text-[#64748B]" /> : <ChevronDown className="w-5 h-5 text-[#64748B]" />}
              </button>

              {isTxDetailsOpen && (
                <div className="p-8 flex items-start gap-16 border-t border-[#CBD5E1]">
                  {/* Left Column Fields */}
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center gap-6">
                      <span className="text-[13px] text-gray-900 font-semibold min-w-[120px]">Transaction Type</span>
                      <div className="relative flex-1">
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="w-full appearance-none bg-white border border-[#CBD5E1] text-[13px] text-gray-900 px-4 py-2 pr-10 rounded-sm focus:outline-none"
                        >
                          <option value="All">Select Transaction Type</option>
                          <option value="PreAuth">Preauthorization</option>
                          <option value="Capture">Purchase</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <span className="text-[13px] text-gray-900 font-semibold min-w-[120px]">Transaction Status</span>
                      <div className="relative flex-1">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full appearance-none bg-white border border-[#CBD5E1] text-[13px] text-gray-900 px-4 py-2 pr-10 rounded-sm focus:outline-none"
                        >
                          <option value="All">Select Transaction Status</option>
                          <option value="success">Approved</option>
                          <option value="failed">Declined</option>
                          <option value="refunded">Refunded</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <span className="text-[13px] text-gray-900 font-semibold min-w-[120px]">Card Type</span>
                      <div className="relative flex-1">
                        <select
                          value={cardTypeFilter}
                          onChange={(e) => setCardTypeFilter(e.target.value)}
                          className="w-full appearance-none bg-white border border-[#CBD5E1] text-[13px] text-gray-900 px-4 py-2 pr-10 rounded-sm focus:outline-none"
                        >
                          <option value="All">Select Card Type</option>
                          <option value="Visa">VISA</option>
                          <option value="Mastercard">MASTERCARD</option>
                          <option value="Amex">AMEX</option>
                          <option value="Discover">DISCOVER</option>
                          <option value="JCB">JCB</option>
                          <option value="Interac">INTERAC</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column Fields */}
                  <div className="flex-1 flex flex-col gap-6 pt-2">
                    <div className="flex items-center gap-6">
                      <span className="text-[13px] text-gray-900 min-w-[120px]">Product Serial Number</span>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => { setProductSearch(e.target.value); setIsProductDropdownOpen(true); }}
                          onFocus={() => setIsProductDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setIsProductDropdownOpen(false), 200)}
                          placeholder="Type or select..."
                          className="w-full border border-[#CBD5E1] px-4 py-1.5 pr-10 text-[13px] text-gray-900 rounded-sm bg-white focus:outline-none"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        {isProductDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#CBD5E1] rounded-sm shadow-lg z-50 max-h-48 overflow-y-auto">
                            {productsList
                              ?.filter((p: any) => {
                                const search = productSearch.toLowerCase();
                                return !productSearch ||
                                  (p.name || "").toLowerCase().includes(search) ||
                                  (p.serialNumber || p.productId || p.id || "").toLowerCase().includes(search);
                              })
                              .map((p: any, idx: number) => {
                                const serial = p.serialNumber || p.productId || p.id;
                                return (
                                  <div
                                    key={p.id || idx}
                                    className="px-4 py-2 text-[13px] text-gray-900 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                      setProductSearch(serial || p.name);
                                      setIsProductDropdownOpen(false);
                                    }}
                                  >
                                    {serial} - {p.name}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <span className="text-[13px] text-gray-900 min-w-[120px]">Store ID or Name</span>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={storeSearch}
                          onChange={(e) => { setStoreSearch(e.target.value); setIsStoreDropdownOpen(true); }}
                          onFocus={() => setIsStoreDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setIsStoreDropdownOpen(false), 200)}
                          placeholder="Type or select..."
                          className="w-full border border-[#CBD5E1] px-4 py-1.5 pr-10 text-[13px] text-gray-900 rounded-sm bg-white focus:outline-none"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        {isStoreDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#CBD5E1] rounded-sm shadow-lg z-50 max-h-48 overflow-y-auto">
                            {[
                              { id: "STR-001", name: "Main Store" },
                              { id: "STR-002", name: "Downtown Branch" }
                            ]
                              .filter(s => !storeSearch || s.name.toLowerCase().includes(storeSearch.toLowerCase()) || s.id.toLowerCase().includes(storeSearch.toLowerCase()))
                              .map((s, idx) => (
                                <div
                                  key={idx}
                                  className="px-4 py-2 text-[13px] text-gray-900 hover:bg-gray-50 cursor-pointer"
                                  onClick={() => {
                                    setStoreSearch(s.id);
                                    setIsStoreDropdownOpen(false);
                                  }}
                                >
                                  {s.id} - {s.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="relative flex items-center justify-center mt-8 w-full">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setHasSearched(true)}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-12 py-2 rounded-sm text-[14px] font-medium"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("All");
                    setTypeFilter("All");
                    setProductFilter("All");
                    setChannelFilter("All");
                    setCardTypeFilter("All");
                    setDateSelectionMode("all");
                    setProductSearch("");
                    setStoreSearch("");
                    setHasSearched(true);
                  }}
                  className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors px-12 py-2 rounded-sm text-[14px] font-medium"
                >
                  Reset
                </button>
              </div>
              {hasSearched && (
                <div className="absolute right-0 top-0">
                  <div className="relative">
                    <button
                      onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                      onBlur={() => setTimeout(() => setIsDownloadOpen(false), 200)}
                      className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors px-8 py-2 rounded-sm text-[14px] font-medium flex items-center gap-2"
                    >
                      Download <ChevronDown className="w-4 h-4" />
                    </button>
                    {isDownloadOpen && (
                      <div className="absolute top-full right-0 mt-1 bg-white border border-[#CBD5E1] rounded-sm shadow-lg z-50 w-full overflow-hidden">
                        <div
                          className="px-4 py-2 text-[13px] text-gray-900 hover:bg-gray-50 cursor-pointer text-center"
                          onClick={handleCSVDownload}
                        >
                          CSV Download
                        </div>
                        <div
                          className="px-4 py-2 text-[13px] text-gray-900 hover:bg-gray-50 cursor-pointer border-t border-[#CBD5E1] text-center"
                          onClick={handlePDFDownload}
                        >
                          PDF Download
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-100px)] bg-white font-sans">


      {activeTab === "Transaction Report" && (
        <>
          {renderSearchForm()}

          {hasSearched && (
            <div className="w-full mx-auto px-6 space-y-6 pt-12 pb-16">


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
                  <tr className="border-b border-gray-200 bg-white divide-x divide-gray-100">
                    {["Date & time", "Session ID", "Card type", "Serial Number", "Amount", "Status", "Type"].map((header, i) => (
                      <th key={i} className="px-5 py-4 text-[16px] font-bold text-gray-900 whitespace-nowrap text-left">
                        <div className="flex items-center gap-1.5 justify-start">
                          {header}
                          <ArrowUp className="w-3 h-3 text-gray-300" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors bg-white divide-x divide-gray-100">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-gray-900">{formatDateSplit(tx.createdAt).date}</span>
                            {formatDateSplit(tx.createdAt).time && <span className="text-[12px] font-medium text-gray-500">{formatDateSplit(tx.createdAt).time}</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                          <Link href={`/dashboard/transactions/order?ids=${getTxIdsForOrderId(tx.orderId)}`} className="text-blue-600 hover:underline">
                            {tx.orderId || `ORD-${String(idx + 1).padStart(4, '0')}`}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                          <div className="flex items-center gap-2">
                            <CardIcon type={tx.cardType} />
                            <span className="capitalize">{tx.cardType ? tx.cardType.toLowerCase() : "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                          {tx.product?.serialNumber || tx.productId || "-"}
                        </td>
                        <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-900">
                          ${Number(tx.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[12px] font-medium capitalize border ${["success", "captured", "authorized"].includes((tx.transactionStatus || "success").toLowerCase())
                            ? "border-green-600 bg-green-50 text-green-700"
                            : ["failed", "declined", "failure", "unauthorized"].includes((tx.transactionStatus || "").toLowerCase())
                              ? "border-red-600 bg-red-50 text-red-700"
                              : "border-yellow-600 bg-yellow-50 text-yellow-700"
                            }`}>
                            {["success", "authorized"].includes((tx.transactionStatus || "Success").toLowerCase()) ? "Approved" :
                              ["failure", "unauthorized", "failed", "declined"].includes((tx.transactionStatus || "Success").toLowerCase()) ? "Declined" :
                                (tx.transactionStatus || "Success").toLowerCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                          {tx.transactionType === "PreAuth" ? "Preauthorization" : tx.transactionType === "Capture" ? "Purchase" : tx.transactionType}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-gray-500 text-[13px] font-medium">
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
          )}
        </>
      )}

      {activeTab === "Monthly Statement" && (
        <MonthlyStatement />
      )}
    </div>
  );
}
