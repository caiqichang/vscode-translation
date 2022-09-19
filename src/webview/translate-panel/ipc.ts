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
                    this.sendMessage({
                        operation: Operation.RemoveHistory,
                        parameter: history.removeHistory(message.parameter as api.TranslateItem),
                    })
                    break;
                }
                case Operation.ClearHistory: {
                    this.sendMessage({
                        operation: Operation.ClearHistory,
                        parameter: history.clearHistory(),
                    })
                    break;
                }
                case Operation.SaveBookmark: {
                    this.sendMessage({
                        operation: Operation.SaveBookmark,
                        parameter: bookmark.writeBookmark(message.parameter as api.TranslateItem),
                    })
                    break;
                }
                case Operation.RemoveBookmark: {
                    this.sendMessage({
                        operation: Operation.RemoveBookmark,
                        parameter: bookmark.removeBookmark(message.parameter as api.TranslateItem),
                    })
                    break;
                }
            }
        })

        this.sendMessage({
            operation: Operation.Init,
            parameter: {
                sl: common.getUserConfig<string>(common.ConfigKey.sourceLanguage) ?? "",
                tl: common.getUserConfig<string>(common.ConfigKey.targetLanguage) ?? "",
            },
        })
    }

    private sendMessage(message: Message) {
        this.panel?.webview?.postMessage(message)
    }

    public sendTranslate(q: string) {
        this.panel?.webview?.postMessage({
            operation: Operation.DoTranslate,
            parameter: q,
        })
    }
}

enum Operation {
    DoTranslate = "DoTranslate",
    GetTranslation = "GetTranslation",
    GetTTS = "GetTTS",
    Init = "Init",
    SaveHistory = "SaveHistory",
    RemoveHistory = "RemoveHistory",
    ClearHistory = "ClearHistory",
    SaveBookmark = "SaveBookmark",
    RemoveBookmark = "RemoveBookmark",
}

interface Message {
    operation: Operation,
    parameter: unknown,
}

export {
    TranslationIpc,
}