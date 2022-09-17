import vscode from "vscode"
import * as simpleTranslate from "./command/simple-translate"
import * as completeTranslate from "./command/complete-translate"
import { App } from "./util/app"

const activate = (context: vscode.ExtensionContext) => {
    App.instance().setContext(context);

    [
        {
            command: "translation",
            handler: completeTranslate.action
        },
        {
            command: "simpleTranslate",
            handler: simpleTranslate.action
        },
        {
            command: "completeTranslate",
            handler: completeTranslate.action
        },
    ].forEach(i => {
        vscode.commands.registerCommand(i.command, () => i.handler(i.command))
    })
}

export {
    activate,
}