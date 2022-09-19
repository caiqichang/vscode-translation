import vscode from "vscode"
import * as simpleTranslate from "./command/simple-translate"
import * as completeTranslate from "./command/complete-translate"
import { App } from "./util/app"
import * as command from "./command/index"

const activate = (context: vscode.ExtensionContext) => {
    App.instance().setContext(context);

    [
        {
            command: command.CommandName.translation,
            handler: completeTranslate.action
        },
        {
            command: command.CommandName.simpleTranslate,
            handler: simpleTranslate.action
        },
        {
            command: command.CommandName.completeTranslate,
            handler: completeTranslate.action
        },
    ].forEach(i => {
        vscode.commands.registerCommand(i.command, () => i.handler(i.command))
    })
}

export {
    activate,
}