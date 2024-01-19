const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdout } = require('process');
const rl = readline.createInterface(process.stdin, process.stdout);
const output = fs.createWriteStream(path.join(__dirname, '02-write-file.txt'));
rl.on('SIGINT', () => {
  sendMessageBye();
});
rl.setPrompt('Hello! Please, enter the text\n');
rl.prompt();
rl.on('line', (answer) => {
  if (answer === 'exit') {
    sendMessageBye();
  } else {
    output.write(`${answer}\n`);
  }
});
function sendMessageBye() {
  stdout.write('It worked! Goodbye!\n');
  rl.close();
}
