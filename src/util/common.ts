import vscode from "vscode"
import { App } from "../util/app"

const getEditorSelection = (): string => {
    return vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection) ?? ""
}

const showError = (content: string) => {
    vscode.window.showErrorMessage(content)
}

const showNotification = (content: string) => {
    vscode.window.showInformationMessage(content)
}

const showStatusBar = (content: string) => {
    vscode.window.setStatusBarMessage(content)
}

const showModal = (content: string) => {
    vscode.window.showInformationMessage("Translation", {
        modal: true,
        detail: content,
    })
}

enum MessageMode {
    notification = "notification",
    modal = "modal",
    statusBar = "statusBar",
}

enum ConfigKey {
    sourceLanguage = "source-language",
    targetLanguage = "target-language",
    simpleDisplayMode = "simple-display-mode",
    enableProxy = "enable-proxy",
    proxyUrl = "proxy-url",
    historyMax = "history-max",
}

const readPackageJson = (): any => {
    App.instance().getContext()?.extension?.packageJSON
}

const configTitle = "translation"

const getUserConfig = <T>(key: ConfigKey): T | null => {
    let packageConfig = readPackageJson()?.contributes?.configuration?.properties ?? {}
    let config = vscode.workspace.getConfiguration(configTitle)
    return config.get<T>(key) ?? packageConfig?.[`${configTitle}.${key}`]?.default ?? null
}

const createWebviewPanel = (id: string, title: string): vscode.WebviewPanel => {
    return vscode.window.createWebviewPanel(id, title,
        vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active,
        {
            enableScripts: true,
            enableFindWidget: true,
            localResourceRoots: [vscode.Uri.file(App.instance().getContext()?.extensionPath ?? "")],
        },
    )
}

const createWebviewUri = (webviewPanel: vscode.WebviewPanel, subpath: string): vscode.Uri => {
    return webviewPanel.webview.asWebviewUri(createUri(subpath))
}

const createUri = (subpath: string): vscode.Uri => {
    return vscode.Uri.file(`${App.instance().getContext()?.extensionPath ?? ""}${subpath}`)
}

export {
    MessageMode,
    getEditorSelection,
    ConfigKey,
    getUserConfig,
    readPackageJson,
    showError,
    showNotification,
    showStatusBar,
    showModal,
    createWebviewPanel,
    createWebviewUri,
    createUri,
}