import vscode from "vscode"

export const activate = (context: vscode.ExtensionContext) => {
    [
        {
            command: "translation",
            handler: () => {
                let i = 0
                console.log(123454)
            }
        },
        {
            command: "simpleTranslate",
            handler: () => { }
        },
        {
            command: "completeTranslate",
            handler: () => { }
        },
    ].forEach(i => {
        vscode.commands.registerCommand(i.command, () => i.handler())
    })
}