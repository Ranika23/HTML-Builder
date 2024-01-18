const fs = require('fs');
const path = require('path');
const ReadText = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
ReadText.on('data', (chunk) => {
  console.log(chunk);
});
