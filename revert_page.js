const fs = require('fs');
const path = './app/dashboard/transactions/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove hasSearched state
code = code.replace(
  'const [isLoading, setIsLoading] = useState(true);\n  const [hasSearched, setHasSearched] = useState(false);\n  const [searchTab, setSearchTab] = useState("Account and Date");\n  const [isTxDetailsOpen, setIsTxDetailsOpen] = useState(true);',
  'const [isLoading, setIsLoading] = useState(true);'
);

// 2. Remove extra lucide imports
code = code.replace(
  'MoreHorizontal, Eye, CreditCard, ChevronUp, Check } from "lucide-react";',
  'MoreHorizontal, Eye, CreditCard } from "lucide-react";'
);

// 3. Revert the main return statement
// Find where the new return statement starts
const searchFormIndex = code.indexOf('  const renderSearchForm = () => {');
const endOfSearchFormIndex = code.indexOf('  return (\n    <div className="w-full space-y-6 pt-2">\n      <div className="flex items-center mb-2">\n        <button onClick={() => setHasSearched(false)} className="text-blue-600 hover:underline text-[13px] font-medium flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Back to Search</button>\n      </div>');

if (searchFormIndex !== -1 && endOfSearchFormIndex !== -1) {
    const beforeSearchForm = code.substring(0, searchFormIndex);
    const originalReturn = '  return (\n    <div className="w-full space-y-6 pt-2">';
    const afterSearchForm = code.substring(endOfSearchFormIndex + '  return (\n    <div className="w-full space-y-6 pt-2">\n      <div className="flex items-center mb-2">\n        <button onClick={() => setHasSearched(false)} className="text-blue-600 hover:underline text-[13px] font-medium flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Back to Search</button>\n      </div>'.length);
    code = beforeSearchForm + originalReturn + afterSearchForm;
} else {
    console.error("Could not find the injected code block");
    process.exit(1);
}

fs.writeFileSync(path, code);
console.log("File reverted successfully.");
