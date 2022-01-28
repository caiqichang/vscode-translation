// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const simpleTranslate = require('./src/command/simple-translate.js');
const completeTranslate = require('./src/command/complete-translate.js');
const ss = require('./src/command/ss.js');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const register = (command, handler, handlerParam) => {
        vscode.commands.registerCommand(command, () => handler(context, handlerParam));
    };

    register('simpleTranslate', simpleTranslate.handler, null);
    register('completeTranslate', completeTranslate.handler, { fromCommand: false });
    register('translation', completeTranslate.handler, { fromCommand: true });
    register('ss', ss.handler, null);
}

// this method is called when your extension is deactivated
function deactivate() {

}

module.exports = {
    activate,
    deactivate
}