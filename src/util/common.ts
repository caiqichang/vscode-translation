import vscode from "vscode"

export const getEditorSelection = (): String => {
    return vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection) ?? ""
}

export type MessageMode = "notification" | "modal" | "statusBar"

export interface UserConfig {
    sourceLanguage: String,
    targetLanguage: String,
    simpleDisplayMode: MessageMode,
    enableProxy: Boolean,
    proxyUrl: String,
    historyMax: Number,
}

export const getUserConfig = (): UserConfig => {
    let config = vscode.workspace.getConfiguration("translation")
    return {
        sourceLanguage: config.get<String>("source-language", "auto"),
        targetLanguage: config.get<String>("target-language", "en"),
        simpleDisplayMode: config.get<MessageMode>("target-language", "notification"),
        enableProxy: config.get<Boolean>("enable-proxy", false),
        proxyUrl: config.get<String>("proxy-url", "http://127.0.0.1:1080"),
        historyMax: config.get<Number>("history-max", 50),
    }
}