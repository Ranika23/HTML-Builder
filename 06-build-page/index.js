const fs = require('fs');
const path = require('path');

const pathComponents = path.join(__dirname, 'components');

//creat folder project-dist and assets
(function creatFolderProjectDist() {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.mkdir(
    path.join(__dirname, 'project-dist', 'assets'),
    { recursive: true },
    (err) => {
      if (err) throw err;
    },
  );
})();

// creat file style.css
(function creatFileStyleCss() {
  const pathFileStyles = path.join(__dirname, 'styles');

  const writeNewFile = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
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
})();

// read template in variable
const pathTemplate = path.join(__dirname, 'template.html');
(async function creatVariable() {
  const duplContentTempl = await fs.promises.readFile(pathTemplate);
  creatArrTemplTag(duplContentTempl);
})();

// creat array template tags
let arrTempl = []; // array template tags
function creatArrTemplTag(data) {
  let start;
  let end;

  for (let i = 0; i < data.toString().length; i += 1) {
    if (data.toString()[i] + data.toString()[i + 1] === '{{') {
      start = i;
    }
    if (data.toString()[i] + data.toString()[i - 1] === '}}') {
      end = i + 1;
    }
    if (
      start !== undefined &&
      end !== undefined &&
      end > start &&
      arrTempl.indexOf(data.toString().slice(start, end)) === -1
    ) {
      arrTempl.push(data.toString().slice(start, end));
    }
  }
  const duplContentTempl = data.toString();
  replTemplTagWithComponent(duplContentTempl, arrTempl);
}

//replace template tags with content of component
function replTemplTagWithComponent(duplContentTempl, arrTempl) {
  for (const tegTempl of arrTempl) {
    fs.readdir(pathComponents, (err, files) => {
      if (err) throw err;
      for (let file of files) {
        //filename for fill template tags
        const nameFile = path.basename(file, path.extname(file));

        if (tegTempl === `{{${nameFile}}}`) {
          const pathFile = path.join(pathComponents, file);
          const readFiles = fs.createReadStream(pathFile);
          (async function readFileCompon() {
            await readFiles.on('data', (data) => {
              duplContentTempl = duplContentTempl.replace(tegTempl, data);

              creatFileIndexHtml(duplContentTempl); // new index.html
            });
          })();
        }
      }
    });
  }
}

// creat file index.html
async function creatFileIndexHtml(duplContentTempl) {
  await fs.promises.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    duplContentTempl,
    (err) => {
      if (err) throw err;
    },
  );
}

// copy folder assets
copyFolderAssets();
async function copyFolderAssets() {
  const oldFolder = path.join(__dirname, 'assets');
  const newFolder = path.join(__dirname, 'project-dist', 'assets');
  const arrOldFolder = await fs.promises.readdir(oldFolder);
  const arrNewFolder = await fs.promises.readdir(newFolder);

  await fs.promises.mkdir(newFolder, { recursive: true }, (err) => {
    if (err) throw err;
  });

  // remove
  fs.readdir(newFolder, (err, files) => {
    if (err) throw err;

    (function removeFilesfromaAss() {
      for (const folder of files) {
        const pathNewFolderInAss = path.join(newFolder, folder);
        const pathOldFolderInAss = path.join(oldFolder, folder);

        if (arrOldFolder.indexOf(path.basename(pathNewFolderInAss)) === -1) {
          fs.rm(pathNewFolderInAss, { recursive: true }, (err) => {
            if (err) throw err;
          });
        }

        if (arrOldFolder.length === arrNewFolder.length) {
          let arrOld;
          (async function arrOldFiles() {
            arrOld = await fs.promises.readdir(pathOldFolderInAss);
          })();

          fs.readdir(pathNewFolderInAss, (err, files) => {
            if (err) throw err;

            for (const file of files) {
              if (arrOld.indexOf(file) === -1) {
                const pathFileDelete = path.join(pathNewFolderInAss, file);
                fs.rm(pathFileDelete, { recursive: true }, (err) => {
                  if (err) throw err;
                });
              }
            }
          });
        }
      }
    })();
  });

  // copy
  fs.readdir(oldFolder, (err, files) => {
    if (err) throw err;

    (function copyFilesfromaAss() {
      for (const file of files) {
        const pathNewFolderInAss = path.join(newFolder, file);
        const pathOldFolderInAss = path.join(oldFolder, file);

        (async function copy() {
          await fs.promises.mkdir(
            pathNewFolderInAss,
            { recursive: true },
            (err) => {
              if (err) throw err;
            },
          );
          fs.readdir(pathOldFolderInAss, (err, files) => {
            if (err) throw err;
            for (const file of files) {
              const pathOldFiles = path.join(pathOldFolderInAss, file);
              const pathNewFiles = path.join(pathNewFolderInAss, file);

              fs.copyFile(pathOldFiles, pathNewFiles, (err) => {
                if (err) throw err;
              });
            }
          });
        })();
      }
    })();
  });
}
