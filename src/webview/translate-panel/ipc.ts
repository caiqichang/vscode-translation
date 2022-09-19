import vscode from "vscode"
import * as history from "../../component/history"
import * as bookmark from "../../component/bookmark"
import * as api from "../../api/index"
import * as common from "../../util/common"

class TranslationIpc {
    private constructor() {

    }

    private static _instance = new TranslationIpc()

    public static instance(): TranslationIpc {
        return this._instance
    }

    private panel: vscode.WebviewPanel | null = null

    public setWebview(panel: vscode.WebviewPanel) {
        this.panel = panel
        this.panel.webview.onDidReceiveMessage((message: Message) => {
            switch (message.operation) {
                case Operation.GetTranslation: {
                    api.translate(message.parameter as api.TranslateItem).then(result => {
                        this.sendMessage({
                            operation: Operation.GetTranslation,
                            parameter: result,
                        })
                    })
                    break;
                }
                case Operation.GetTTS: {
                    api.tts(message.parameter as api.TranslateItem).then(() => {
                        this.sendMessage({
                            operation: Operation.GetTTS,
                            parameter: null,
                        })
                    })
                    break;
                }
                case Operation.SaveHistory: {
                    this.sendMessage({
                        operation: Operation.SaveHistory,
                        parameter: history.writeHistory(message.parameter as api.TranslateItem),
                    })
                    break;
                }
                case Operation.RemoveHistory: {
                    // todo
                    break;
                }
                case Operation.ClearHistory: {
                    this.sendMessage({
                        operation: Operation.ClearHistory,
                        parameter: history.clearHistory(),
                    })
                    break;
                }
                case Operation.SaveBookMark: {
                    this.sendMessage({
                        operation: Operation.SaveBookMark,
                        parameter: bookmark.writeBookmark(message.parameter as api.TranslateItem),
                    })
                    break;
                }
                case Operation.RemoveBookMark: {
                    this.sendMessage({
                        operation: Operation.RemoveBookMark,
                        parameter: bookmark.removeBookmark(message.parameter as api.TranslateItem),
                    })
                    break;
                }
            }
        })

        this.sendMessage({
            operation: Operation.Init,
            parameter: null  // todo
        })
    }

    private sendMessage(message: Message) {
        this.panel?.webview?.postMessage(message)
    }

}

enum Operation {
    GetTranslation = "GetTranslation",
    GetTTS = "GetTTS",
    Init = "Init",
    SaveHistory = "SaveHistory",
    RemoveHistory = "RemoveHistory",
    ClearHistory = "ClearHistory",
    SaveBookMark = "SaveBookMark",
    RemoveBookMark = "RemoveBookMark",
}

interface Message {
    operation: Operation,
    parameter: unknown,
}

export {
    TranslationIpc,
}