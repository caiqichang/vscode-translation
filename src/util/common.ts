import vscode from "vscode"
import * as fileUtil from "../util/file-util"

const getEditorSelection = (): string => {
    return vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection) ?? ""
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
    return fileUtil.readExtensionJsonFile("package.json")
}

const configTitle = "translation"

const getUserConfig = <T> (key: ConfigKey): T | null => {
    let packageConfig = readPackageJson()?.contributes?.configuration?.properties ?? {}
    let config = vscode.workspace.getConfiguration(configTitle)
    return config.get<T>(key) ?? packageConfig?.[`${configTitle}.${key}`]?.default ?? null
}

export {
    getEditorSelection,
    ConfigKey,
    getUserConfig,
    readPackageJson,
}