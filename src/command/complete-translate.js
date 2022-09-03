const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const webviewUtils = require('../utils/webview-utils.js');
const googleTranslateUtils = require('../utils/google-translation-utils.js');

let panel = null;

let queryText = null;
let isFirst = true;

const handler = (context, param) => {

    let dataFolder = `${context.extensionPath}/data`;

    const writeFile = (file, content) => {
        fs.mkdirSync(dataFolder, {
            recursive: true,
            mode: 0o777,
        });
        fs.writeFileSync(file, content, {
            mode: 0o777,
        });
    }
    
    const readFile = (file) => {
        try {
            return JSON.parse(fs.readFileSync(file))
        }catch(e) {
            return null 
        }
        
    }

    let selection = null;
    if (!param.fromCommand) {
        selection = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor.selection);
    }
    queryText = selection;

    if (panel) {
        if (!panel.visible) {
            panel.reveal();
        }else {
            panel.webview.postMessage({
                operation: 'query',
                parameter: {
                    q: selection,
                },
            });
            queryText = null;
        }
    } else {
        isFirst = true;
        let config = vscode.workspace.getConfiguration('translation');
        fs.readFile(`${context.extensionPath}/src/webview/translation.html`, (error, content) => {
            if (error) {
                console.log(error);
                vscode.window.showErrorMessage(error.message);
                return;
            }

            panel = vscode.window.createWebviewPanel('translationPanel', 'Translation',
                vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active,
                {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath))],
                    enableFindWidget: true,
                }
            );
            panel.onDidDispose(() => panel = null);

            panel.webview.html = webviewUtils.renderReources(context, panel, content.toString(), [
                {
                    src: 'js/language.js',
                    path: 'src/webview/js/language.js',
                },
                {
                    src: "tts.mp3",
                    path: "data/tts.mp3",
                },
            ]);
            panel.webview.onDidReceiveMessage(message => {
                switch (message.operation) {
                    case 'getTranslate': {
                        googleTranslateUtils.getTranslate(message.parameter).then(data => {
                            panel?.webview.postMessage({
                                operation: 'receiveTranslation',
                                parameter: data,
                            });
                        }).catch(error => {
                            console.log(error);
                            vscode.window.showErrorMessage(error.toString());
                        });
                        break;
                    }
                    case 'getTts': {
                        googleTranslateUtils.getTts(message.parameter).then(data => {
                            let file = `${dataFolder}/tts.mp3`
                            writeFile(file, data)
                            panel?.webview.postMessage({
                                operation: 'playTts',
                            });
                        });
                        break;
                    }
                    case 'getQueryText': {
                        if (isFirst) {
                            panel.webview.postMessage({
                                operation: 'init',
                                parameter: {
                                    sl: config.get('source-language'),
                                    tl: config.get('target-language'),
                                    maxHistory: config.get("history-max"),
                                    history: readFile(`${dataFolder}/history.json`) || {history: []},
                                    favorite: readFile(`${dataFolder}/favorite.json`) || {favorite: []},
                                    q: selection,
                                },
                            });
                            isFirst = false;
                        }else {
                            panel?.webview.postMessage({
                                operation: 'query',
                                parameter: {
                                    q: queryText,
                                },
                            });
                            queryText = null;
                        }
                        break;
                    }
                    case "saveHistory": {
                        writeFile(`${dataFolder}/history.json`, JSON.stringify(message.parameter))
                        break
                    }
                    case "saveFavorite": {
                        writeFile(`${dataFolder}/favorite.json`, JSON.stringify(message.parameter))
                        break
                    }
                }
            });

        });
    }
};


module.exports = {
    handler,
};