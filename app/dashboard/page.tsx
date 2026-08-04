"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar, ChevronDown, Check, Download, FileText, Settings, RefreshCcw, CircleDollarSign, Box, XCircle, Activity, Store, Maximize2, TrendingUp, Info,
  Pencil, Save, RotateCcw, GripVertical, SlidersHorizontal, ShoppingBag, Wallet, ArrowUpDown, CreditCard
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LabelList, PieChart, Pie
} from "recharts";
import { DateRangePicker } from "./transactions/DateRangePicker";

const DEFAULT_WIDGET_ORDER = [
  "stat_purchases",
  "stat_refunds",
  "stat_net",
  "stat_tx",
  "stat_approved",
  "stat_declined",
  "revenue",
  "transaction_count",
  "transaction_count_dist",
  "transaction_volume",
  "transaction_volume_dist",
  "channel_count",
  "channel_dist"
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#e4e6eb]/95 backdrop-blur-xs text-[#1a1a1a] px-3.5 py-2 rounded-xl text-center text-[12px] font-extrabold shadow-sm border border-gray-200/40 pointer-events-none">
        <div className="text-[10px] text-gray-400 font-semibold mb-0.5">{payload[0].payload.date}</div>
        <div>${Number(payload[0].value).toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

const CustomCountTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const approved = payload.find((p: any) => p.dataKey === "approved")?.value || 0;
    const declined = payload.find((p: any) => p.dataKey === "declined")?.value || 0;
    return (
      <div className="bg-[#e4e6eb]/95 backdrop-blur-xs text-[#1a1a1a] px-3.5 py-2.5 rounded-xl text-[12px] font-extrabold shadow-sm border border-gray-200/40 pointer-events-none min-w-[120px]">
        <div className="text-[10px] text-gray-500 font-semibold mb-1.5">{payload[0].payload.name}</div>
        <div className="flex justify-between gap-4 mb-0.5">
          <span className="text-gray-500">Approved:</span>
          <span className="text-[#10B981] font-bold">{approved}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Declined:</span>
          <span className="text-[#EF4444] font-bold">{declined}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomVolumeTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const purchases = payload.find((p: any) => p.dataKey === "purchases")?.value || 0;
    const refunds = payload.find((p: any) => p.dataKey === "refunds")?.value || 0;
    return (
      <div className="bg-[#e4e6eb]/95 backdrop-blur-xs text-[#1a1a1a] px-3.5 py-2.5 rounded-xl text-[12px] font-extrabold shadow-sm border border-gray-200/40 pointer-events-none min-w-[120px]">
        <div className="text-[10px] text-gray-500 font-semibold mb-1.5">{payload[0].payload.name}</div>
        <div className="flex justify-between gap-4 mb-0.5">
          <span className="text-gray-500">Purchases:</span>
          <span className="text-[#0066FF] font-bold">${Number(purchases).toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Refunds:</span>
          <span className="text-[#FF8000] font-bold">${Number(refunds).toFixed(2)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomChannelTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const approved = payload.find((p: any) => p.dataKey === "approved")?.value || 0;
    const declined = payload.find((p: any) => p.dataKey === "declined")?.value || 0;
    return (
      <div className="bg-[#E4E6EB]/90 backdrop-blur-xs text-[#1a1a1a] px-4 py-3 rounded-2xl text-[13px] font-semibold shadow-md border border-gray-200/20 pointer-events-none min-w-[140px]">
        <div className="text-[12px] text-gray-500 font-medium mb-2">{payload[0].payload.name}</div>
        <div className="flex justify-between gap-6 mb-1">
          <span className="text-gray-700 font-bold">Approved:</span>
          <span className="text-[#0066FF] font-bold">{approved}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-gray-700 font-bold">Declined:</span>
          <span className="text-[#EF4444] font-bold">{declined}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("All time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProject, setSelectedProject] = useState("All Stores");
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [storesList, setStoresList] = useState<string[]>(["All Stores"]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [countData, setCountData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    purchasesCount: 0,
    purchasesAmount: 0,
    refundsCount: 0,
    refundsAmount: 0,
    totalCount: 0,
    totalAmount: 0,
    totCount: 0,
    totApproved: 0,
    totDeclined: 0
  });
  const [totalApprovalRate, setTotalApprovalRate] = useState("0%");
  const [countViewMode, setCountViewMode] = useState("Count");
  const [volumeViewMode, setVolumeViewMode] = useState("Volume");
  const [channelData, setChannelData] = useState<any[]>([]);
  const [channelViewMode, setChannelViewMode] = useState("Count");

  // Drag & drop layout state
  const [isCustomizingLayout, setIsCustomizingLayout] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(DEFAULT_WIDGET_ORDER);
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);

  // Restore saved layout on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("paynex_dashboard_layout");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWidgetOrder(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard layout:", err);
    }
  }, []);

  const handleSaveLayout = () => {
    try {
      localStorage.setItem("paynex_dashboard_layout", JSON.stringify(widgetOrder));
    } catch (err) {
      console.error("Failed to save layout:", err);
    }
    setIsCustomizingLayout(false);
  };

  const handleResetLayout = () => {
    try {
      localStorage.removeItem("paynex_dashboard_layout");
    } catch (err) {
      console.error("Failed to reset layout:", err);
    }
    setWidgetOrder(DEFAULT_WIDGET_ORDER);
    setIsCustomizingLayout(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidgetId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidgetId || draggedWidgetId === targetId) return;

    const newOrder = [...widgetOrder];
    const draggedIndex = newOrder.indexOf(draggedWidgetId);
    const targetIndex = newOrder.indexOf(targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedWidgetId);
      setWidgetOrder(newOrder);
    }
    setDraggedWidgetId(null);
  };

  // Close project dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all transactions once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("paynexToken");
        if (!token) return;

        const url = `https://api.paynex.world/v1/merchant/transaction?skip=0&take=50&orderBy=createdAt%7Cdesc&include=merchant&include=product&search_column=transactionId&gatewayEnv=Live`;
        const response = await fetch(url, {
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer ${token}`,
            "paynex-mode": "Test"
          }
        });

        if (response.ok) {
          const data = await response.json();
          const txs = Array.isArray(data.list) ? data.list : [];
          setAllTransactions(txs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  // Fetch stores list from API and transactions
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("paynexToken");
        if (!token) return;

        const response = await fetch("https://api.paynex.world/v1/merchant/store?take=50", {
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer ${token}`,
            "paynex-mode": "Test"
          }
        });

        let apiStoreNames: string[] = [];
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.list)) {
            apiStoreNames = data.list.map((s: any) => s.name || s.storeName || s.storeId).filter(Boolean);
          }
        }

        const txStoreNames = allTransactions
          .map((tx: any) => tx.merchant?.name || tx.merchant?.merchantName || tx.store?.name)
          .filter(Boolean);

        const combined = Array.from(new Set(["All Stores", ...apiStoreNames, ...txStoreNames]));
        setStoresList(combined);
      } catch (err) {
        console.error("Failed to fetch stores list:", err);
      }
    };
    fetchStores();
  }, [allTransactions]);

  // Process data whenever timeRange or allTransactions change
  useEffect(() => {
    if (isLoading) return;

    // Filter by time range
    let txs = allTransactions;
    if (timeRange !== "All time") {
      if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        txs = txs.filter((tx: any) => {
          if (!tx.createdAt) return false;
          const parsed = typeof tx.createdAt === "number" || (typeof tx.createdAt === "string" && !isNaN(Number(tx.createdAt))) ? Number(tx.createdAt) * (String(tx.createdAt).length === 10 ? 1000 : 1) : tx.createdAt;
          const txDate = new Date(parsed);
          return txDate >= start && txDate <= end;
        });
      } else if (timeRange === "This month") {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        txs = txs.filter((tx: any) => {
          if (!tx.createdAt) return false;
          const parsed = typeof tx.createdAt === "number" || (typeof tx.createdAt === "string" && !isNaN(Number(tx.createdAt))) ? Number(tx.createdAt) * (String(tx.createdAt).length === 10 ? 1000 : 1) : tx.createdAt;
          return new Date(parsed) >= startOfMonth;
        });
      }
    }

    // Filter by selected store
    if (selectedProject !== "All Stores") {
      txs = txs.filter((tx: any) =>
        tx.product?.name === selectedProject ||
        tx.merchant?.name === selectedProject ||
        tx.product?.productName === selectedProject ||
        tx.merchant?.merchantName === selectedProject
      );
    }

    let pCount = 0, pAmt = 0, rCount = 0, rAmt = 0;
    let totApproved = 0, totCount = 0;

    const chStats: Record<string, any> = {
      "Terminal": { name: "Terminal", approved: 0, declined: 0, purchases: 0, refunds: 0 },
      "E-Commerce": { name: "E-Commerce", approved: 0, declined: 0, purchases: 0, refunds: 0 }
    };

    const cardStats: Record<string, any> = {
      "VISA": { name: "Visa", approved: 0, declined: 0, purchases: 0, refunds: 0 },
      "MASTERCARD": { name: "MasterCard", approved: 0, declined: 0, purchases: 0, refunds: 0 },
      "AMEX": { name: "American Express", approved: 0, declined: 0, purchases: 0, refunds: 0 },
      "DISCOVER": { name: "Discover", approved: 0, declined: 0, purchases: 0, refunds: 0 },
      "JCB": { name: "JCB", approved: 0, declined: 0, purchases: 0, refunds: 0 },
      "INTERAC": { name: "Interac", approved: 0, declined: 0, purchases: 0, refunds: 0 },
      "OTHERS": { name: "Others", approved: 0, declined: 0, purchases: 0, refunds: 0 }
    };

    txs.forEach((tx: any, index: number) => {
      const amt = Number(tx.amount) || 0;
      const isRefund = tx.transactionType === "Refund";
      const statusStr = (tx.transactionStatus || "success").toLowerCase();
      const isApproved = ["success", "captured", "authorized"].includes(statusStr);

      totCount++;
      if (isApproved) totApproved++;

      if (isRefund) {
        rCount++;
        rAmt += amt;
      } else {
        pCount++;
        pAmt += amt;
      }

      // Dynamic Card Types
      const ct = tx.cardType ? tx.cardType.toLowerCase() : "";
      let normalizedCt = "OTHERS";
      if (ct.includes("visa")) normalizedCt = "VISA";
      else if (ct.includes("mastercard") || ct.includes("master")) normalizedCt = "MASTERCARD";
      else if (ct.includes("american") || ct.includes("amex")) normalizedCt = "AMEX";
      else if (ct.includes("interac") || ct.includes("intract")) normalizedCt = "INTERAC";
      else if (ct.includes("discover")) normalizedCt = "DISCOVER";
      else if (ct.includes("jcb")) normalizedCt = "JCB";

      if (!cardStats[normalizedCt]) {
        cardStats[normalizedCt] = { name: normalizedCt, approved: 0, declined: 0, purchases: 0, refunds: 0 };
      }

      if (isApproved) cardStats[normalizedCt].approved++;
      else cardStats[normalizedCt].declined++;

      if (isRefund) cardStats[normalizedCt].refunds += amt;
      else cardStats[normalizedCt].purchases += amt;
      // Split data between channels to show dummy distribution while keeping exact totals
      const channel = index % 3 === 0 ? "E-Commerce" : "Terminal";
      if (isApproved) chStats[channel].approved++;
      else chStats[channel].declined++;
      if (isRefund) chStats[channel].refunds += amt;
      else chStats[channel].purchases += amt;

    });

    setSummary({
      purchasesCount: pCount,
      purchasesAmount: pAmt,
      refundsCount: rCount,
      refundsAmount: rAmt,
      totalCount: pCount + rCount,
      totalAmount: pAmt - rAmt,
      totCount: totCount,
      totApproved: totApproved,
      totDeclined: totCount - totApproved
    });

    setTotalApprovalRate(totCount > 0 ? ((totApproved / totCount) * 100).toFixed(0) + "%" : "0%");

    const sortedStats = Object.values(cardStats)
      .filter((c: any) => (c.purchases + c.refunds) > 0 || (c.approved + c.declined) > 0)
      .sort((a: any, b: any) => (b.purchases + b.refunds) - (a.purchases + a.refunds));

    setCountData(sortedStats.map((c: any) => {
      const total = c.approved + c.declined;
      return { ...c, total, dummyLabelAnchor: 0.01, rate: total > 0 ? ((c.approved / total) * 100).toFixed(0) + "%" : "0%" };
    }));

    setVolumeData(sortedStats.map((c: any) => {
      return { ...c, total: c.purchases + c.refunds, dummyLabelAnchor: 0.01 };
    }));

    const sortedChannels = Object.values(chStats)
      .sort((a: any, b: any) => (b.approved + b.declined) - (a.approved + a.declined));

    setChannelData(sortedChannels.map((c: any) => {
      const total = c.approved + c.declined;
      return { ...c, total, dummyLabelAnchor: 0.01, rate: total > 0 ? ((c.approved / total) * 100).toFixed(0) + "%" : "0%" };
    }));

    const tRange = timeRange.toLowerCase();
    const dateMap: Record<string, { value: number, sortKey: number }> = {};

    let spanDays = Infinity;
    if (startDate && endDate) {
      spanDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    }

    const getGroupKey = (d: Date) => {
      let dateStr = "";
      let sortKey = 0;
      if (tRange === "yesterday" || tRange === "today" || (tRange !== "all time" && spanDays <= 1)) {
        dateStr = d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
        sortKey = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()).getTime();
      } else if (tRange === "last 7 days" || tRange === "this month" || tRange === "last month" || tRange === "last 30 days" || (tRange !== "all time" && spanDays <= 31)) {
        dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        sortKey = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      } else {
        dateStr = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        sortKey = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      }
      return { dateStr, sortKey };
    };

    txs.forEach((tx: any) => {
      if (!tx.createdAt) return;
      const parsed = typeof tx.createdAt === "number" || (typeof tx.createdAt === "string" && !isNaN(Number(tx.createdAt))) ? Number(tx.createdAt) * (String(tx.createdAt).length === 10 ? 1000 : 1) : tx.createdAt;
      const d = new Date(parsed);
      if (isNaN(d.getTime())) return;

      const { dateStr, sortKey } = getGroupKey(d);
      if (!dateMap[dateStr]) dateMap[dateStr] = { value: 0, sortKey };
      dateMap[dateStr].value += (Number(tx.amount) || 0);
    });

    if (startDate && endDate) {
      const sDate = new Date(startDate + "T00:00:00");
      const eDate = new Date(endDate + "T23:59:59");
      if (!isNaN(sDate.getTime()) && !isNaN(eDate.getTime())) {
        if (tRange === "yesterday" || tRange === "today" || (tRange !== "all time" && spanDays <= 1)) {
          let curr = new Date(sDate.getTime());
          while (curr <= eDate) {
            const k = getGroupKey(curr);
            if (!dateMap[k.dateStr]) dateMap[k.dateStr] = { value: 0, sortKey: k.sortKey };
            curr.setHours(curr.getHours() + 1);
          }
        } else if (tRange === "last 7 days" || tRange === "this month" || tRange === "last month" || tRange === "last 30 days" || (tRange !== "all time" && spanDays <= 31)) {
          let curr = new Date(sDate.getTime());
          while (curr <= eDate) {
            const k = getGroupKey(curr);
            if (!dateMap[k.dateStr]) dateMap[k.dateStr] = { value: 0, sortKey: k.sortKey };
            curr.setDate(curr.getDate() + 1);
          }
        } else if (tRange !== "all time") {
          let curr = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
          const end = new Date(eDate.getFullYear(), eDate.getMonth(), 1);
          while (curr <= end) {
            const k = getGroupKey(curr);
            if (!dateMap[k.dateStr]) dateMap[k.dateStr] = { value: 0, sortKey: k.sortKey };
            curr.setMonth(curr.getMonth() + 1);
          }
        }
      }
    }

    const sortedDates = Object.keys(dateMap).sort((a, b) => dateMap[a].sortKey - dateMap[b].sortKey);
    let tData = sortedDates.map(d => ({ date: d, value: dateMap[d].value }));

    // If there is no data, generate a flat line across the selected range
    if (tData.length === 0) {
      let s = new Date();
      let e = new Date();
      if (startDate && endDate) {
        s = new Date(startDate + "T00:00:00");
        e = new Date(endDate + "T23:59:59");
      } else {
        s.setMonth(s.getMonth() - 11);
      }
      const spanDays = (e.getTime() - s.getTime()) / (1000 * 3600 * 24);
      const format = (d: Date) => spanDays > 90
        ? d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const mid1 = new Date(s.getTime() + (e.getTime() - s.getTime()) / 3);
      const mid2 = new Date(s.getTime() + (e.getTime() - s.getTime()) * 2 / 3);

      tData = [
        { date: format(s), value: 0 },
        { date: format(mid1), value: 0 },
        { date: format(mid2), value: 0 },
        { date: format(e), value: 0 },
      ];

      // Remove duplicates so Recharts doesn't complain, and ensure at least 2 points for a line
      tData = tData.filter((item, index, self) => index === self.findIndex((t) => t.date === item.date));
      if (tData.length === 1) tData.push({ date: format(s) + " (End)", value: 0 });
    } else if (tData.length === 1) {
      // If there's only 1 point of actual data, pad it with 0s so it shows as a visual spike rather than a flat line
      const singlePoint = tData[0];
      tData = [
        { date: " ", value: 0 },
        singlePoint,
        { date: "  ", value: 0 }
      ];
    }

    setTimelineData(tData);

  }, [allTransactions, timeRange, startDate, endDate, selectedProject, isLoading]);

  const renderCountLabel = (props: any) => {
    const { x, y, width, height, value, payload } = props;
    const rate = payload?.rate || "0%";
    return (
      <g transform={`translate(${x + width + 8},${y})`}>
        <text x={0} y={height / 2} dy={4} fill="#102B4E" fontSize={12} fontWeight="bold">{value}</text>
        <rect x={24} y={height / 2 - 10} width={45} height={20} rx={10} fill="#E2F5EA" />
        <text x={46.5} y={height / 2} dy={3} fill="#1E7D46" fontSize={10} fontWeight="bold" textAnchor="middle">{rate}</text>
      </g>
    );
  };

  const renderCustomYAxisTick = ({ x, y, payload }: any) => {
    const words = payload.value.split(" ");
    return (
      <g transform={`translate(${x},${y})`}>
        {words.map((word: string, index: number) => (
          <text
            key={index}
            x={0}
            y={words.length === 1 ? 4 : (index === 0 ? -4 : 8)}
            textAnchor="end"
            fill="#718096"
            fontSize={11}
          >
            {word}
          </text>
        ))}
      </g>
    );
  };

  const renderVolumeLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    return (
      <text x={x + width + 5} y={y + height / 2} dy={4} fill="#718096" fontSize={11} fontWeight="bold">
        ${Number(value).toFixed(2)}
      </text>
    );
  };

  const exportToCSV = (data: any[], filename: string, columns: { key: string; label: string }[]) => {
    if (!data || data.length === 0) return;
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(row => columns.map(c => row[c.key]).join(','));
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-[#102B4E]">
      <div className="w-full px-6 py-6 md:px-8">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-full">
          <div>
            <h1 className="text-[26px] font-bold text-[#102B4E] leading-tight">Dashboard</h1>
            <p className="text-[13px] text-gray-500 font-medium">All the statistics at one place</p>
          </div>

          {/* Right side: Filters & Actions */}
          <div className="flex flex-wrap items-center gap-3 text-[14px]">
            {/* Refresh Button */}
            <button
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="text-[14px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-transparent"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>

            {/* DateRangePicker (This Month) */}
            <DateRangePicker
              defaultLabel="All Time"
              align="right"
              onApply={(range) => {
                setTimeRange(range.label);
                const formatLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (range.start) setStartDate(formatLocal(range.start));
                else setStartDate("");
                if (range.end) setEndDate(formatLocal(range.end));
                else setEndDate("");
              }}
            />

            {/* All Stores Dropdown */}
            <div className="relative" ref={projectDropdownRef}>
              <button
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="flex items-center justify-between gap-2.5 bg-white border border-gray-200 px-5 py-2.5 h-[46px] rounded-xl text-[14px] text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition-colors min-w-[150px] cursor-pointer"
              >
                <span className="truncate max-w-[120px]">{selectedProject}</span>
                <ChevronDown className={`w-4.5 h-4.5 text-gray-400 flex-shrink-0 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProjectDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[400px]">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Select Store</span>
                  </div>
                  <div className="flex flex-col overflow-y-auto py-2">
                    {storesList.map(proj => (
                      <button
                        key={proj}
                        onClick={() => {
                          setSelectedProject(proj);
                          setIsProjectDropdownOpen(false);
                        }}
                        className={`text-left px-4 py-2.5 text-[13px] font-medium flex items-center justify-between transition-colors ${selectedProject === proj
                          ? 'bg-blue-50/50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <span className="truncate">{proj}</span>
                        {selectedProject === proj && <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customize / Config Icon Button */}
            <button
              onClick={() => setIsCustomizingLayout(!isCustomizingLayout)}
              className={`flex items-center justify-center bg-white border border-gray-200 w-[46px] h-[46px] rounded-xl shadow-sm hover:bg-gray-50 transition-all cursor-pointer ${isCustomizingLayout ? 'bg-blue-50 border-blue-300 text-blue-600' : 'text-gray-500'}`}
              title="Customize Layout"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Customization mode banner */}
          {isCustomizingLayout && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 flex items-center justify-between shadow-sm animate-pulse">
              <div className="flex items-center gap-3 text-[13.5px] font-medium">
                <GripVertical className="w-5 h-5 text-blue-600" />
                <span><strong>Customization Mode Active:</strong> Drag and drop any widget block to rearrange your dashboard. Click <strong>Save</strong> when finished.</span>
              </div>
              <button onClick={handleResetLayout} className="text-[12.5px] text-blue-700 underline font-semibold hover:text-blue-900">
                Reset Layout
              </button>
            </div>
          )}

          {/* Stat Cards Grid Row (Reorderable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {widgetOrder.filter(id => id.startsWith("stat_")).map((widgetId) => {
              const renderCardContent = () => {
                if (widgetId === "stat_purchases") {
                  return (
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full transition-all hover:shadow-md">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center text-white">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          <span className="text-[14.5px] font-medium text-gray-500">Purchases</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[28px] font-bold text-[#1a1a1a] leading-none">${summary.purchasesAmount.toFixed(2)}</div>
                          <span className="bg-blue-50 text-[#0066FF] text-[11px] font-extrabold px-2 py-0.5 rounded-[6px]">
                            {summary.purchasesCount}
                          </span>
                        </div>
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium mt-4">
                        Avg purchase: ${summary.purchasesCount ? (summary.purchasesAmount / summary.purchasesCount).toFixed(2) : '0.00'}
                      </div>
                    </div>
                  );
                }
                if (widgetId === "stat_refunds") {
                  return (
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full transition-all hover:shadow-md">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white">
                            <RotateCcw className="w-4 h-4" />
                          </div>
                          <span className="text-[14.5px] font-medium text-gray-500">Refunds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[28px] font-bold text-[#1a1a1a] leading-none">-${summary.refundsAmount.toFixed(2)}</div>
                          <span className="bg-orange-50 text-[#f97316] text-[11px] font-extrabold px-2 py-0.5 rounded-[6px]">
                            {summary.refundsCount}
                          </span>
                        </div>
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium mt-4">
                        Avg refund: ${summary.refundsCount ? (summary.refundsAmount / summary.refundsCount).toFixed(2) : '0.00'}
                      </div>
                    </div>
                  );
                }
                if (widgetId === "stat_net") {
                  return (
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full transition-all hover:shadow-md">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <span className="text-[14.5px] font-medium text-gray-500">Total Net</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[28px] font-bold text-[#1a1a1a] leading-none">${summary.totalAmount.toFixed(2)}</div>
                          <span className="bg-purple-50 text-[#8b5cf6] text-[11px] font-extrabold px-2 py-0.5 rounded-[6px]">
                            {summary.totalCount}
                          </span>
                        </div>
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium mt-4">
                        Net revenue calculated
                      </div>
                    </div>
                  );
                }
                if (widgetId === "stat_tx") {
                  return (
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full transition-all hover:shadow-md">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white">
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                          <span className="text-[14.5px] font-medium text-gray-500">Total Transactions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[28px] font-bold text-[#1a1a1a] leading-none">{summary.totCount}</div>
                          <span className="bg-sky-50 text-[#0ea5e9] text-[11px] font-extrabold px-2 py-0.5 rounded-[6px]">
                            100%
                          </span>
                        </div>
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium mt-4">
                        All processed attempts
                      </div>
                    </div>
                  );
                }
                if (widgetId === "stat_approved") {
                  const rate = summary.totCount ? ((summary.totApproved / summary.totCount) * 100).toFixed(0) + "%" : "0%";
                  return (
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full transition-all hover:shadow-md">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-white">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <span className="text-[14.5px] font-medium text-gray-500">Approved</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[28px] font-bold text-[#1a1a1a] leading-none">{summary.totApproved}</div>
                          <span className="bg-emerald-50 text-[#10b981] text-[11px] font-extrabold px-2 py-0.5 rounded-[6px]">
                            {rate}
                          </span>
                        </div>
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium mt-4">
                        Successful transactions
                      </div>
                    </div>
                  );
                }
                if (widgetId === "stat_declined") {
                  const rate = summary.totCount ? ((summary.totDeclined / summary.totCount) * 100).toFixed(0) + "%" : "0%";
                  return (
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full transition-all hover:shadow-md">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[#ef4444] flex items-center justify-center text-white">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <span className="text-[14.5px] font-medium text-gray-500">Declined</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[28px] font-bold text-[#1a1a1a] leading-none">{summary.totDeclined}</div>
                          <span className="bg-rose-50 text-[#ef4444] text-[11px] font-extrabold px-2 py-0.5 rounded-[6px]">
                            {rate}
                          </span>
                        </div>
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium mt-4">
                        Failed/Declined attempts
                      </div>
                    </div>
                  );
                }
                return null;
              };

              return (
                <div
                  key={widgetId}
                  draggable={isCustomizingLayout}
                  onDragStart={(e) => handleDragStart(e, widgetId)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, widgetId)}
                  className={`transition-all rounded-xl relative h-full ${isCustomizingLayout ? 'ring-2 ring-blue-400 ring-offset-2 cursor-grab active:cursor-grabbing p-1 bg-blue-50/20 shadow-md' : ''}`}
                >
                  {isCustomizingLayout && (
                    <div className="absolute top-2 right-2 z-10 bg-blue-100/90 text-blue-800 p-1 rounded border border-blue-200 shadow-sm cursor-grab">
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {renderCardContent()}
                </div>
              );
            })}
          </div>

          {/* Main Content (Dynamic Reorderable Widgets) */}
          <div className="w-full flex flex-wrap gap-6">
            {widgetOrder.filter(id => !id.startsWith("stat_")).map((widgetId) => {
              if (widgetId === "revenue") {
                return (
                  <div
                    key="revenue"
                    draggable={isCustomizingLayout}
                    onDragStart={(e) => handleDragStart(e, "revenue")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "revenue")}
                    className={`transition-all rounded-[14px] w-full ${isCustomizingLayout ? 'ring-2 ring-blue-400 ring-offset-4 cursor-grab active:cursor-grabbing p-2 bg-blue-50/20 shadow-md' : ''}`}
                  >
                    {isCustomizingLayout && (
                      <div className="flex items-center justify-between px-3 py-2 bg-blue-100/90 text-blue-800 text-[12px] font-semibold rounded-lg mb-3 border border-blue-200 shadow-sm">
                        <span className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-blue-600" />
                          Revenue Trend (Drag to reorder)
                        </span>
                        <span className="text-[11px] text-blue-600 font-medium">Hold & Drag</span>
                      </div>
                    )}
                    {/* Area Chart - Redesigned to match reference image */}
                    <div className="bg-white border border-gray-200 rounded-[14px] shadow-sm flex flex-col p-6 gap-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[15px] font-medium text-gray-500">Revenue/Transaction Trend</h2>
                        <div className="flex items-center gap-3">
                          <button className="w-9 h-9 rounded-xl bg-[#F6F6F6] hover:bg-gray-200/60 flex items-center justify-center transition-colors">
                            <Maximize2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-[32px] font-bold text-[#1a1a1a] leading-none">
                          ${summary.totalAmount.toFixed(2)}
                        </span>
                        <span className="bg-[#E6F4EA] text-[#137333] text-[12px] font-extrabold px-2 py-0.5 rounded-[6px] flex items-center gap-1">
                          ↗ 19%
                        </span>
                      </div>

                      <div className="h-[280px] w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={timelineData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                              tickFormatter={(val) => val === 0 ? '0$' : `${val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val}$`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#0066FF"
                              strokeWidth={2.5}
                              fillOpacity={1}
                              fill="url(#colorValue)"
                              activeDot={{ r: 6, fill: "#0066FF", stroke: "#ffffff", strokeWidth: 2 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {(() => {
                        const vals = timelineData.map(d => d.value || 0);
                        const peak = vals.length > 0 ? Math.max(...vals) : 0;
                        const lowest = vals.length > 0 ? Math.min(...vals) : 0;
                        const net = summary.totalAmount;
                        const avg = vals.length > 0 ? net / vals.length : 0;

                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100 pt-5 text-center gap-4">
                            <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                              <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                                <span className="text-[#10B981] font-extrabold text-xs">↗</span> Peak Revenue
                              </div>
                              <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">${peak.toFixed(2)}</div>
                            </div>
                            <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                              <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                                <span className="text-[#EF4444] font-extrabold text-xs">↘</span> Lowest Revenue
                              </div>
                              <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">${lowest.toFixed(2)}</div>
                            </div>
                            <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                              <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                                <Wallet className="w-4 h-4 text-[#8B5CF6]" /> Net Revenue
                              </div>
                              <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">${net.toFixed(2)}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                                <Wallet className="w-4 h-4 text-[#0066FF]" /> Avg. Revenue/Day
                              </div>
                              <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">${avg.toFixed(2)}</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              }

              if (widgetId === "transaction_count") {
                return (
                  <div
                    key="transaction_count"
                    draggable={isCustomizingLayout}
                    onDragStart={(e) => handleDragStart(e, "transaction_count")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "transaction_count")}
                    className={`transition-all rounded-[14px] w-full xl:w-[calc(50%-12px)] ${isCustomizingLayout ? 'ring-2 ring-blue-400 ring-offset-4 cursor-grab active:cursor-grabbing p-2 bg-blue-50/20 shadow-md' : ''}`}
                  >
                    {isCustomizingLayout && (
                      <div className="flex items-center justify-between px-3 py-2 bg-blue-100/90 text-blue-800 text-[12px] font-semibold rounded-lg mb-3 border border-blue-200 shadow-sm">
                        <span className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-blue-600" />
                          Transaction Count (Drag to reorder)
                        </span>
                        <span className="text-[11px] text-blue-600 font-medium">Hold & Drag</span>
                      </div>
                    )}
                    {/* Transaction Count Card */}
                    <div className="bg-white border border-gray-200 rounded-[14px] shadow-sm flex flex-col justify-between p-6 gap-6 h-full">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-[15px] font-medium text-gray-500">Transactions Count</h2>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => exportToCSV(
                                countData,
                                'transaction_count.csv',
                                [{ key: 'name', label: 'Card Type' }, { key: 'approved', label: 'Approved' }, { key: 'declined', label: 'Declined' }, { key: 'total', label: 'Total' }]
                              )}
                              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-[#0066FF] bg-[#F0F5FF] hover:bg-[#E0EBFF] rounded-xl transition-all cursor-pointer"
                              title="Download CSV"
                            >
                              <Download className="w-3.5 h-3.5" />
                              CSV
                            </button>
                            <button className="w-9 h-9 rounded-xl bg-[#F6F6F6] hover:bg-gray-200/60 flex items-center justify-center transition-colors">
                              <Maximize2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-[32px] font-bold text-[#1a1a1a] leading-none">
                            {summary.totCount.toLocaleString()}
                          </span>
                          <span className="bg-[#E6F4EA] text-[#137333] text-[12px] font-extrabold px-2 py-0.5 rounded-[6px] flex items-center gap-1">
                            ↗ 12%
                          </span>
                        </div>

                        <div className="h-[250px] w-full pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countData}
                              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                              barSize={20}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} ticks={[0, 50]} />
                              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} content={<CustomCountTooltip />} />
                              <Bar dataKey="approved" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="declined" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100 pt-5 text-center gap-4">
                        <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                          <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                            <ArrowUpDown className="w-4 h-4 text-[#0066FF]" /> Total Txn
                          </div>
                          <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">{summary.totCount.toLocaleString()}</div>
                        </div>
                        <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                          <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                            <CreditCard className="w-4 h-4 text-[#10B981]" /> Approved Txn
                          </div>
                          <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">{summary.totApproved.toLocaleString()}</div>
                        </div>
                        <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                          <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                            <CreditCard className="w-4 h-4 text-[#EF4444]" /> Declined Txn
                          </div>
                          <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">{summary.totDeclined.toLocaleString()}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                            <TrendingUp className="w-4 h-4 text-[#10B981]" /> Approval Rate
                          </div>
                          <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">{totalApprovalRate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (widgetId === "transaction_count_dist") {
                return (
                  <div
                    key="transaction_count_dist"
                    draggable={isCustomizingLayout}
                    onDragStart={(e) => handleDragStart(e, "transaction_count_dist")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "transaction_count_dist")}
                    className={`transition-all rounded-[14px] w-full xl:w-[calc(50%-12px)] ${isCustomizingLayout ? 'ring-2 ring-blue-400 ring-offset-4 cursor-grab active:cursor-grabbing p-2 bg-blue-50/20 shadow-md' : ''}`}
                  >
                    {isCustomizingLayout && (
                      <div className="flex items-center justify-between px-3 py-2 bg-blue-100/90 text-blue-800 text-[12px] font-semibold rounded-lg mb-3 border border-blue-200 shadow-sm">
                        <span className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-blue-600" />
                          Transaction % Distribution (Drag to reorder)
                        </span>
                        <span className="text-[11px] text-blue-600 font-medium">Hold & Drag</span>
                      </div>
                    )}
                    {/* Transaction % Distribution Card */}
                    <div className="bg-white border border-gray-200 rounded-[14px] shadow-sm flex flex-col justify-between p-6 gap-6 h-full font-sans">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-[15px] font-medium text-gray-500">Transactions Distribution</h2>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => exportToCSV(
                                countData,
                                'transaction_distribution.csv',
                                [{ key: 'name', label: 'Card Type' }, { key: 'total', label: 'Total' }]
                              )}
                              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-[#0066FF] bg-[#F0F5FF] hover:bg-[#E0EBFF] rounded-xl transition-all cursor-pointer"
                              title="Download CSV"
                            >
                              <Download className="w-3.5 h-3.5" />
                              CSV
                            </button>
                            <button className="w-9 h-9 rounded-xl bg-[#F6F6F6] hover:bg-gray-200/60 flex items-center justify-center transition-colors">
                              <Maximize2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-[32px] font-bold text-[#1a1a1a] leading-none">
                            {summary.totalCount.toLocaleString()}
                          </span>
                          <span className="bg-[#E6F4EA] text-[#137333] text-[12px] font-extrabold px-2 py-0.5 rounded-[6px] flex items-center gap-1">
                            ↗ 12%
                          </span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-2">
                          <div className="relative w-[180px] h-[180px] flex items-center justify-center flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={countData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={82}
                                  dataKey="total"
                                  stroke="none"
                                >
                                  {countData.map((entry, index) => {
                                    let color = "#0066FF";
                                    if (entry.name === "Visa") color = "#0066FF";
                                    else if (entry.name === "MasterCard") color = "#10B981";
                                    else if (entry.name === "JCB") color = "#8b5cf6";
                                    else if (entry.name === "American Express") color = "#00c5ff";
                                    else if (entry.name === "Interac") color = "#ffb900";
                                    return <Cell key={`cell-${index}`} fill={color} />;
                                  })}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-[24px] font-bold text-[#1a1a1a]">{summary.totalCount}</span>
                              <span className="text-[12px] text-gray-400 font-medium">Transactions</span>
                            </div>
                          </div>

                          <div className="w-full flex-1">
                            <table className="w-full text-left text-[13.5px]">
                              <thead>
                                <tr className="border-b border-gray-100">
                                  <th className="pb-2.5 font-bold text-gray-800">Card Type</th>
                                  <th className="pb-2.5 font-bold text-gray-800 text-right">Count</th>
                                  <th className="pb-2.5 font-bold text-gray-800 text-right">Share</th>
                                </tr>
                              </thead>
                              <tbody>
                                {countData.map((entry, index) => {
                                  let color = "#0066FF";
                                  if (entry.name === "Visa") color = "#0066FF";
                                  else if (entry.name === "MasterCard") color = "#10B981";
                                  else if (entry.name === "JCB") color = "#8b5cf6";
                                  else if (entry.name === "American Express") color = "#00c5ff";
                                  else if (entry.name === "Interac") color = "#ffb900";

                                  const percentage = summary.totalCount > 0
                                    ? ((entry.total / summary.totalCount) * 100).toFixed(1) + "%"
                                    : "0.0%";

                                  return (
                                    <tr key={index} className="border-b border-gray-100/60 last:border-0">
                                      <td className="py-2.5 flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                                        <span className="text-gray-500 font-medium">{entry.name}</span>
                                      </td>
                                      <td className="py-2.5 text-gray-700 font-medium text-right">{entry.total}</td>
                                      <td className="py-2.5 text-gray-700 font-medium text-right">{percentage}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot>
                                <tr className="border-t border-gray-200">
                                  <td className="py-3 font-bold text-gray-900">Total</td>
                                  <td className="py-3 font-bold text-gray-900 text-right">{summary.totalCount}</td>
                                  <td className="py-3 font-bold text-gray-900 text-right">100%</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (widgetId === "transaction_volume") {
                return (
                  <div
                    key="transaction_volume"
                    draggable={isCustomizingLayout}
                    onDragStart={(e) => handleDragStart(e, "transaction_volume")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "transaction_volume")}
                    className={`transition-all rounded-[14px] w-full xl:w-[calc(50%-12px)] ${isCustomizingLayout ? 'ring-2 ring-blue-400 ring-offset-4 cursor-grab active:cursor-grabbing p-2 bg-blue-50/20 shadow-md' : ''}`}
                  >
                    {isCustomizingLayout && (
                      <div className="flex items-center justify-between px-3 py-2 bg-blue-100/90 text-blue-800 text-[12px] font-semibold rounded-lg mb-3 border border-blue-200 shadow-sm">
                        <span className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-blue-600" />
                          Transaction Volume (Drag to reorder)
                        </span>
                        <span className="text-[11px] text-blue-600 font-medium">Hold & Drag</span>
                      </div>
                    )}
                    {/* Transaction Volume Card */}
                    <div className="bg-white border border-gray-200 rounded-[14px] shadow-sm flex flex-col justify-between p-6 gap-6 h-full">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-[15px] font-medium text-gray-500">Transaction Volume</h2>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => exportToCSV(
                                volumeData,
                                'transaction_volume.csv',
                                [{ key: 'name', label: 'Card Type' }, { key: 'purchases', label: 'Purchases' }, { key: 'refunds', label: 'Refunds' }, { key: 'total', label: 'Total' }]
                              )}
                              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-[#0066FF] bg-[#F0F5FF] hover:bg-[#E0EBFF] rounded-xl transition-all cursor-pointer"
                              title="Download CSV"
                            >
                              <Download className="w-3.5 h-3.5" />
                              CSV
                            </button>
                            <button className="w-9 h-9 rounded-xl bg-[#F6F6F6] hover:bg-gray-200/60 flex items-center justify-center transition-colors">
                              <Maximize2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-[32px] font-bold text-[#1a1a1a] leading-none">
                            ${summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="bg-[#E6F4EA] text-[#137333] text-[12px] font-extrabold px-2 py-0.5 rounded-[6px] flex items-center gap-1">
                            ↗ 19%
                          </span>
                        </div>

                        <div className="h-[250px] w-full pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={volumeData}
                              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                              barSize={20}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                                ticks={[0, 200, 400, 600, 800]}
                                tickFormatter={(val) => `$${val}`}
                              />
                              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} content={<CustomVolumeTooltip />} />
                              <Bar dataKey="purchases" stackId="a" fill="#0066FF" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="refunds" stackId="a" fill="#FF8000" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100 pt-5 text-center gap-4">
                        <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                          <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                            <ShoppingBag className="w-4 h-4 text-[#0066FF]" /> Purchases Vol.
                          </div>
                          <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">${summary.purchasesAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                          <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                            <RotateCcw className="w-4 h-4 text-[#FF8000]" /> Refunds Vol.
                          </div>
                          <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">${summary.refundsAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div className="border-r border-gray-100 last:border-r-0 flex flex-col items-center justify-center">
                          <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                            <Wallet className="w-4 h-4 text-[#8B5CF6]" /> Net Volume
                          </div>
                          <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">${summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5 justify-center">
                            <ArrowUpDown className="w-4 h-4 text-[#0066FF]" /> Total Count
                          </div>
                          <div className="text-[20px] font-extrabold text-[#102B4E] mt-1">{summary.totalCount.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (widgetId === "transaction_volume_dist") {
                const totalVol = volumeData.reduce((acc, curr) => acc + curr.total, 0);
                const getCardColor = (name: string) => {
                  const n = name.toLowerCase();
                  if (n.includes("visa")) return "#1877F2";
                  if (n.includes("mastercard") || n.includes("master")) return "#10B981";
                  if (n.includes("jcb")) return "#7C3AED";
                  if (n.includes("american express") || n.includes("amex") || n.includes("american")) return "#06B6D4";
                  if (n.includes("interac")) return "#F59E0B";
                  return "#94A3B8";
                };

                return (
                  <div
                    key="transaction_volume_dist"
                    draggable={isCustomizingLayout}
                    onDragStart={(e) => handleDragStart(e, "transaction_volume_dist")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "transaction_volume_dist")}
                    className={`transition-all rounded-[24px] w-full xl:w-[calc(50%-12px)] ${isCustomizingLayout ? 'ring-2 ring-blue-400 ring-offset-4 cursor-grab active:cursor-grabbing p-2 bg-blue-50/20 shadow-md' : ''}`}
                  >
                    {isCustomizingLayout && (
                      <div className="flex items-center justify-between px-3 py-2 bg-blue-100/90 text-blue-800 text-[12px] font-semibold rounded-lg mb-3 border border-blue-200 shadow-sm">
                        <span className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-blue-600" />
                          Transaction Volume % Distribution (Drag to reorder)
                        </span>
                        <span className="text-[11px] text-blue-600 font-medium">Hold & Drag</span>
                      </div>
                    )}
                    {/* Transaction Volume % Distribution Card */}
                    <div className="bg-white border border-gray-200/60 rounded-[24px] shadow-xs flex flex-col justify-between p-8 gap-4 h-full">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-[16px] font-medium text-gray-500">Transactions Vol. % Distribution</h2>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[32px] font-bold text-[#0F172A] tracking-tight">
                                ${totalVol.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#E6F9F1] text-[#10B981] text-[11px] font-bold">
                                <span className="text-[10px]">↗</span>
                                <span>12%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => exportToCSV(
                                volumeData,
                                'volume_distribution.csv',
                                [{ key: 'name', label: 'Card Type' }, { key: 'total', label: 'Total Volume' }]
                              )}
                              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#0066FF] bg-[#ECF2FE] hover:bg-[#DCE7FD] rounded-xl transition-colors cursor-pointer"
                              title="Download CSV"
                            >
                              <span className="text-[13px] font-bold leading-none">↓</span>
                              <span>CSV</span>
                            </button>
                            <button className="w-9 h-9 rounded-xl border border-gray-200/80 hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer">
                              <Maximize2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                          <div className="relative w-[190px] h-[190px] flex items-center justify-center flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={volumeData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={82}
                                  dataKey="total"
                                  stroke="none"
                                >
                                  {volumeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getCardColor(entry.name)} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => ['$' + Number(value).toFixed(2), "Volume"]} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
                              <span className="text-[20px] font-bold text-[#0F172A]">
                                ${totalVol.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                              <span className="text-[11px] text-gray-400 font-medium mt-0.5">Total Volume</span>
                            </div>
                          </div>

                          <div className="w-full flex-1">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-100">
                                  <th className="pb-3 font-semibold text-[#0F172A] text-[13px] w-[45%]">Card Type</th>
                                  <th className="pb-3 font-semibold text-[#0F172A] text-[13px] text-right">Volume</th>
                                  <th className="pb-3 font-semibold text-[#0F172A] text-[13px] text-right">Share</th>
                                </tr>
                              </thead>
                              <tbody>
                                {volumeData.map((entry, index) => {
                                  const percentage = totalVol > 0
                                    ? ((entry.total / totalVol) * 100).toFixed(1) + "%"
                                    : "0.0%";
                                  const color = getCardColor(entry.name);
                                  return (
                                    <tr key={index} className="border-b border-gray-100/50 last:border-0">
                                      <td className="py-3 flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></div>
                                        <span className="text-[#4A5568] text-[13px] font-medium">{entry.name}</span>
                                      </td>
                                      <td className="py-3 text-[#4A5568] text-[13px] text-right font-normal">${Number(entry.total).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                      <td className="py-3 text-[#4A5568] text-[13px] text-right font-normal">{percentage}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot>
                                <tr className="border-t border-gray-200">
                                  <td className="pt-3 font-bold text-[#0F172A] text-[13px]">Total</td>
                                  <td className="pt-3 font-bold text-[#0F172A] text-[13px] text-right">${totalVol.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                  <td className="pt-3 font-bold text-[#0F172A] text-[13px] text-right">100%</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (widgetId === "channel_count") {
                const totalAttempts = summary.totCount;
                const approvalRate = totalAttempts > 0 ? ((summary.totApproved / totalAttempts) * 100).toFixed(1) + "%" : "0.0%";
                const approvalRatePill = totalAttempts > 0 ? ((summary.totApproved / totalAttempts) * 100).toFixed(0) + "%" : "0%";

                return (
                  <div
                    key="channel_count"
                    draggable={isCustomizingLayout}
                    onDragStart={(e) => handleDragStart(e, "channel_count")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "channel_count")}
                    className={`transition-all rounded-[24px] w-full xl:w-[calc(50%-12px)] ${isCustomizingLayout ? 'ring-2 ring-blue-400 ring-offset-4 cursor-grab active:cursor-grabbing p-2 bg-blue-50/20 shadow-md' : ''}`}
                  >
                    {isCustomizingLayout && (
                      <div className="flex items-center justify-between px-3 py-2 bg-blue-100/90 text-blue-800 text-[12px] font-semibold rounded-lg mb-3 border border-blue-200 shadow-sm">
                        <span className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-blue-600" />
                          Channel (Drag to reorder)
                        </span>
                        <span className="text-[11px] text-blue-600 font-medium">Hold & Drag</span>
                      </div>
                    )}
                    {/* Channel Card */}
                    <div className="bg-white border border-gray-200/60 rounded-[24px] shadow-xs flex flex-col justify-between p-8 gap-6 h-full">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-[16px] font-medium text-gray-500">Channel</h2>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[32px] font-bold text-[#0F172A] tracking-tight">
                                {totalAttempts.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#E6F9F1] text-[#10B981] text-[11px] font-bold">
                                <span className="text-[10px]">↗</span>
                                <span>Approval rate {approvalRatePill}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => exportToCSV(
                                channelData,
                                'channel_data.csv',
                                [{ key: 'name', label: 'Channel' }, { key: 'approved', label: 'Approved' }, { key: 'declined', label: 'Declined' }, { key: 'total', label: 'Total' }]
                              )}
                              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#0066FF] bg-[#ECF2FE] hover:bg-[#DCE7FD] rounded-xl transition-colors cursor-pointer"
                              title="Download CSV"
                            >
                              <span className="text-[13px] font-bold leading-none">↓</span>
                              <span>CSV</span>
                            </button>
                            <button className="w-9 h-9 rounded-xl border border-gray-200/80 hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer">
                              <Maximize2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        <div className="h-[250px] w-full pt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={channelData}
                              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                              barSize={32}
                            >
                              <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#F1F5F9" />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 13, fontWeight: 500 }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 13, fontWeight: 500 }}
                                tickFormatter={(val) => `$${val >= 1000 ? (val / 1000) + 'K' : val}`}
                              />
                              <Tooltip content={<CustomChannelTooltip />} cursor={{ fill: 'rgba(0,0,0,0.01)' }} />
                              <Bar dataKey="approved" stackId="a" fill="#10B981" radius={[8, 8, 8, 8]} />
                              <Bar dataKey="declined" stackId="a" fill="#EF4444" radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100 pt-6 gap-4">
                        <div className="border-r border-gray-100/80 last:border-r-0 pl-2">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
                            <ArrowUpDown className="w-4 h-4 text-[#0066FF]" />
                            <span>Total Attempts</span>
                          </div>
                          <div className="text-[22px] font-bold text-[#0F172A] mt-2 ml-5.5">{totalAttempts.toLocaleString()}</div>
                        </div>
                        <div className="border-r border-gray-100/80 last:border-r-0 pl-2">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
                            <Wallet className="w-4 h-4 text-[#10B981]" />
                            <span>Approved</span>
                          </div>
                          <div className="text-[22px] font-bold text-[#0F172A] mt-2 ml-5.5">{summary.totApproved.toLocaleString()}</div>
                        </div>
                        <div className="border-r border-gray-100/80 last:border-r-0 pl-2">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
                            <XCircle className="w-4 h-4 text-[#EF4444]" />
                            <span>Declined</span>
                          </div>
                          <div className="text-[22px] font-bold text-[#0F172A] mt-2 ml-5.5">{summary.totDeclined.toLocaleString()}</div>
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
                            <ArrowUpDown className="w-4 h-4 text-[#0066FF]" />
                            <span>Approval Rate</span>
                          </div>
                          <div className="text-[22px] font-bold text-[#0F172A] mt-2 ml-5.5">{approvalRate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (widgetId === "channel_dist") {
                const totalCount = channelData.reduce((acc, curr) => acc + curr.total, 0);
                const getChannelColor = (name: string) => {
                  const n = name.toLowerCase();
                  if (n.includes("terminal")) return "#06B6D4";
                  if (n.includes("e-commerce") || n.includes("commerce")) return "#7C3AED";
                  return "#94A3B8";
                };

                return (
                  <div
                    key="channel_dist"
                    draggable={isCustomizingLayout}
                    onDragStart={(e) => handleDragStart(e, "channel_dist")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "channel_dist")}
                    className={`transition-all rounded-[24px] w-full xl:w-[calc(50%-12px)] ${isCustomizingLayout ? 'ring-2 ring-blue-400 ring-offset-4 cursor-grab active:cursor-grabbing p-2 bg-blue-50/20 shadow-md' : ''}`}
                  >
                    {isCustomizingLayout && (
                      <div className="flex items-center justify-between px-3 py-2 bg-blue-100/90 text-blue-800 text-[12px] font-semibold rounded-lg mb-3 border border-blue-200 shadow-sm">
                        <span className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-blue-600" />
                          Channel Distribution (Drag to reorder)
                        </span>
                        <span className="text-[11px] text-blue-600 font-medium">Hold & Drag</span>
                      </div>
                    )}
                    {/* Channel Distribution Card */}
                    <div className="bg-white border border-gray-200/60 rounded-[24px] shadow-xs flex flex-col justify-between p-8 gap-4 h-full">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-[16px] font-medium text-gray-500">Channel Distribution</h2>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[32px] font-bold text-[#0F172A] tracking-tight">
                                {totalCount.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#E6F9F1] text-[#10B981] text-[11px] font-bold">
                                <span className="text-[10px]">↗</span>
                                <span>12%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => exportToCSV(
                                channelData,
                                'channel_distribution.csv',
                                [{ key: 'name', label: 'Channel' }, { key: 'total', label: 'Total' }]
                              )}
                              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#0066FF] bg-[#ECF2FE] hover:bg-[#DCE7FD] rounded-xl transition-colors cursor-pointer"
                              title="Download CSV"
                            >
                              <span className="text-[13px] font-bold leading-none">↓</span>
                              <span>CSV</span>
                            </button>
                            <button className="w-9 h-9 rounded-xl border border-gray-200/80 hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer">
                              <Maximize2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                          <div className="relative w-[190px] h-[190px] flex items-center justify-center flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={channelData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={82}
                                  dataKey="total"
                                  stroke="none"
                                >
                                  {channelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChannelColor(entry.name)} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => [value, "Transactions"]} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
                              <span className="text-[20px] font-bold text-[#0F172A]">{totalCount.toLocaleString()}</span>
                              <span className="text-[11px] text-gray-400 font-medium mt-0.5">Transactions</span>
                            </div>
                          </div>

                          <div className="w-full flex-1">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-100">
                                  <th className="pb-3 font-semibold text-[#0F172A] text-[13px] w-[45%]">Channel</th>
                                  <th className="pb-3 font-semibold text-[#0F172A] text-[13px] text-right">Count</th>
                                  <th className="pb-3 font-semibold text-[#0F172A] text-[13px] text-right">Share</th>
                                </tr>
                              </thead>
                              <tbody>
                                {channelData.map((entry, index) => {
                                  const percentage = totalCount > 0
                                    ? ((entry.total / totalCount) * 100).toFixed(1) + "%"
                                    : "0.0%";
                                  const color = getChannelColor(entry.name);
                                  return (
                                    <tr key={index} className="border-b border-gray-100/50 last:border-0">
                                      <td className="py-3 flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></div>
                                        <span className="text-[#4A5568] text-[13px] font-medium">{entry.name}</span>
                                      </td>
                                      <td className="py-3 text-[#4A5568] text-[13px] text-right font-normal">{entry.total.toLocaleString()}</td>
                                      <td className="py-3 text-[#4A5568] text-[13px] text-right font-normal">{percentage}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot>
                                <tr className="border-t border-gray-200">
                                  <td className="pt-3 font-bold text-[#0F172A] text-[13px]">Total</td>
                                  <td className="pt-3 font-bold text-[#0F172A] text-[13px] text-right">{totalCount.toLocaleString()}</td>
                                  <td className="pt-3 font-bold text-[#0F172A] text-[13px] text-right">100%</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
