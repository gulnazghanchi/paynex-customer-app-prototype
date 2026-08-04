import { useState, useRef } from "react";
import { ChevronDown, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export function MonthlyStatement() {
  const [activeSection, setActiveSection] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSaveAsPDF = async () => {
    if (!reportRef.current) return;
    try {
      const imgData = await toPng(reportRef.current, { cacheBust: true, pixelRatio: 2 });
      
      const imgWidth = reportRef.current.offsetWidth;
      const imgHeight = reportRef.current.offsetHeight;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Monthly_Statement.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const menuItems = [
    "1 Sales Summary by Card Type",
    "2 Interchange & Wholesale...",
    "3 Assessment & Other C...",
    "4 Transaction Fees",
    "5 Service Fees",
    "6 Fee Summary",
    "7 Effective Merchant Dis...",
    "8 Monthly Summary",
    "9 Daily Activity Summary",
    "10 Financial Details",
    "11 Monthly Net Sales Am...",
    "12 Peer Reporting"
  ];

  const chartData = [
    { name: 'Mar-2026', value: 91 },
    { name: 'Apr-2026', value: 78 },
    { name: 'May-2026', value: 48 },
    { name: 'Jun-2026', value: 55 },
  ];

  return (
    <div className="w-full flex flex-col bg-[#F3F4F6] min-h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-end p-4 bg-white border-b border-gray-200 gap-4 text-[13px]">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Account</span>
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded-sm px-3 py-1 pr-8 min-w-[200px] text-gray-800 bg-white focus:outline-none focus:border-blue-500">
              <option>Chargnex</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <span className="text-gray-700 font-medium">Statement Date</span>
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded-sm px-3 py-1 pr-8 min-w-[150px] text-gray-800 bg-white focus:outline-none focus:border-blue-500">
              <option>2026 June</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-1.5 rounded-sm font-medium transition-colors ml-4 shadow-sm">
          View
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 p-6 gap-6 max-w-[1600px] w-full">

        {/* Left Menu */}
        <div className="w-[280px] flex flex-col shrink-0">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col py-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveSection(idx);
                  document.getElementById(`section-${idx + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-left px-5 py-2.5 text-[13px] font-medium transition-colors ${idx === activeSection ? "border-l-[6px] border-l-[#0f172a] bg-gray-50/80 text-[#0f172a]" : "border-l-[6px] border-l-transparent text-gray-600 hover:bg-gray-50"} border-b border-gray-100 last:border-0`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 bg-[#d1d5db] p-5 rounded-sm flex flex-col items-center">
            <button 
              onClick={handleSaveAsPDF}
              className="w-[80%] bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 text-[13px] font-medium rounded-sm transition-colors shadow-sm"
            >
              Save as PDF
            </button>
          </div>
        </div>

        {/* Document View */}
        <div ref={reportRef} className="flex-1 bg-white border border-gray-200 shadow-sm rounded-sm p-10 flex flex-col min-h-[800px]">

          {/* Header */}
          <div className="flex justify-between items-start mb-16 relative">

            {/* Merchant Info */}
            <div className="text-[10px] leading-tight text-gray-800 font-medium tracking-tight">
              <div className="font-bold text-[12px] mb-2 text-gray-900">Moneris</div>
              <div>NARA NHADNOUSH</div>
              <div>900 SELKIRK AV</div>
              <div>POINTE-CLAIRE, QC H9R3S3</div>
              <div>CAN</div>
            </div>

            {/* Logo (Centered absolutely) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center gap-1.5 text-[#005B82] pt-2">
              <span className="text-3xl font-bold tracking-tighter" style={{ fontFamily: 'sans-serif' }}>Moneris</span>
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M55 20C35.67 20 20 35.67 20 55C20 74.33 35.67 90 55 90C74.33 90 90 74.33 90 55" stroke="#005B82" strokeWidth="9" strokeLinecap="round" />
                <path d="M55 35C43.95 35 35 43.95 35 55C35 66.05 43.95 75 55 75C66.05 75 75 66.05 75 55" stroke="#00AEEF" strokeWidth="6" strokeLinecap="round" />
                <path d="M65 15C75 15 82 22 82 32" stroke="#005B82" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>

            {/* Statement Info */}
            <div className="text-right text-[10px] leading-tight text-gray-700 flex flex-col gap-1 items-end mt-1">
              <div className="text-[17px] text-gray-700 font-normal mb-2 tracking-tight">Monthly Statement</div>
              <div className="text-gray-600">Statement Date: <span className="font-medium text-gray-900">June 2026</span></div>
              <div className="mt-2 text-gray-600">Merchant Number: <span className="font-medium text-gray-900">30213746193</span></div>
              <div className="text-gray-600">Chain Number: <span className="font-medium text-gray-900">30600064527</span></div>
            </div>
          </div>

          {/* Table: Sales Summary by Card Type */}
          <div id="section-1" className="border border-gray-200 rounded-sm overflow-hidden mt-6 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">1 Sales Summary by Card Type</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 border-r border-gray-200 bg-white"></th>
                    <th colSpan={2} className="px-4 py-2 border-r border-gray-200 bg-white font-medium text-center text-gray-600">Gross Sales</th>
                    <th colSpan={2} className="px-4 py-2 border-r border-gray-200 bg-white font-medium text-center text-gray-600">Returns</th>
                    <th colSpan={3} className="px-4 py-2 bg-white font-medium text-center text-gray-600">Net Sales</th>
                  </tr>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[20%]">Card Type</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[10%]">Total Items</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Total Amount</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[10%]">Total Items</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Total Amount</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[10%]">Total Items</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Total Amount</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[15%]">Average Ticket</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 border-r border-gray-100 text-left text-gray-800">American Express</td>
                    <td className="px-4 py-3 text-gray-800">1</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">2.00</td>
                    <td className="px-4 py-3 text-gray-800">0</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-3 text-gray-800">1</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">2.00</td>
                    <td className="px-4 py-3 text-gray-800">2.00</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 border-r border-gray-100 text-left text-gray-800">Interac</td>
                    <td className="px-4 py-3 text-gray-800">3</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">14.00</td>
                    <td className="px-4 py-3 text-gray-800">0</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-3 text-gray-800">3</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">14.00</td>
                    <td className="px-4 py-3 text-gray-800">4.67</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 border-r border-gray-100 text-left text-gray-800">MasterCard</td>
                    <td className="px-4 py-3 text-gray-800">7</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">21.05</td>
                    <td className="px-4 py-3 text-gray-800">0</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-3 text-gray-800">7</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">21.05</td>
                    <td className="px-4 py-3 text-gray-800">3.01</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-[#f8fafc]">
                    <td className="px-4 py-3 border-r border-gray-100 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-3 text-gray-800">17</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">18.36</td>
                    <td className="px-4 py-3 text-gray-800">0</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-3 text-gray-800">17</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-gray-800">18.36</td>
                    <td className="px-4 py-3 text-gray-800">1.08</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-3 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-3 text-gray-900">28</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-900">55.41</td>
                    <td className="px-4 py-3 text-gray-900">0</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-3 text-gray-900">28</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-gray-900">55.41</td>
                    <td className="px-4 py-3 text-gray-900">1.98</td>
                  </tr>
                  <tr className="bg-[#bcbcbc] font-medium">
                    <td className="px-4 py-3 border-r border-gray-300 text-left text-gray-900 font-bold">Grand Total</td>
                    <td className="px-4 py-3 text-gray-900">28</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">55.41</td>
                    <td className="px-4 py-3 text-gray-900">0</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">0.00</td>
                    <td className="px-4 py-3 text-gray-900">28</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">55.41</td>
                    <td className="px-4 py-3 text-gray-900">1.98</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Interchange & Wholesale Discount Fees */}
          <div id="section-2" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">2 Interchange & Wholesale Discount Fees</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[25%]">Description</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Original Transaction Amount</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Items</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Rate %</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Rate / Item</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Minimum Rate / Item</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Maximum Rate / Item</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[10%]">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {/* VISA */}
                  <tr className="bg-white">
                    <td colSpan={8} className="px-4 py-2 text-left font-medium text-gray-600 uppercase">VISA INTERCHANGE FEES</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">CAN-CFFA CONSUMER CNP-NNSS-CREDIT-SM</td>
                    <td className="px-4 py-2 text-gray-800">6.00</td>
                    <td className="px-4 py-2 text-gray-800">5</td>
                    <td className="px-4 py-2 text-gray-800">1.30000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.08</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">CAN-DF01 STAND-INFINITE-NNSS-CREDIT</td>
                    <td className="px-4 py-2 text-gray-800">6.78</td>
                    <td className="px-4 py-2 text-gray-800">3</td>
                    <td className="px-4 py-2 text-gray-800">1.70000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.12</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">CAN-DS01 STAND-CONSUMER-NNSS</td>
                    <td className="px-4 py-2 text-gray-800">5.58</td>
                    <td className="px-4 py-2 text-gray-800">3</td>
                    <td className="px-4 py-2 text-gray-800">1.45000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.08</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={7} className="px-4 py-2.5 text-left text-gray-900 uppercase">TOTAL VISA INTERCHANGE FEES</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.28</td>
                  </tr>

                  {/* MASTERCARD */}
                  <tr className="bg-white">
                    <td colSpan={8} className="px-4 py-2 text-left font-medium text-gray-600 uppercase pt-4">MASTERCARD INTERCHANGE FEES</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">CAN-CEN INTRACOUNTRY CONS DIGITAL COMMERCE</td>
                    <td className="px-4 py-2 text-gray-800">5.50</td>
                    <td className="px-4 py-2 text-gray-800">3</td>
                    <td className="px-4 py-2 text-gray-800">1.57000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.09</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">CAN-C6A INTRACOUNTRY CONSUMER CONTACTLESS</td>
                    <td className="px-4 py-2 text-gray-800">8.49</td>
                    <td className="px-4 py-2 text-gray-800">2</td>
                    <td className="px-4 py-2 text-gray-800">0.70000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.06</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">CAN-C6B INTRACOUNTRY CONS WORLD CONTACTLESS</td>
                    <td className="px-4 py-2 text-gray-800">7.03</td>
                    <td className="px-4 py-2 text-gray-800">1</td>
                    <td className="px-4 py-2 text-gray-800">0.93000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.07</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={7} className="px-4 py-2.5 text-left text-gray-900 uppercase">TOTAL MASTERCARD INTERCHANGE FEES</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.22</td>
                  </tr>

                  {/* INTERAC */}
                  <tr className="bg-white">
                    <td colSpan={8} className="px-4 py-2 text-left font-medium text-gray-600 uppercase pt-4">INTERAC INTERCHANGE FEES</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">CAN-ZTI1 LOW TICKET FLASH TIER I</td>
                    <td className="px-4 py-2 text-gray-800">14.00</td>
                    <td className="px-4 py-2 text-gray-800">1</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.020000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={7} className="px-4 py-2.5 text-left text-gray-900 uppercase">TOTAL INTERAC INTERCHANGE FEES</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.02</td>
                  </tr>

                  {/* AMEX */}
                  <tr className="bg-white">
                    <td colSpan={8} className="px-4 py-2 text-left font-medium text-gray-600 uppercase pt-4">AMERICAN EXPRESS WHOLESALE DISCOUNT FEES</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">CAN-CS1N STAND-SERVICES CNP TIER 1</td>
                    <td className="px-4 py-2 text-gray-800">2.00</td>
                    <td className="px-4 py-2 text-gray-800">1</td>
                    <td className="px-4 py-2 text-gray-800">1.90000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.04</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={7} className="px-4 py-2.5 text-left text-gray-900 uppercase">TOTAL AMERICAN EXPRESS WHOLESALE DISCOUNT FEES</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.04</td>
                  </tr>

                  <tr className="bg-[#bcbcbc] font-medium">
                    <td colSpan={7} className="px-4 py-3 border-r border-gray-300 text-left text-gray-900 font-bold">Grand Total</td>
                    <td className="px-4 py-3 text-gray-900">-0.56</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 3: Assessment & Other Card Brand Fees */}
          <div id="section-3" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">3 Assessment & Other Card Brand Fees</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[25%]">Description</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Original Transaction Amount</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Transaction Volume</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Items</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Rate %</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Rate / Item</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[10%]">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">VISA - ASSESSMENT</td>
                    <td className="px-4 py-2 text-gray-800">18.36</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">11</td>
                    <td className="px-4 py-2 text-gray-800">0.10170</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={6} className="px-4 py-2.5 text-left text-gray-900">Total Visa Assessment Fees</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.02</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">MC - ASSESSMENT</td>
                    <td className="px-4 py-2 text-gray-800">21.05</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">7</td>
                    <td className="px-4 py-2 text-gray-800">0.10170</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">-0.03</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={6} className="px-4 py-2.5 text-left text-gray-900">Total MasterCard Assessment Fees</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.03</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">INTERAC - ASSESSMENT</td>
                    <td className="px-4 py-2 text-gray-800">14.00</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">3</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.015803</td>
                    <td className="px-4 py-2 text-gray-800">-0.05</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={6} className="px-4 py-2.5 text-left text-gray-900">Total Interac Assessment Fees</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.05</td>
                  </tr>

                  <tr className="bg-[#bcbcbc] font-medium">
                    <td colSpan={6} className="px-4 py-3 border-r border-gray-300 text-left text-gray-900">Total Assessment Fees</td>
                    <td className="px-4 py-3 text-gray-900">-0.10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 4: Transaction Fees */}
          <div id="section-4" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">4 Transaction Fees</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[25%]">Description</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Original Transaction Amount</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Transaction Volume</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Items</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Rate %</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">Rate / Item</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[10%]">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">VISA - TRANSACTION</td>
                    <td className="px-4 py-2 text-gray-800">18.36</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">17</td>
                    <td className="px-4 py-2 text-gray-800">0.30000</td>
                    <td className="px-4 py-2 text-gray-800">0.100000</td>
                    <td className="px-4 py-2 text-gray-800">-1.76</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">VISA - GATEWAY TRANSACTION</td>
                    <td className="px-4 py-2 text-gray-800">18.36</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">17</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.010000</td>
                    <td className="px-4 py-2 text-gray-800">-0.17</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={6} className="px-4 py-2.5 text-left text-gray-900">Total VISA Transaction Fees</td>
                    <td className="px-4 py-2.5 text-gray-900">-1.93</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">MC - TRANSACTION</td>
                    <td className="px-4 py-2 text-gray-800">21.05</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">7</td>
                    <td className="px-4 py-2 text-gray-800">0.30000</td>
                    <td className="px-4 py-2 text-gray-800">0.100000</td>
                    <td className="px-4 py-2 text-gray-800">-0.77</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">MC - GATEWAY TRANSACTION</td>
                    <td className="px-4 py-2 text-gray-800">21.05</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">7</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.010000</td>
                    <td className="px-4 py-2 text-gray-800">-0.07</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">MC - CLEARING FEE - SMALL TICKET</td>
                    <td className="px-4 py-2 text-gray-800">21.05</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">7</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.007966</td>
                    <td className="px-4 py-2 text-gray-800">-0.06</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">NETWORK CONNECTIVITY FEE</td>
                    <td className="px-4 py-2 text-gray-800">21.05</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">7</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.018007</td>
                    <td className="px-4 py-2 text-gray-800">-0.13</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={6} className="px-4 py-2.5 text-left text-gray-900">Total MASTERCARD Transaction Fees</td>
                    <td className="px-4 py-2.5 text-gray-900">-1.03</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">INTERAC - TRANSACTION</td>
                    <td className="px-4 py-2 text-gray-800">14.00</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">3</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.100000</td>
                    <td className="px-4 py-2 text-gray-800">-0.30</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">INTERAC - GATEWAY TRANSACTION</td>
                    <td className="px-4 py-2 text-gray-800">14.00</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">3</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.010000</td>
                    <td className="px-4 py-2 text-gray-800">-0.03</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={6} className="px-4 py-2.5 text-left text-gray-900">Total INTERAC Transaction Fees</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.33</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">AMEX - TRANSACTION</td>
                    <td className="px-4 py-2 text-gray-800">2.00</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">1</td>
                    <td className="px-4 py-2 text-gray-800">0.30000</td>
                    <td className="px-4 py-2 text-gray-800">0.100000</td>
                    <td className="px-4 py-2 text-gray-800">-0.11</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">AMEX - GATEWAY TRANSACTION</td>
                    <td className="px-4 py-2 text-gray-800">2.00</td>
                    <td className="px-4 py-2 text-gray-800"></td>
                    <td className="px-4 py-2 text-gray-800">1</td>
                    <td className="px-4 py-2 text-gray-800">0.00000</td>
                    <td className="px-4 py-2 text-gray-800">0.010000</td>
                    <td className="px-4 py-2 text-gray-800">-0.01</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td colSpan={6} className="px-4 py-2.5 text-left text-gray-900">Total AMERICAN EXPRESS Transaction Fees</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.12</td>
                  </tr>

                  <tr className="bg-[#bcbcbc] font-medium">
                    <td colSpan={6} className="px-4 py-3 border-r border-gray-300 text-left text-gray-900">Total Transaction Fees</td>
                    <td className="px-4 py-3 text-gray-900">-3.41</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 5: Service Fees */}
          <div id="section-5" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">5 Service Fees</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[55%]">Description</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Items</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">Rate / Item</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[15%]">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">GATEWAY FEE</td>
                    <td className="px-4 py-2 text-gray-800">1</td>
                    <td className="px-4 py-2 text-gray-800">10.000000</td>
                    <td className="px-4 py-2 text-gray-800">-10.00</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">MC - AUTHORIZATION INTEGRITY PROCESSING</td>
                    <td className="px-4 py-2 text-gray-800">2</td>
                    <td className="px-4 py-2 text-gray-800">0.160000</td>
                    <td className="px-4 py-2 text-gray-800">-0.32</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">ACCOUNT SERVICE</td>
                    <td className="px-4 py-2 text-gray-800">1</td>
                    <td className="px-4 py-2 text-gray-800">5.000000</td>
                    <td className="px-4 py-2 text-gray-800">-5.00</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">MC - PRE-AUTHORIZATION MINIMUM</td>
                    <td className="px-4 py-2 text-gray-800">4</td>
                    <td className="px-4 py-2 text-gray-800">0.020000</td>
                    <td className="px-4 py-2 text-gray-800">-0.08</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">INTERAC - ASSESSMENT</td>
                    <td className="px-4 py-2 text-gray-800">1</td>
                    <td className="px-4 py-2 text-gray-800">0.040000</td>
                    <td className="px-4 py-2 text-gray-800">-0.04</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900">Total Other Service Fees</td>
                    <td className="px-4 py-2.5 text-gray-900">0</td>
                    <td className="px-4 py-2.5 text-gray-900"></td>
                    <td className="px-4 py-2.5 text-gray-900">-15.44</td>
                  </tr>
                  <tr className="bg-[#bcbcbc] font-medium">
                    <td className="px-4 py-3 border-r border-gray-300 text-left text-gray-900">Total Service Fees</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">0</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900"></td>
                    <td className="px-4 py-3 text-gray-900">-15.44</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 6: Fee Summary */}
          <div id="section-6" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">6 Fee Summary</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[85%]">Description</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[15%]">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">TOTAL VISA INTERCHANGE, ASSESSMENT & OTHER CARD BRAND FEES</td>
                    <td className="px-4 py-2 text-gray-800">-0.30</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">TOTAL MASTERCARD INTERCHANGE, ASSESSMENT & OTHER CARD BRAND FEES</td>
                    <td className="px-4 py-2 text-gray-800">-0.25</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">TOTAL INTERAC INTERCHANGE, ASSESSMENT & OTHER CARD BRAND FEES</td>
                    <td className="px-4 py-2 text-gray-800">-0.07</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">TOTAL AMEX WHOLESALE DISCOUNT, PARTICIPATION, INBOUND & OTHER CARD BRAND FEES</td>
                    <td className="px-4 py-2 text-gray-800">-0.04</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">TOTAL MONERIS TRANSACTION FEES</td>
                    <td className="px-4 py-2 text-gray-800">-3.41</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">TOTAL SERVICE FEES</td>
                    <td className="px-4 py-2 text-gray-800">-15.44</td>
                  </tr>
                  <tr className="bg-[#bcbcbc] font-medium">
                    <td className="px-4 py-3 border-r border-gray-300 text-left text-gray-900">Total fees</td>
                    <td className="px-4 py-3 text-gray-900">-19.51</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 7: Effective Merchant Discount Rate (eMDR) */}
          <div id="section-7" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">7 Effective Merchant Discount Rate (eMDR)</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[85%]">Card Type</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[15%]">Rate %</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-2 text-gray-800">8.55</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">MasterCard</td>
                    <td className="px-4 py-2 text-gray-800">6.08</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">Interac</td>
                    <td className="px-4 py-2 text-gray-800">2.86</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800">American Express</td>
                    <td className="px-4 py-2 text-gray-800">8.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 8: Monthly Summary */}
          <div id="section-8" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">8 Monthly Summary</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 text-center">Total Discount and Transaction Fees</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 text-center">Total Service Fee</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 text-center">Debit Adjustments</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 text-center">Credit Adjustments</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 text-center">Misc. Adjustments</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 text-center">Chargebacks</th>
                    <th className="px-4 py-2 font-medium text-gray-500 text-center">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-100 bg-[#f8fafc]">
                    <td className="px-4 py-3 border-r border-gray-100 text-right text-gray-800">-4.07</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-right text-gray-800">-15.44</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-right text-gray-800">0.00</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-right text-gray-800">0.00</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-right text-gray-800">0.00</td>
                    <td className="px-4 py-3 border-r border-gray-100 text-right text-gray-800">0.00</td>
                    <td className="px-4 py-3 text-right text-gray-800">-19.51</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 9: Daily Activity Summary */}
          <div id="section-9" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">9 Daily Activity Summary</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[10%]">Date</th>
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[15%]">Card Type</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500">Gross Sales</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500">Returns</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500">Net Sales</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500">Discount & Transaction Fees</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500">Adjustment & Service Fees</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500">Chargebacks</th>
                    <th className="px-4 py-2 font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/01/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">3.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">3.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">3.00</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/01/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MasterCard</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">5.50</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">5.50</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">5.50</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/01/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">American Express</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">2.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">2.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">2.00</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">10.50</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">10.50</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">10.50</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/03/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.05</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.05</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">0.05</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/03/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MasterCard</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.03</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.03</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">0.03</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.08</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.08</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">0.08</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/04/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Other Activity</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-0.02</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">-0.02</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.02</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/08/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MasterCard</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">7.03</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">7.03</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">7.03</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">7.03</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">7.03</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">7.03</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/09/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Other Activity</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-0.02</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">-0.02</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.02</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/12/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">5.92</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">5.92</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">5.92</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/12/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MasterCard</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.23</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.23</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">0.23</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">6.15</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">6.15</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">6.15</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/15/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">0.00</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/15/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Other Activity</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-0.02</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">-0.02</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">-0.02</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/15/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MasterCard</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">8.26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">8.26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">8.26</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">8.26</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">8.26</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">8.26</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/16/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">6.41</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">6.41</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">6.41</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/16/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Other Activity</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-0.02</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">6.41</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">6.41</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">-0.02</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">6.39</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/25/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">0.00</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">0.00</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/26/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Interac</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">14.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">14.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">14.00</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">14.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">14.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">14.00</td>
                  </tr>

                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/30/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Visa</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">3.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">3.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-2.23</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">0.77</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/30/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MasterCard</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-1.26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-1.26</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/30/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Interac</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-0.42</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.42</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/30/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">American Express</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-0.16</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.16</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/30/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">Other Activity</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">-15.35</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-15.35</td>
                  </tr>
                  <tr className="bg-[#f3f4f6] font-medium border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-200"></td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-left text-gray-900">Total</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">3.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">3.00</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">-4.07</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">-15.35</td>
                    <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">0.00</td>
                    <td className="px-4 py-2.5 text-gray-900">-16.42</td>
                  </tr>

                  <tr className="bg-[#bcbcbc] font-medium">
                    <td className="px-4 py-3 border-r border-gray-300 text-left text-gray-900 font-bold">Grand Total</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-left text-gray-900 font-bold"></td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">55.41</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">0.00</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">55.41</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">-4.07</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">-15.44</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-gray-900">0.00</td>
                    <td className="px-4 py-3 text-gray-900">35.90</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 10: Financial Details */}
          <div id="section-10" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-[#f9fafb] border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">10 Financial Details</h3>
              <Download className="w-[18px] h-[18px] text-gray-900 cursor-pointer font-bold" strokeWidth={3} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[12%]">Date</th>
                    <th className="px-4 py-2 border-r border-gray-200 text-left font-medium text-gray-500 w-[28%]">Description</th>
                    <th className="px-4 py-2 border-r border-gray-200 text-center font-medium text-gray-500 w-[20%]">Deposit Account Number</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[15%]">PST/QST</th>
                    <th className="px-4 py-2 border-r border-gray-200 font-medium text-gray-500 w-[10%]">GST/HST</th>
                    <th className="px-4 py-2 font-medium text-gray-500 w-[15%]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/01/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS - Sales & Refunds</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">10.50</td>
                  </tr>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/03/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS - Sales & Refunds</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">0.06</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/04/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS FEES</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/08/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS - Sales & Refunds</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">7.03</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/09/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS FEES</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/12/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS - Sales & Refunds</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">6.15</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/13/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS FEES</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/15/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS - Sales & Refunds</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">8.26</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/16/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS - Sales & Refunds</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">6.41</td>
                  </tr>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/16/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS FEES</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">-0.02</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/26/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS - Sales & Refunds</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">14.00</td>
                  </tr>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/30/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS - Sales & Refunds</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.00</td>
                    <td className="px-4 py-2 text-gray-800">3.00</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-100">
                    <td className="px-4 py-2 text-left text-gray-800 border-r border-gray-100">06/30/26</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-left text-gray-800">MONERIS FEES</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-800">***** ***** ***7270</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">1.50</td>
                    <td className="px-4 py-2 border-r border-gray-100 text-gray-800">0.75</td>
                    <td className="px-4 py-2 text-gray-800">-21.68</td>
                  </tr>

                  <tr className="bg-[#bcbcbc] font-medium border-b border-gray-300">
                    <td className="px-4 py-2.5 text-left text-gray-900 border-r border-gray-300"></td>
                    <td className="px-4 py-2.5 border-r border-gray-300 text-left text-gray-900">Total Deposits</td>
                    <td className="px-4 py-2.5 border-r border-gray-300 text-gray-900"></td>
                    <td className="px-4 py-2.5 border-r border-gray-300 text-gray-900">1.50</td>
                    <td className="px-4 py-2.5 border-r border-gray-300 text-gray-900">0.75</td>
                    <td className="px-4 py-2.5 text-gray-900">33.65</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 11: Monthly Net Sales Amount Chart */}
          <div id="section-11" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">11 Monthly Net Sales Amount Chart</h3>
              <div className="w-[18px] h-[18px] bg-gray-100 rounded-sm flex items-center justify-center text-gray-400">...</div>
            </div>

            <div className="bg-white p-6 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#374151' }}
                    dy={10}
                  />
                  <YAxis
                    domain={[40, 100]}
                    ticks={[40, 50, 60, 70, 80, 90, 100]}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 10, fill: '#374151' }}
                  />
                  <Bar dataKey="value" fill="#7fc5b8" barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 12: Peer Reporting */}
          <div id="section-12" className="border border-gray-200 rounded-sm overflow-hidden mt-8 shadow-sm">
            <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
              <h3 className="text-[13px] font-medium text-gray-700">12 Peer Reporting</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="px-4 py-2 border-r border-gray-200 w-[20%]"></th>
                    <th className="px-4 py-2 border-r border-gray-200 text-center font-medium text-gray-600 w-[40%]">Your Net Sales Amounts % Increase / Decrease</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-600 w-[40%]">National Net Sales Amounts % Increase / Decrease</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-[#f8fafc] border-b border-gray-100">
                    <td className="px-4 py-2.5 text-left text-gray-800 border-r border-gray-100 font-medium">Last Month</td>
                    <td className="px-4 py-2.5 border-r border-gray-100 text-gray-800">15.22%</td>
                    <td className="px-4 py-2.5 text-gray-800">-4.78%</td>
                  </tr>
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-4 py-2.5 text-left text-gray-800 border-r border-gray-100 font-medium">* Last Year</td>
                    <td className="px-4 py-2.5 border-r border-gray-100 text-gray-800">100.00%</td>
                    <td className="px-4 py-2.5 text-gray-800">8.43%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-white px-4 py-3 text-[10px] text-gray-600 space-y-0.5">
              <p>* Same month last year.</p>
              <p>** National Net Sales Amounts are based upon aggregate credit and Interac card transaction volume data compiled by Moneris for VEHICLE.</p>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-10 mb-8 text-[11px] text-gray-800 space-y-1.5 leading-relaxed">
            <p>If you have any questions about your statement, please visit <a href="#" className="underline font-medium">www.moneris.com/en/support/contact/</a> to contact our support team.</p>
            <p>For additional information on Interchange Fees, Wholesale Discount Fees & levels for all respective payment brands, please visit <a href="#" className="underline font-medium">www.moneris.com/rates</a>.</p>
            <p>Tax Registration Numbers</p>
            <p>GST/HST: 87730 4527 RT0001, QST: 108659 1746 TQ0001, PST British Columbia: 1004 4077, PST Manitoba: 87730 4527 MT0002, PST Saskatchewan: 1879550</p>
            <p>In the event of an error, please contact us in writing within 30 days from the date of your statement.</p>
            <p>When describing the error, always quote your merchant number and the date that the transaction appears on your statement.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
