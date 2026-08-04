import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface ProjectModalProps {
  onClose: () => void;
  onApply: (selectedCount: number) => void;
}

export function ProjectModal({ onClose, onApply }: ProjectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Set dummy data for projects since there is no API endpoint yet.
    const dummy = [
      { id: "proj_1", name: "All Projects", description: "Global scope" },
      { id: "proj_2", name: "Moneris E-Commerce (CA)", description: "Canadian Gateway" },
      { id: "proj_3", name: "Infosysltd45", description: "Custom Integration" },
      { id: "proj_4", name: "Elavon Payment Gateway", description: "US Gateway" },
      { id: "proj_5", name: "Chase Paymentech (US)", description: "US Gateway" }
    ];
    setProjects(dummy);
    setSelectedIds(new Set([dummy[0].id]));
  }, []);

  const handleSelectAll = () => {
    const allIds = projects.map(p => p.id);
    setSelectedIds(new Set(allIds));
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const filteredProjects = projects.filter(p => {
    const s = searchQuery.toLowerCase();
    return (p.name || "").toLowerCase().includes(s) ||
      (p.description || "").toLowerCase().includes(s) ||
      (p.id || "").toLowerCase().includes(s);
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-[700px] bg-[#F4F5F7] shadow-2xl flex flex-col font-sans border border-gray-300">
        {/* Header */}
        <div className="relative flex items-center justify-center py-3 bg-[#102B4E]">
          <h2 className="text-white text-[16px] font-medium tracking-wide">Project(s)</h2>
          <button onClick={onClose} className="absolute right-4 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5 font-light" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 pb-0 flex flex-col">
          {/* Search */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project name or ID"
              className="w-full h-10 pl-4 pr-10 bg-white border border-[#CBD5E1] rounded-[2px] text-[13px] text-gray-900 placeholder:text-gray-500 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex flex-col bg-white border border-[#CBD5E1] rounded-[2px]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#CBD5E1] bg-white">
              <span className="text-[13px] font-bold text-[#102B4E]">{selectedIds.size} Selected</span>
              <div className="flex items-center gap-4 text-[13px] text-gray-600 font-medium">
                <button onClick={handleSelectAll} className="hover:text-gray-900 transition-colors">Select All</button>
                <button onClick={handleClearAll} className="hover:text-gray-900 transition-colors">Clear All</button>
              </div>
            </div>
            <div className="flex justify-end px-4 py-2 border-b border-[#CBD5E1] bg-white">
              {/* Optional secondary filters can go here */}
            </div>

            {/* List */}
            <div className="flex flex-col max-h-[340px] overflow-y-auto bg-white min-h-[300px]">
              {filteredProjects.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-start gap-4 px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedIds.has(p.id) ? 'bg-[#F2F2F2]' : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="w-[14px] h-[14px] mt-1 rounded-[2px] border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-[#187588] text-white text-[12px] font-bold shrink-0 mt-0.5 shadow-sm">
                    {p.name ? p.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] text-[#102B4E]">{p.id} | {p.name || "Unknown"}</span>
                    <span className="text-[11px] text-gray-600 uppercase">{p.description}</span>
                  </div>
                </label>
              ))}
              {filteredProjects.length === 0 && (
                <div className="flex items-center justify-center p-8 text-[13px] text-gray-500">
                  No projects found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 py-6 bg-[#F4F5F7]">
          <button
            onClick={() => onApply(selectedIds.size)}
            className="px-10 py-1.5 bg-[#0B2144] text-white rounded-[2px] text-[13px] font-medium hover:bg-blue-900 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={onClose}
            className="px-10 py-1.5 bg-white border border-[#CBD5E1] text-[#0B2144] rounded-[2px] text-[13px] font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
