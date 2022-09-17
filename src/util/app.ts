import vscode from "vscode"
import * as history from "../component/history"
import * as bookmark from "../component/bookmark"

class App {
    private constructor() { }

    private static app: App = new App()

    private context: vscode.ExtensionContext | null = null

    public static instance(): App {
        return this.app
    }

    public setContext(context: vscode.ExtensionContext) {
        this.context = context
        context.globalState.setKeysForSync([
            history.key,
            bookmark.key,
        ])
    }

    public getContext(): vscode.ExtensionContext | null {
        return this.context
    }
}

export {
    App
}