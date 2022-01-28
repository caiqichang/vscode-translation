const vscode = require('vscode');
const path = require('path');

/**
 * Render webview resource
 * @param context context of plugin
 * @param panel webview panel
 * @param content webview html content
 * @param array [{src: src-uri-text-in-html, path: true-uri-path}]
 * @returns renderered content
 */
const renderReources = (context, panel, content, array) => {
    let result = '' + content;
    [...[
        {
            src: 'vscode-webview-ui-toolkit',
            path: 'node_modules/@vscode/webview-ui-toolkit/dist/toolkit.min.js',
        },
        {
            src: 'vscode-codicons',
            path: 'node_modules/@vscode/codicons/dist/codicon.css',
        },
        {
            src: 'css/common.css',
            path: 'src/webview/css/common.css',
        },
        {
            src: 'js/vue@next.js',
            path: 'src/webview/js/vue@next.min.js',
        },
    ], ...array].forEach(i => {
        let truePath = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, i.path)));
        result = result.replace(i.src, truePath.toString());
    });
    return result;
}

module.exports = {
    renderReources,
};