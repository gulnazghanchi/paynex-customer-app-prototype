const fs = require('fs');
const path = '/Users/gulnazghanchi/Documents/NextJS/paynex-customer-app/app/dashboard/settings/page.tsx';

let content = fs.readFileSync(path, 'utf8');

// Strip all dark: classes
content = content.replace(/dark:[^\s"']+/g, '');

// Clean up double spaces left behind
content = content.replace(/\s{2,}/g, ' ').replace(/ \}/g, '}').replace(/ "/g, '"').replace(/" /g, '"');

// Replace specific font sizes
content = content.replace(/text-2xl/g, 'text-[22px]');
content = content.replace(/text-lg/g, 'text-[16px]');
content = content.replace(/text-sm/g, 'text-[13px]');

// Replace border radius
content = content.replace(/rounded-xl/g, 'rounded-[8px]');
content = content.replace(/rounded-lg/g, 'rounded-[8px]');

// Tabs styling adjustments to match transactions style more closely
// In transactions, there's often border-gray-200 on containers.
content = content.replace(/inline-flex bg-gray-100/g, 'inline-flex bg-white border border-gray-200 shadow-sm');
content = content.replace(/bg-white text-gray-900 shadow-sm/g, 'bg-[#102B4E] text-white shadow-sm'); // Similar to count toggle active
content = content.replace(/text-gray-500 hover:text-gray-700 hover:bg-gray-50/g, 'text-gray-500 hover:text-gray-900 hover:bg-gray-50');
content = content.replace(/text-gray-700/g, 'text-white'); // Fix active tab icon color to match dark background

fs.writeFileSync(path, content, 'utf8');
console.log("Settings page updated!");
