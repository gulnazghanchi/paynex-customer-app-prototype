"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { Grid, CircleDollarSign, Store, Box, Settings, LogOut, Moon, Sun, ChevronDown, PanelLeft, Bell, FileText, Search, UserCircle2, Home, HelpCircle, LayoutGrid, Receipt, Check } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Administrator");
  const [userEmail, setUserEmail] = useState("admin@chargnex.com");

  useEffect(() => {
    const token = localStorage.getItem("paynexToken");
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const payload = JSON.parse(atob(payloadBase64));
          if (payload.name) setUserName(payload.name);
          else if (payload.firstName) setUserName(`${payload.firstName} ${payload.lastName || ''}`.trim());

          if (payload.email) setUserEmail(payload.email);
        }
      } catch (e) {
        console.error("Failed to parse token", e);
      }
    }
  }, []);

  const getPageName = () => {
    if (pathname === "/dashboard") return "Home";
    if (pathname === "/dashboard/transactions") return "Transactions";
    if (pathname === "/dashboard/stores") return "Stores";
    if (pathname === "/dashboard/products") return "Products";
    if (pathname === "/dashboard/reports") return "Reports";
    if (pathname === "/dashboard/settings") return "Settings";
    return "Home";
  };

  const pageName = getPageName();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-200">

      {/* Sidebar */}
      <aside className="w-[240px] bg-white dark:bg-[#0f172a] border-r border-gray-100 dark:border-gray-800 flex flex-col hidden md:flex sticky top-0 h-screen z-20 transition-colors duration-200">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
          <Image src="/logo-light.svg" alt="PayneX Logo" width={100} height={19} priority className={theme === "dark" ? "brightness-0 invert" : ""} />
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 flex flex-col justify-between overflow-y-auto">

          {/* Top/Middle navigation group */}
          <div className="space-y-1 px-3">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[14.5px] rounded-xl transition-all ${pathname === "/dashboard"
                ? "bg-[#0066FF] text-white dark:bg-[#0066FF] dark:text-white font-semibold shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
            >
              <Home className={`w-5 h-5 ${pathname === "/dashboard" ? "text-white" : "opacity-80"}`} />
              Home
            </Link>

            <Link
              href="/dashboard/transactions"
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[14.5px] rounded-xl transition-all group ${pathname === "/dashboard/transactions"
                ? "bg-[#0066FF] text-white dark:bg-[#0066FF] dark:text-white font-semibold shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
            >
              <Receipt className={`w-5 h-5 ${pathname === "/dashboard/transactions" ? "text-white" : "opacity-80"}`} />
              Transactions
            </Link>

            <Link
              href="/dashboard/stores"
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[14.5px] rounded-xl transition-all group ${pathname === "/dashboard/stores"
                ? "bg-[#0066FF] text-white dark:bg-[#0066FF] dark:text-white font-semibold shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
            >
              <Store className={`w-5 h-5 ${pathname === "/dashboard/stores" ? "text-white" : "opacity-80"}`} />
              Stores
            </Link>

            <Link
              href="/dashboard/products"
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[14.5px] rounded-xl transition-all group ${pathname === "/dashboard/products"
                ? "bg-[#0066FF] text-white dark:bg-[#0066FF] dark:text-white font-semibold shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
            >
              <LayoutGrid className={`w-5 h-5 ${pathname === "/dashboard/products" ? "text-white" : "opacity-80"}`} />
              Products
            </Link>

            <Link
              href="/dashboard/reports"
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[14.5px] rounded-xl transition-all group ${pathname.startsWith("/dashboard/reports")
                ? "bg-[#0066FF] text-white dark:bg-[#0066FF] dark:text-white font-semibold shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
            >
              <FileText className={`w-5 h-5 ${pathname.startsWith("/dashboard/reports") ? "text-white" : "opacity-80"}`} />
              Reports
            </Link>
          </div>

          {/* Bottom navigation group with divider */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 px-3 space-y-1">
            <Link
              href="/dashboard/help"
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[14.5px] rounded-xl transition-all group ${pathname === "/dashboard/help"
                ? "bg-[#0066FF] text-white dark:bg-[#0066FF] dark:text-white font-semibold shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
            >
              <HelpCircle className={`w-5 h-5 ${pathname === "/dashboard/help" ? "text-white" : "opacity-80"}`} />
              Help Center
            </Link>

            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[14.5px] rounded-xl transition-all group ${pathname === "/dashboard/settings"
                ? "bg-[#0066FF] text-white dark:bg-[#0066FF] dark:text-white font-semibold shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100"
                }`}
            >
              <Settings className={`w-5 h-5 ${pathname === "/dashboard/settings" ? "text-white" : "opacity-80"}`} />
              Settings
            </Link>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">

        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 transition-colors duration-200">

          <div className="flex items-center gap-4 flex-1 max-w-[500px]">
            <button className="text-gray-500 hover:text-gray-900 transition-colors md:hidden">
              <PanelLeft className="w-5 h-5" />
            </button>

            <div className="relative flex-1 hidden sm:block">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F6F6F6] border border-transparent focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders, products, or customers..."
                  className="bg-transparent border-none outline-none text-[13.5px] text-gray-800 placeholder-gray-400 w-full font-medium"
                />
                <div className="flex items-center gap-1 flex-shrink-0">
                  <kbd className="inline-flex items-center justify-center h-5 w-5 rounded bg-white border border-gray-200/80 text-[10px] font-semibold text-gray-400 shadow-xs">⌘</kbd>
                  <kbd className="inline-flex items-center justify-center h-5 w-5 rounded bg-white border border-gray-200/80 text-[10px] font-semibold text-gray-400 shadow-xs">K</kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 text-[14px]">
            {/* Service/Company Selector */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-[13px] shadow-sm">
              <UserCircle2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-800">Chargnex</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-[13px] shadow-sm cursor-pointer"
              >
                <span className="text-gray-800">{selectedLang}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isLangMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangMenuOpen && (
                <>
                  {/* Backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangMenuOpen(false)}
                  ></div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] z-50 p-2 flex flex-col gap-0.5">
                    {[
                      { id: "English", label: "English" },
                      { id: "French", label: "French" },
                      { id: "Spanish", label: "Spanish" }
                    ].map((lang) => {
                      const isSelected = selectedLang === lang.id;
                      return (
                        <button
                          key={lang.id}
                          onClick={() => {
                            setSelectedLang(lang.id);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-[14px] rounded-xl transition-all text-left font-medium cursor-pointer ${isSelected
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                            }`}
                        >
                          <Check className={`w-4 h-4 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
                          <span>{lang.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* User Profile Avatar and Dropdown Menu */}
            <div className="relative">
              <button
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {/* User photo matching the image description: smiling man with short beard and hoodie */}
                {/* Fallback to initials / avatar SVG if image fails */}
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                  alt="Jackson Low Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-[15px]">
                  JL
                </div>
              </button>

              {isUserMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  ></div>

                  {/* Dropdown Panel */}
                  <div className="absolute right-0 mt-3 w-[280px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] z-50 overflow-hidden p-5 flex flex-col gap-4 transition-all duration-200">

                    {/* User profile card */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                          alt="Jackson Low Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[15.5px] font-bold text-gray-900 dark:text-white truncate">Jackson Low</span>
                        <span className="text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">hello@jacksonlow.com</span>
                      </div>
                    </div>

                    {/* Dark Mode toggle */}
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <Moon className="w-5 h-5 opacity-75" />
                        <span className="text-[14.5px] font-medium">Dark Mode</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={theme === "dark"}
                          onChange={toggleTheme}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-gray-100 dark:bg-gray-800 -mx-5"></div>

                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        localStorage.removeItem("paynexToken");
                        window.location.href = "/";
                      }}
                      className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors text-left font-semibold py-1.5 focus:outline-none w-full cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-[14.5px]">Logout</span>
                    </button>

                  </div>
                </>
              )}
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-10">
          {children}
        </main>

      </div>
    </div>
  );
}
