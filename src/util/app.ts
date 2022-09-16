import vscode from "vscode"

class App {
    private constructor() {}

    private static app: App = new App()

    private context: vscode.ExtensionContext | null = null

    public static instance(): App {
        return this.app
    }

    public setContext(context: vscode.ExtensionContext) {
        this.context = context
    }

    public getContext(): vscode.ExtensionContext | null {
        return this.context
    }
}

export {
    App
}