const fs = require('fs');
const path = './app/dashboard/transactions/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add hasSearched state
code = code.replace(
  'const [isLoading, setIsLoading] = useState(true);',
  'const [isLoading, setIsLoading] = useState(true);\n  const [hasSearched, setHasSearched] = useState(false);\n  const [searchTab, setSearchTab] = useState("Account and Date");\n  const [isTxDetailsOpen, setIsTxDetailsOpen] = useState(true);'
);

// 2. Add lucide imports if needed (ArrowLeft, Check)
code = code.replace(
  'MoreHorizontal, Eye, CreditCard } from "lucide-react";',
  'MoreHorizontal, Eye, CreditCard, ChevronUp, Check } from "lucide-react";'
);

// 3. Find the main return statement
const returnIndex = code.indexOf('  return (\n    <div className="w-full space-y-6 pt-2">');
if (returnIndex === -1) {
    console.error("Could not find return statement");
    process.exit(1);
}

const beforeReturn = code.substring(0, returnIndex);
const existingReturn = code.substring(returnIndex);

const newReturnLogic = `
  const renderSearchForm = () => {
    return (
      <div className="w-full min-h-[calc(100vh-100px)] bg-white font-sans text-[#102B4E]">
        <h1 className="text-[22px] font-semibold text-center mb-8 text-[#102B4E]">Find A Transaction</h1>
        
        <div className="flex gap-8 max-w-[1200px] mx-auto px-6">
          {/* Left Sidebar */}
          <div className="w-[220px] shrink-0 flex flex-col gap-1">
            <button 
              onClick={() => setSearchTab("Account and Date")}
              className={\`text-left px-4 py-2.5 text-[14px] font-semibold rounded-md transition-colors \${searchTab === "Account and Date" ? "bg-[#CBE4F0] text-[#102B4E]" : "text-gray-500 hover:bg-gray-50"}\`}
            >
              Account and Date
            </button>
            <button 
              onClick={() => setSearchTab("Transaction Details")}
              className={\`text-left px-4 py-2.5 text-[14px] font-semibold rounded-md transition-colors \${searchTab === "Transaction Details" ? "bg-[#CBE4F0] text-[#102B4E]" : "text-gray-500 hover:bg-gray-50"}\`}
            >
              Transaction Details
            </button>
            <button 
              onClick={() => setSearchTab("Fee Details")}
              className={\`text-left px-4 py-2.5 text-[14px] font-semibold rounded-md transition-colors \${searchTab === "Fee Details" ? "bg-[#CBE4F0] text-[#102B4E]" : "text-gray-500 hover:bg-gray-50"}\`}
            >
              Fee Details
            </button>
          </div>

          {/* Right Content / Accordions */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Account and Date Accordion */}
            <div className="border border-[#CBD5E1] bg-white rounded-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E1] bg-white">
                <h2 className="text-[14px] font-bold text-[#102B4E]">Account and Date</h2>
                <ChevronUp className="w-5 h-5 text-[#64748B]" />
              </div>
              <div className="p-8 pb-12 flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <span className="text-[13px] font-semibold min-w-[80px]">Account(s)<span className="text-red-500">*</span></span>
                  <div className="relative w-[280px]">
                    <select className="w-full appearance-none bg-white border border-[#CBD5E1] text-[13px] px-4 py-2 pr-10 rounded-sm focus:outline-none">
                      <option>1 Selected</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-12 ml-[104px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border border-[#CBD5E1] flex items-center justify-center"></div>
                    <span className="text-[13px]">All Transactions</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border border-[#00607A] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#00607A]"></div>
                    </div>
                    <span className="text-[13px]">Settled Transactions</span>
                  </label>
                </div>

                <div className="flex items-center gap-6 ml-[104px]">
                  <div className="flex items-center gap-12 shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded-full border border-[#00607A] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#00607A]"></div>
                      </div>
                      <span className="text-[13px]">Transaction Date</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mr-6">
                      <div className="w-4 h-4 rounded-full border border-[#CBD5E1] flex items-center justify-center"></div>
                      <span className="text-[13px]">Settlement Date</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500 mb-1">Start Date</span>
                      <input type="text" value="June 13, 2026" readOnly className="border border-[#CBD5E1] px-4 py-1.5 text-[13px] rounded-sm w-[140px] text-center bg-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500 mb-1">End Date</span>
                      <input type="text" value="July 13, 2026" readOnly className="border border-[#CBD5E1] px-4 py-1.5 text-[13px] rounded-sm w-[140px] text-center bg-white" />
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
                <h2 className="text-[14px] font-bold text-[#102B4E]">Transaction Details</h2>
                {isTxDetailsOpen ? <ChevronUp className="w-5 h-5 text-[#64748B]" /> : <ChevronDown className="w-5 h-5 text-[#64748B]" />}
              </button>
              
              {isTxDetailsOpen && (
                <div className="p-8 flex items-start gap-16 border-t border-[#CBD5E1]">
                  {/* Left Column Fields */}
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-start gap-6">
                      <span className="text-[13px] font-semibold min-w-[120px] mt-2">Transaction Type</span>
                      <div className="flex-1">
                        <div className="relative w-full">
                          <select className="w-full appearance-none bg-white border border-[#CBD5E1] text-[13px] px-4 py-2 pr-10 rounded-sm focus:outline-none">
                            <option>Select Transaction Type</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="flex flex-col gap-2 mt-4 ml-1">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <div className="w-4 h-4 border border-[#CBD5E1] rounded-sm"></div>
                            <span className="text-[13px]">Approved</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <div className="w-4 h-4 border border-[#CBD5E1] rounded-sm"></div>
                            <span className="text-[13px]">Declined</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <span className="text-[13px] font-semibold min-w-[120px]">Card Type</span>
                      <div className="relative flex-1">
                        <select className="w-full appearance-none bg-white border border-[#CBD5E1] text-[13px] px-4 py-2 pr-10 rounded-sm focus:outline-none">
                          <option>Select Card Type</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column Fields */}
                  <div className="flex-1 flex flex-col gap-6 pt-2">
                    <div className="flex items-center gap-6">
                      <span className="text-[13px] min-w-[120px]">Device Number</span>
                      <input type="text" className="flex-1 border border-[#CBD5E1] px-4 py-1.5 text-[13px] rounded-sm bg-white" />
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[13px] min-w-[120px]">Batch Number</span>
                      <input type="text" className="flex-1 border border-[#CBD5E1] px-4 py-1.5 text-[13px] rounded-sm bg-white" />
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[13px] min-w-[120px]">Invoice Number</span>
                      <input type="text" className="flex-1 border border-[#CBD5E1] px-4 py-1.5 text-[13px] rounded-sm bg-white" />
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[13px] min-w-[120px]">Clerk ID</span>
                      <input type="text" className="flex-1 border border-[#CBD5E1] px-4 py-1.5 text-[13px] rounded-sm bg-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8 mb-20">
              <button 
                onClick={() => setHasSearched(true)}
                className="bg-[#002D42] text-white px-12 py-2 rounded-sm text-[14px] font-medium"
              >
                Search
              </button>
              <button className="bg-white border border-[#102B4E] text-[#102B4E] px-12 py-2 rounded-sm text-[14px] font-medium">
                Reset
              </button>
              <button className="bg-white border border-[#102B4E] text-[#102B4E] px-8 py-2 rounded-sm text-[14px] font-medium ml-12">
                CSV Download
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  };

  if (!hasSearched) {
    return renderSearchForm();
  }

`;

const modifiedReturn = existingReturn.replace(
  '  return (\n    <div className="w-full space-y-6 pt-2">',
  newReturnLogic + '  return (\n    <div className="w-full space-y-6 pt-2">\n      <div className="flex items-center mb-2">\n        <button onClick={() => setHasSearched(false)} className="text-blue-600 hover:underline text-[13px] font-medium flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Back to Search</button>\n      </div>'
);

fs.writeFileSync(path, beforeReturn + modifiedReturn);
console.log("File modified successfully.");
