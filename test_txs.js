const fs = require('fs');
fetch('https://api.paynex.world/v1/merchant/transaction?skip=0&take=5&orderBy=createdAt%7Cdesc&gatewayEnv=Live', {
  headers: {
    "Accept": "application/json",
    "paynex-mode": "Test"
  }
}).then(r => r.json()).then(data => {
  console.log(JSON.stringify(data.list.map(t => t.createdAt), null, 2));
});
