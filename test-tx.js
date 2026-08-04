const fs = require('fs');
fetch('https://api.paynex.world/v1/merchant/transaction?take=50&include=merchant&include=product', {
  headers: {
    "Accept": "application/json, text/plain, */*",
    "Authorization": `Bearer ${fs.readFileSync('/Users/gulnazghanchi/Documents/NextJS/paynex-customer-app/token.txt', 'utf8').trim() || ''}`,
    "paynex-mode": "Test"
  }
}).then(r => r.json()).then(data => {
  if (data && data.list) {
    const cardTypes = data.list.map(t => t.cardType);
    console.log("Card types:", [...new Set(cardTypes)]);
  }
}).catch(e => console.error(e));
