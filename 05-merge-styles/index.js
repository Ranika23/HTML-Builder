const fs = require('fs');
const path = require('path');

const pathFileStyles = path.join(__dirname, 'styles');

const writeNewFile = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(pathFileStyles, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    const extNameFile = path.extname(path.join(pathFileStyles, file));
    const pathFile = path.join(pathFileStyles, file);
    if (extNameFile === '.css') {
      const readFile = fs.createReadStream(pathFile);
      readFile.on('data', (data) => {
        writeNewFile.write(data.toString());
      });
    }
  }
});
