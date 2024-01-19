const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');
fs.readdir(folder, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    const pathFile = path.join(folder, file);

    fs.stat(pathFile, (err, stats) => {
      if (err) {
        console.error(err);
      } else if (stats.isFile()) {
        const nameFile = file.slice(0, file.indexOf('.'));
        const extensionFile = file.slice(file.indexOf('.') + 1);
        const sizeFile = `${String(stats.size).slice(0, -3)} ${String(
          stats.size,
        ).slice(-3)}`;
        const sayDataFile = `${nameFile} - ${extensionFile} - ${sizeFile}b`;
        console.log(sayDataFile);
      }
    });
  }
});
