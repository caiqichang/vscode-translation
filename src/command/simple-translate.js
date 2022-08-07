const vscode = require('vscode');
const googleTranslateUtils = require('../utils/google-translation-utils.js');

const handler = context => {
    let selection = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection);
    let config = vscode.workspace.getConfiguration('translation');
    googleTranslateUtils.getTranslate({
        sl: config.get('source-language'),
        tl: config.get('target-language'),
        q: selection,
    }).then(data => {
        let results = ['🔹' + data.sentences.filter(i => i.trans).map(i => i.trans).join("")];
        if (data.alternative_translations && data.alternative_translations.length > 0) {
            if (data.alternative_translations.length === 1) {
                data.alternative_translations[0].alternative.forEach(j => results.push(j.word_postproc))
            }
        }
        switch(config.get('simple-display-mode')) {
            case 'modal': {
                vscode.window.showInformationMessage(selection, {
                    modal: true,
                    detail: results.join('\n🔹'),
                });
                break;
            }
            case 'statusBar': {
                vscode.window.setStatusBarMessage(results.join('🔹'));
                break;
            }
            default: {
                vscode.window.showInformationMessage(results.join('🔹'));
            }
        }
    }).catch(error => {
        console.log(error);
        vscode.window.showErrorMessage(error.toString());
    });
};

module.exports = {
    handler,
};