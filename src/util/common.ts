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
}