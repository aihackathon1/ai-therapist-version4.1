const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');

(async () => {
  const port = Number(process.env.PORT || 3000);
  const tunnel = await localtunnel({ port });
  const url = tunnel.url;
  const outPath = path.join(__dirname, 'tunnel.txt');
  try {
    fs.writeFileSync(outPath, url, 'utf8');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to write tunnel URL:', err);
  }
  // eslint-disable-next-line no-console
  console.log('Public URL:', url);
})();


