"use client";

import { useState, useEffect } from "react";
import { Building2, Folder, Key, Webhook, FileText, Copy, Check, Loader2, RefreshCcw, Plus, Trash2, Edit2, Code, Monitor, Briefcase, Shield } from "lucide-react";
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [apiDocs, setApiDocs] = useState<any>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");

  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(false);

  useEffect(() => {
    if (activeTab === "Webhook") {
      const fetchWebhooks = async () => {
        setIsLoadingWebhooks(true);
        try {
          const token = localStorage.getItem("paynexToken");
          if (!token) return;
          const res = await fetch("https://api.paynex.world/v1/merchant/webhook?take=15&orderBy=createdAt%7Cdesc", {
            headers: {
              "Accept": "application/json, text/plain, */*",
              "Authorization": `Bearer ${token}`,
              "paynex-mode": "Test"
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.list)) {
              setWebhooks(data.list);
            }
          }
        } catch (err) {
          console.error("Failed to fetch webhooks", err);
        } finally {
          setIsLoadingWebhooks(false);
        }
      };
      fetchWebhooks();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "API Docs" && !apiDocs) {
      const fetchDocs = async () => {
        setIsLoadingDocs(true);
        try {
          let token = localStorage.getItem("paynexToken");
          if (!token) {
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTQ5NTE0Y2M2OTVlNDdkMDA2YjY2ZSIsIm5hbWUiOiJHdWxuYXogR2hhbmNoaSIsImVtYWlsIjoiZ3VsbmF6LmdoYW5jaGlAdHJ1bmV4YS5jb20iLCJtZXJjaGFudElkIjoibWVyY2hhbnRfdGNqZmkxMHVxMW95aTh2cCIsImlhdCI6MTc4NDEwMzY5NCwiZXhwIjoxNzg0MTYxMjk0fQ.3JZh4uLof9ECirhmUDy3JfswLaXngL-Hy4E6Ya06nro";
          }
          const res = await fetch("https://dev.api.paynex.world/v1/merchant/api-documentation", {
            headers: {
              "Accept": "application/json, text/plain, */*",
              "Authorization": `Bearer ${token}`,
              "paynex-mode": "Test"
            }
          });
          if (res.ok) {
            const data = await res.json();
            setApiDocs(data);
          } else {
            // Graceful fallback on 401 or other errors
            const fallbackRes = await fetch("/api_docs.json");
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              setApiDocs(fallbackData);
            } else {
              setApiDocs({ error: `External API returned HTTP ${res.status}, and local fallback failed.` });
            }
          }
        } catch (err: any) {
          try {
            const fallbackRes = await fetch("/api_docs.json");
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              setApiDocs(fallbackData);
            } else {
              setApiDocs({ error: err.message });
            }
          } catch (fallbackErr: any) {
            setApiDocs({ error: err.message });
          }
        } finally {
          setIsLoadingDocs(false);
        }
      };
      fetchDocs();
    }
  }, [activeTab, apiDocs]);

  useEffect(() => {
    if (activeTab === "API Keys") {
      const fetchKeys = async () => {
        setIsLoadingKeys(true);
        try {
          const token = localStorage.getItem("paynexToken");
          if (!token) return;
          const res = await fetch("https://api.paynex.world/v1/merchant/api-key?take=10&orderBy=createdAt%7Casc", {
            headers: {
              "Accept": "application/json, text/plain, */*",
              "Authorization": `Bearer ${token}`,
              "paynex-mode": "Test"
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.list)) {
              setApiKeys(data.list);
            }
          }
        } catch (err) {
          console.error("Failed to fetch API keys", err);
        } finally {
          setIsLoadingKeys(false);
        }
      };
      fetchKeys();
    }
  }, [activeTab]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  return (
    <div className="w-full space-y-8 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-1">
        {activeTab !== "Overview" && (
          <button onClick={() => setActiveTab("Overview")} className="text-[13px] text-blue-600 font-medium hover:underline mb-2 flex items-center gap-1 w-max">
            ← Back to Settings
          </button>
        )}
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
          {activeTab === "Overview" ? "Settings" : activeTab === "Webhook" ? "Webhooks" : activeTab === "API Docs" ? "API Documentation" : activeTab}
        </h1>
        {activeTab === "Overview" && (
          <p className="text-[13px] text-gray-500 font-medium">
            Manage your account, project, and developer settings.
          </p>
        )}
      </div>

      {activeTab === "Overview" && (
        <div className="max-w-4xl pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-in fade-in duration-500">
          {/* Business Settings Card */}
          <div className="bg-white border border-gray-200 rounded-[8px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5">
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-[17px] font-normal text-gray-900 tracking-wide">Business settings</h2>
            </div>
            {/* Divider */}
            <div className="h-[1px] bg-gray-100 mx-5"></div>
            {/* Links */}
            <div className="flex flex-col p-6 gap-5">
              <button onClick={() => setActiveTab("Account")} className="text-left text-[14.5px] font-medium text-blue-600 hover:text-blue-800 transition-colors w-max">
                Account details
              </button>
              <button onClick={() => setActiveTab("Project")} className="text-left text-[14.5px] font-medium text-blue-600 hover:text-blue-800 transition-colors w-max">
                Project details
              </button>
            </div>
          </div>

          {/* Developers Settings Card */}
          <div className="bg-white border border-gray-200 rounded-[8px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Monitor className="w-5 h-5" />
              </div>
              <h2 className="text-[17px] font-normal text-gray-900 tracking-wide">Developers settings</h2>
            </div>
            {/* Divider */}
            <div className="h-[1px] bg-gray-100 mx-5"></div>
            {/* Links */}
            <div className="flex flex-col p-6 gap-5">
              <button onClick={() => setActiveTab("API Keys")} className="text-left text-[14.5px] font-medium text-blue-600 hover:text-blue-800 transition-colors w-max">
                API keys
              </button>
              <button onClick={() => setActiveTab("Webhook")} className="text-left text-[14.5px] font-medium text-blue-600 hover:text-blue-800 transition-colors w-max">
                Webhooks
              </button>
              <button onClick={() => setActiveTab("API Docs")} className="text-left text-[14.5px] font-medium text-blue-600 hover:text-blue-800 transition-colors w-max">
                API docs
              </button>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="bg-white border border-gray-200 rounded-[8px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5">
              <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-[17px] font-normal text-gray-900 tracking-wide">Security settings</h2>
            </div>
            {/* Divider */}
            <div className="h-[1px] bg-gray-100 mx-5"></div>
            {/* Links */}
            <div className="flex flex-col p-6 gap-5">
              <button onClick={() => setActiveTab("Change password")} className="text-left text-[14.5px] font-medium text-blue-600 hover:text-blue-800 transition-colors w-max">
                Change password
              </button>
              <button onClick={() => setActiveTab("Active sessions")} className="text-left text-[14.5px] font-medium text-blue-600 hover:text-blue-800 transition-colors w-max">
                Active sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Rendering based on Active Tab */}
      {activeTab === "Account" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {" "}
          <div className="flex flex-col gap-1">
            {" "}
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
              Account Details
            </h2>{" "}
            <p className="text-[13px] text-gray-500 font-medium">
              Your business and account information
            </p>{" "}
          </div>{" "}
          {/* Business Details Card */}{" "}
          <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm">
            {" "}
            <div className="mb-6">
              {" "}
              <h3 className="text-[14px] font-bold text-gray-900 mb-1">
                Business Details
              </h3>{" "}
              <p className="text-[12px] text-gray-500 font-medium">
                Basic information about your business and primary contact.
              </p>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-8">
              {" "}
              <div className="space-y-8">
                {" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Business Name
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    Chargnex
                  </p>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Business Address
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    Canada
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-8">
                {" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Contact Name
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    Chargnex Admin
                  </p>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Project
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    Moneris (CA)
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-8">
                {" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Contact Email
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    admin@chargnex.com
                  </p>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Country
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    Canada
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Services Card */}{" "}
          <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm">
            {" "}
            <div className="mb-6">
              {" "}
              <h3 className="text-[14px] font-bold text-gray-900 mb-1">
                Services
              </h3>{" "}
              <p className="text-[12px] text-gray-500 font-medium">
                Configured payment capabilities and supported card networks.
              </p>{" "}
            </div>{" "}
            <div className="space-y-6">
              {" "}
              <div>
                {" "}
                <p className="text-[11px] text-gray-400 font-semibold mb-3 uppercase tracking-wider">
                  Transaction Types
                </p>{" "}
                <div className="flex flex-wrap gap-2">
                  {" "}
                  {["WithToken", "WithoutToken", "Purchase", "Refund"].map(
                    (type) => (
                      <span
                        key={type}
                        className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-600 shadow-sm"
                      >
                        {" "}
                        {type}{" "}
                      </span>
                    ),
                  )}{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-[11px] text-gray-400 font-semibold mb-3 uppercase tracking-wider">
                  Accepted Card Schemes
                </p>{" "}
                <div className="flex flex-wrap gap-2">
                  {" "}
                  {[
                    "VISA",
                    "MASTERCARD",
                    "AMEX",
                    "DISCOVER",
                    "JCB",
                    "INTERAC",
                  ].map((card) => (
                    <span
                      key={card}
                      className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-600 shadow-sm"
                    >
                      {" "}
                      {card}{" "}
                    </span>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {activeTab === "Project" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {" "}
          <div className="flex flex-col gap-1">
            {" "}
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
              Project Details
            </h2>{" "}
            <p className="text-[13px] text-gray-500 font-medium">
              Configuration and details for the current project.
            </p>{" "}
          </div>{" "}
          {/* First Card - Details */}{" "}
          <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm">
            {" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-8">
              {" "}
              <div className="space-y-8">
                {" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Name
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    Moneris (CA)
                  </p>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Configuration Code
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    C001131EMV
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-8">
                {" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Gateway Provider
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    Moneris
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-8">
                {" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    Payment Application Version
                  </p>{" "}
                  <p className="text-[13px] text-gray-900 font-medium">
                    nexPay v3.2.0
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Second Card - Supported Capabilities */}{" "}
          <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm">
            {" "}
            <div className="mb-6">
              {" "}
              <h3 className="text-[14px] font-bold text-gray-900 mb-1">
                Supported Capabilities
              </h3>{" "}
              <p className="text-[12px] text-gray-500 font-medium">
                Configured payment capabilities and supported card networks.
              </p>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-8">
              {" "}
              <div className="col-span-1 md:col-span-2 space-y-6">
                {" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-3 uppercase tracking-wider">
                    Transaction Types
                  </p>{" "}
                  <div className="flex flex-wrap gap-2">
                    {" "}
                    {["WithToken", "WithoutToken", "Purchase", "Refund"].map(
                      (type) => (
                        <span
                          key={type}
                          className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-600 shadow-sm"
                        >
                          {" "}
                          {type}{" "}
                        </span>
                      ),
                    )}{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-3 uppercase tracking-wider">
                    Accepted Card Schemes
                  </p>{" "}
                  <div className="flex flex-wrap gap-2">
                    {" "}
                    {[
                      "VISA",
                      "MASTERCARD",
                      "AMEX",
                      "DISCOVER",
                      "JCB",
                      "INTERAC",
                    ].map((card) => (
                      <span
                        key={card}
                        className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-600 shadow-sm"
                      >
                        {" "}
                        {card}{" "}
                      </span>
                    ))}{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="col-span-1 space-y-6">
                {" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-3 uppercase tracking-wider">
                    Supported Countries
                  </p>{" "}
                  <div className="flex flex-wrap gap-2">
                    {" "}
                    <span className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-600 shadow-sm">
                      {" "}
                      Canada{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-[11px] text-gray-400 font-semibold mb-3 uppercase tracking-wider">
                    Supported Currencies
                  </p>{" "}
                  <div className="flex flex-wrap gap-2">
                    {" "}
                    <span className="px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-600 shadow-sm">
                      {" "}
                      USD{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}

      {activeTab === "API Keys" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">API Keys</h2>
            <p className="text-[13px] text-gray-500 font-medium">Use these keys to authenticate your requests. Keep your secret key secure and never share it publicly.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm space-y-4">

            {isLoadingKeys ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-[8px] bg-gray-50">
                <p className="text-[13px] text-gray-500">No API keys found.</p>
              </div>
            ) : (
              apiKeys.map((keyObj, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <h3 className="text-[13px] font-bold text-gray-700 tracking-wider uppercase">API Key</h3>

                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        readOnly
                        value={keyObj.apiKey}
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-[6px] text-[13px] text-gray-500 font-mono outline-none shadow-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(keyObj.apiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedKey === keyObj.apiKey ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-700 transition-colors shadow-sm">
                      <RefreshCcw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="text-[12px]">
                      <span className="font-bold text-gray-700">Name: </span>
                      <span className="text-gray-500">{keyObj.name || "Default API Key"}</span>
                    </div>
                    <div className="text-[12px]">
                      <span className="font-bold text-gray-700">Mode: </span>
                      <span className="text-gray-500">Live</span>
                    </div>
                    <div className="text-[12px]">
                      <span className="font-bold text-gray-700">Last used: </span>
                      <span className="text-gray-500">{keyObj.lastUsedAt ? new Date(keyObj.lastUsedAt).toLocaleDateString() : "Never"}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 px-4 py-3 border border-red-100 bg-red-50/50 rounded-[6px]">
                    <Key className="w-4 h-4 text-red-500" />
                    <span className="text-[13px] text-red-500 font-medium">Regenerating keys will invalidate your current keys immediately.</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "Webhook" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">Webhooks</h2>
            <p className="text-[13px] text-gray-500 font-medium">Configure webhooks to receive real-time updates about events in your account.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm space-y-4">
            {isLoadingWebhooks ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : webhooks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-[8px] bg-gray-50">
                <p className="text-[13px] text-gray-500">No webhooks found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border border-gray-200 rounded-[8px] bg-white">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[13px] text-gray-800 font-semibold">{webhook.url}</span>
                        {webhook.isActive && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-500">
                        Added on {new Date(webhook.createdAt).toLocaleDateString('en-GB')}
                      </p>
                      <div className="flex">
                        <span className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-semibold rounded-full">
                          {webhook.events && webhook.events.includes("ALL") ? "All Events" : (webhook.events || []).join(", ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-gray-500 font-medium">Enabled</span>
                        <button className={`w-9 h-5 rounded-full relative transition-colors ${webhook.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
                          <div className={`w-3.5 h-3.5 bg-white rounded-[10px] absolute top-[3px] transition-all ${webhook.isActive ? 'left-[18px]' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "API Docs" && (
        <div className="w-full min-h-[500px]">
          {isLoadingDocs ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : apiDocs?.error ? (
            <div className="py-20 flex flex-col items-center justify-center border border-dashed border-red-200 rounded-[8px] bg-red-50/50">
              <p className="text-[14px] font-semibold text-red-500 mb-2">Error Loading API Docs</p>
              <p className="text-[12px] text-red-400 max-w-md text-center">{apiDocs.error}</p>
            </div>
          ) : apiDocs ? (
            <QueryClientProvider client={queryClient}>
              <div className="elements-wrapper [&_a[href*='stoplight.io']]:!hidden">
                <API apiDescriptionDocument={apiDocs} router="hash" layout="stacked" hideExport={true} hideTryIt={true} />
              </div>
            </QueryClientProvider>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-[8px] bg-gray-50/50">
              <p className="text-[14px] font-semibold text-gray-500 mb-2">Failed to load API Documentation</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Change password" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl">
          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">Change Password</h2>
            <p className="text-[13px] text-gray-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
          </div>
          
          {/* Change Password Card */}
          <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm">
            <div className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-gray-700">Current Password</label>
                <input 
                  type="password" 
                  className="w-full h-9 px-3 border border-gray-300 rounded-[4px] text-[13px] text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-gray-700">New Password</label>
                <input 
                  type="password" 
                  className="w-full h-9 px-3 border border-gray-300 rounded-[4px] text-[13px] text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-gray-700">Confirm New Password</label>
                <input 
                  type="password" 
                  className="w-full h-9 px-3 border border-gray-300 rounded-[4px] text-[13px] text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
              <div className="pt-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-[4px] transition-colors shadow-sm">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Active sessions" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl">
          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">Active Sessions</h2>
            <p className="text-[13px] text-gray-500 font-medium">Manage and sign out of your active sessions on other browsers and devices.</p>
          </div>
          
          {/* Active Sessions Card */}
          <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-1">Active Sessions</h3>
                <p className="text-[12px] text-gray-500 font-medium">Manage and sign out of your active sessions on other browsers and devices.</p>
              </div>
              <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 text-[13px] font-medium rounded-[4px] transition-colors border border-gray-300 shadow-sm">
                Sign out of all devices
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-[6px] bg-blue-50/30">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">Mac OS • Safari (Current session)</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Toronto, ON, Canada • IP: 192.168.1.1</p>
                  <p className="text-[11px] text-green-600 font-semibold mt-1">Active now</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-[6px]">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">Windows 11 • Chrome</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">Montreal, QC, Canada • IP: 192.168.1.42</p>
                  <p className="text-[11px] text-gray-400 font-semibold mt-1">Last active 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
