const https = require('https');

const req = https.get('https://api.paynex.world/v1/merchant/transaction?skip=0&take=50&orderBy=createdAt%7Cdesc&include=merchant&include=product&search_column=transactionId&gatewayEnv=Live', {
  headers: {
    "Accept": "application/json, text/plain, */*",
    "Authorization": `Bearer ${process.env.PAYNEX_TOKEN || 'test'}`,
    "paynex-mode": "Test"
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.list) {
        console.log("Dates:", json.list.map(t => t.createdAt));
      } else {
        console.log("Response:", json);
      }
    } catch (e) {
      console.log("Error:", e.message);
    }
  });
});
req.on('error', console.error);
