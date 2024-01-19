const fs = require('fs');
const path = require('path');
const oldFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');
(function copyDir() {
  fs.mkdir(newFolder, { recursive: true }, (err) => {
    if (err) throw err;
    //clean files-copy
    fs.readdir(newFolder, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        const pathNewFiles = path.join(newFolder, file);
        fs.unlink(pathNewFiles, (err) => {
          if (err) throw err;
        });
      }
    });
    //copy files for files-copy
    fs.readdir(oldFolder, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        const pathOldFiles = path.join(oldFolder, file);
        const pathNewFiles = path.join(newFolder, file);
        fs.copyFile(pathOldFiles, pathNewFiles, (err) => {
          if (err) throw err;
        });
      }
    });
  });
})();
