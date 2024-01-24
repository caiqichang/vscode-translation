import vscode from "vscode"
import * as history from "../../component/history"
import * as bookmark from "../../component/bookmark"
import * as api from "../../api/index"
import * as common from "../../util/common"
import * as fileUtil from "../../util/file-util"

class TranslationIpc {
    private constructor() {

    }

    private static _instance = new TranslationIpc()

    public static instance(): TranslationIpc {
        return this._instance
    }

    private panel: vscode.WebviewPanel | null = null

    private query: string | null = null

    public setQuery(query: string) {
        this.query = query
    }

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
                case Operation.Init: {
                    this.sendMessage({
                        operation: Operation.SaveHistory,
                        parameter: history.readHistory(),
                    })
                    this.sendMessage({
                        operation: Operation.SaveBookmark,
                        parameter: bookmark.readBookmark(),
                    })
                    if (this.query) {
                        this.sendTranslate(this.query)
                        this.query = null
                    }
                    break;
                }
                case Operation.GetTTS: {
                    api.tts(message.parameter as api.TranslateItem).then(data => {
                        let file = "/temp/tts.mp3"
                        fileUtil.writeExtensionFile(file, data)
                        if (this.panel) {
                            this.sendMessage({
                                operation: Operation.GetTTS,
                                parameter: {
                                    url: `${common.createWebviewUri(this.panel, file)}?v=${Math.random()}`,
                                },
                            })
                        }
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
                case Operation.ExportHistory: {
                    history.exportHistory()
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
                case Operation.ExportBookmark: {
                    bookmark.exportBookmark()
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
            parameter: {
                q,
            },
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
    ExportHistory = "ExportHistory",
    ExportBookmark = "ExportBookmark",
}

interface Message {
    operation: Operation,
    parameter: unknown,
}

export {
    TranslationIpc,
}