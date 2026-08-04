"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Store, Loader2, ArrowUp, RefreshCcw, Sliders, ChevronDown, Check, Plus, X, ArrowLeft, Copy, CreditCard, Calendar, ArrowUpDown } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [projectFilter, setProjectFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [productTransactions, setProductTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const handleCopy = (text: string, fieldId: string) => {
    if (!text || text === "-") return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedProduct) {
        setProductTransactions([]);
        return;
      }
      setIsLoadingTransactions(true);
      try {
        const token = localStorage.getItem("paynexToken");
        if (!token) return;

        const response = await fetch(`https://api.paynex.world/v1/merchant/transaction?skip=0&take=50&orderBy=createdAt%7Cdesc&include=product&gatewayEnv=Live`, {
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer ${token}`,
            "paynex-mode": "Test"
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.list)) {
            const filtered = data.list.filter((tx: any) => 
              tx.productId === selectedProduct.productId || 
              tx.productId === selectedProduct.id ||
              tx.product?.productId === selectedProduct.productId ||
              tx.product?.serialNumber === selectedProduct.serialNumber
            );
            setProductTransactions(filtered);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product transactions", err);
      } finally {
        setIsLoadingTransactions(false);
      }
    };
    fetchTransactions();
  }, [selectedProduct]);

  const dummyProjects = [
    { id: "proj_1", name: "All Projects" },
    { id: "proj_2", name: "Moneris E-Commerce (CA)" },
    { id: "proj_3", name: "Infosysltd45" },
    { id: "proj_4", name: "Elavon Payment Gateway" },
    { id: "proj_5", name: "Chase Paymentech (US)" }
  ];

  const toggleFilter = (filterType: string) => {
    setActiveFilters(prev => {
      const isCurrentlyActive = prev.includes(filterType);
      
      if (isCurrentlyActive) {
        if (filterType === 'project') setProjectFilter("All");
        return prev.filter(f => f !== filterType);
      } else {
        return [...prev, filterType];
      }
    });
  };

  const TAKE = 15;
  const totalPages = Math.ceil(totalCount / TAKE) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("paynexToken");
        if (!token) return;

        const skip = (currentPage - 1) * TAKE;
        let url = `https://api.paynex.world/v1/merchant/product?skip=${skip}&take=${TAKE}&orderBy=createdAt%7Cdesc&include=store&search_column=serialNumber&search_column=paymentProviderDeviceId&search_column=keyCodeIdentifier&search_column=productId&gatewayEnv=Live`;
        
        if (searchQuery) {
          url += `&search_text=${encodeURIComponent(searchQuery)}`;
        }
        if (projectFilter !== "All") {
          url += `&projectId=${projectFilter}`;
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
            setProducts(data.list);
            setTotalCount(data.total || 0);
          } else {
            setProducts([]);
            setTotalCount(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, projectFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(d);
    } catch {
      return isoString;
    }
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

  if (selectedProduct) {
    return (
      <div className="w-full space-y-6 pt-6 md:pt-8 pb-16 md:pb-20 px-6 md:px-8">
        {/* Back Button and Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors text-[13px] font-semibold mb-2 bg-transparent border-none cursor-pointer p-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Product Details</h1>
            <div className="flex items-center gap-1.5 text-[13.5px]">
              <span className="text-gray-500 font-medium">Product ID:</span>
              <span className="text-blue-600 font-semibold font-mono">{selectedProduct.productId || selectedProduct.id}</span>
            </div>
          </div>
        </div>

        {/* 4 Highlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Serial Number */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Store className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-semibold text-gray-400">Serial Number</span>
            </div>
            <div className="text-[16px] font-bold text-gray-900 tracking-tight font-mono">
              {selectedProduct.serialNumber || "-"}
            </div>
          </div>

          {/* Card 2: Terminal ID */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Calendar className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-semibold text-gray-400">Terminal ID</span>
            </div>
            <div className="text-[14px] font-bold text-gray-900 tracking-tight font-mono">
              {selectedProduct.paymentProviderDeviceId || "-"}
            </div>
          </div>

          {/* Card 3: Key Code ID */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <CreditCard className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-semibold text-gray-400">Key Code ID</span>
            </div>
            <div className="text-[14px] font-bold text-gray-900 tracking-tight font-mono">
              {selectedProduct.keyCodeIdentifier || "-"}
            </div>
          </div>

          {/* Card 4: Total Transactions */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <ArrowUpDown className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-semibold text-gray-400">Total Transactions</span>
            </div>
            <div className="text-[16px] font-bold text-gray-900 tracking-tight">
              {isLoadingTransactions ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                productTransactions.length
              )}
            </div>
          </div>
        </div>

        {/* Transactions List Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <ArrowUpDown className="w-4 h-4 text-blue-600" />
            Product Transactions List
          </h2>
          <div className="overflow-x-auto">
            {isLoadingTransactions ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
                <p className="text-[13px] text-gray-400 font-medium">Fetching transactions...</p>
              </div>
            ) : productTransactions.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 w-[25%]">Date & Time</th>
                    <th className="pb-3 w-[30%]">Transaction ID</th>
                    <th className="pb-3 w-[15%]">Amount</th>
                    <th className="pb-3 w-[15%]">Status</th>
                    <th className="pb-3 w-[15%] text-right">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {productTransactions.map((tx, i) => {
                    const statusStr = ["success", "authorized", "captured", "approved"].includes((tx.transactionStatus || "").toLowerCase()) ? "Approved" : "Declined";
                    return (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 text-[13px] text-gray-600">
                          {formatDate(tx.createdAt)}
                        </td>
                        <td className="py-4 text-[13px] font-semibold text-[#0F172A] font-mono">
                          {tx.transactionId}
                        </td>
                        <td className="py-4 text-[13px] font-semibold text-slate-700">
                          ${Number(tx.amount || 0).toFixed(2)}
                        </td>
                        <td className="py-4 text-[13px] text-gray-600">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStr === "Approved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            {statusStr}
                          </span>
                        </td>
                        <td className="py-4 text-[13px] text-gray-600 text-right">
                          {tx.transactionType === "PreAuth" ? "Preauthorization" : tx.transactionType === "Capture" ? "Purchase" : tx.transactionType}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-[13px] text-gray-400 font-medium">
                No transactions recorded for this product.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pt-6 md:pt-8 pb-16 md:pb-20 px-6 md:px-8">
      
      {/* Redesigned Header and Filter Bar */}
      {/* Redesigned Header and Filter Bar */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Row 1: Title & Subtitle on Left, Request to Add Button on Right */}
        <div className="flex justify-between items-start sm:items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-[13px] text-gray-500 font-medium">View and manage your products</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" />
            Request to Add
          </button>
        </div>

        {/* Row 2: Filter Options & Actions */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="hidden xl:block"></div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
            {/* Refresh Button */}
            <button 
              onClick={() => {
                const token = localStorage.getItem("paynexToken");
                if (!token) return;
                setIsLoading(true);
                const skip = (currentPage - 1) * TAKE;
                let url = `https://api.paynex.world/v1/merchant/product?skip=${skip}&take=${TAKE}&orderBy=createdAt%7Cdesc&include=store&search_column=serialNumber&search_column=paymentProviderDeviceId&search_column=keyCodeIdentifier&search_column=productId&gatewayEnv=Live`;
                if (searchQuery) url += `&search_text=${encodeURIComponent(searchQuery)}`;
                if (projectFilter !== "All") url += `&projectId=${projectFilter}`;
                fetch(url, {
                  headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Authorization": `Bearer ${token}`,
                    "paynex-mode": "Test"
                  }
                })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                  if (data && Array.isArray(data.list)) {
                    setProducts(data.list);
                    setTotalCount(data.total || 0);
                  }
                })
                .finally(() => setIsLoading(false));
              }}
              className="h-10 px-2.5 text-[14px] text-[#22c55e] hover:text-green-700 font-semibold flex items-center gap-2 transition-all cursor-pointer bg-transparent border-none"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>

            {/* Project Filter */}
            <div className="relative">
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                {dummyProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button className={`h-10 px-3.5 border rounded-xl text-[13.5px] flex items-center gap-2 pointer-events-none transition-all shadow-sm font-semibold ${projectFilter !== "All" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
                <Sliders className={`w-4 h-4 ${projectFilter !== "All" ? "text-blue-600" : "text-gray-400"}`} />
                <span>{projectFilter === "All" ? "Project" : dummyProjects.find(p => p.id === projectFilter)?.name || projectFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 ${projectFilter !== "All" ? "text-blue-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by serial number..."
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
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200 bg-[#f8fafc]">
                {["Serial Number", "Store", "Terminal ID", "Key Code Identifier", "Created At"].map((header, i) => (
                  <th key={i} className="px-5 py-4 text-[13.5px] font-bold text-gray-700 whitespace-nowrap text-left">
                    <div className="flex items-center gap-1.5 justify-start">
                      {header}
                      <ArrowUp className="w-3 h-3 text-gray-300" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <tr key={idx} onClick={() => setSelectedProduct(product)} className="hover:bg-gray-50/50 transition-colors bg-white cursor-pointer">
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                      {product.serialNumber || "-"}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">
                      <div className="inline-flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-gray-400" />
                        {product.store?.name || "-"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">{product.paymentProviderDeviceId || "-"}</td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">{product.keyCodeIdentifier || "-"}</td>
                    <td className="px-5 py-4 text-[13px] font-normal whitespace-nowrap text-gray-700">{formatDate(product.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500 text-[13px] font-medium">
                    {isLoading ? "Loading products..." : "No products found matching your criteria."}
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
          Showing {products.length > 0 ? (currentPage - 1) * TAKE + 1 : 0} to {Math.min(currentPage * TAKE, totalCount)} of {totalCount} results
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
              className={`h-10 min-w-[40px] px-2 flex items-center justify-center rounded-md text-[14px] font-medium transition-colors shadow-sm ${
                page === currentPage
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
      
      {/* Request to Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-[450px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[16px] font-bold text-gray-900">Request to Add Product</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Toronto, ON"
                  className="w-full h-10 px-3 border border-gray-300 rounded-[6px] text-[13px] text-gray-900 focus:outline-none focus:border-[#102B4E] focus:ring-1 focus:ring-[#102B4E] transition-colors shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">How many products?</label>
                <input 
                  type="number" 
                  min="1"
                  placeholder="e.g. 10"
                  className="w-full h-10 px-3 border border-gray-300 rounded-[6px] text-[13px] text-gray-900 focus:outline-none focus:border-[#102B4E] focus:ring-1 focus:ring-[#102B4E] transition-colors shadow-sm"
                />
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-300 rounded-[6px] hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-[13px] font-medium text-white bg-[#102B4E] rounded-[6px] hover:bg-[#1a4073] transition-colors shadow-sm"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
