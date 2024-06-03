import vscode from "vscode"
import * as simpleTranslate from "./command/simple-translate"
import * as completeTranslate from "./command/complete-translate"
import { App } from "./util/app"
import * as command from "./command/index"
import * as allLanguageHoverProvider from "./provider/all-language-hover-provider"

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
        vscode.commands.registerCommand(i.command, (args) => i.handler(i.command, args))
    })

    vscode.languages.registerHoverProvider(allLanguageHoverProvider.language, allLanguageHoverProvider.provider)
}

export {
    activate,
}