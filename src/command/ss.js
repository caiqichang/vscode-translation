const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const webviewUtils = require('../utils/webview-utils.js');
const httpProxy = require('../utils/http-proxy.js');

let panel = null;

const handler = context => {
    if (panel) {
        if (!panel.visible) panel.reveal();
    } else {
        fs.readFile(`${context.extensionPath}/src/webview/ss.html`, (error, content) => {
            if (error) {
                console.log(error);
                vscode.window.showErrorMessage(error.message);
                return;
            }

            panel = vscode.window.createWebviewPanel('ss', 'SS',
                vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active,
                {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath))],
                    enableFindWidget: true,
                }
            );
            panel.webview.html = webviewUtils.renderReources(context, panel, content.toString(), []);
            panel.onDidDispose(() => panel = null);

            panel.webview.onDidReceiveMessage(message => {
                switch (message.operation) {
                    case 'query': {
                        let config = vscode.workspace.getConfiguration('translation');
                        let urls = config.get('ss')

                        let promises = [];
                        urls?.filter(i => i.active).forEach(i => {
                            promises.push(new Promise((resolve, reject) => {
                                httpProxy.doGet(i.url, i.proxy)
                                    .then(data => {
                                        resolve(i.base64 ? Buffer.from(data.toString(), 'base64').toString() : data.toString());
                                    })
                                    .catch(error => reject(error));
                            }));
                        });

                        let result = [];
                        Promise.allSettled(promises).then(results => {
                            // log fail
                            results.filter(r => r.status === 'rejected').map(r => r.reason).forEach(error => vscode.window.showErrorMessage(error.message));

                            let allData = results.filter(r => r.status === 'fulfilled').map(r => r.value);
                            allData.forEach(data => {
                                let arr = data.match(/(?:^|\n)ss:\/\/.+/g);
                                // distinct
                                arr = [...new Set(arr)];
                                arr.forEach(i => {
                                    let t = i.trim();
                                    result.push({
                                        checked: false,
                                        origin: t,
                                        decode: decodeURIComponent(t),
                                    });
                                });
                            });

                            panel?.webview.postMessage({
                                operation: 'result',
                                parameter: {
                                    list: result,
                                },
                            });
                        }).catch(error => {
                            console.log(error);
                            vscode.window.showErrorMessage(error.message)
                        });

                        break;
                    }
                }
            });

            panel.webview.postMessage({
                operation: 'init',
            });
        });
    }
};

module.exports = {
    handler,
};