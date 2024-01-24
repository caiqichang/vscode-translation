"use strict"

const vscode = acquireVsCodeApi()

const copy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

const app = Vue.createApp({
    data() {
        return {
            windowInnerHeight: window.innerHeight,
            sourceLangList: SOURCE_LANGUAGE,
            targetLangList: TARGET_LANGUAGE,
            Operation: {
                DoTranslate: "DoTranslate",
                GetTranslation: "GetTranslation",
                GetTTS: "GetTTS",
                Init: "Init",
                SaveHistory: "SaveHistory",
                RemoveHistory: "RemoveHistory",
                ClearHistory: "ClearHistory",
                SaveBookmark: "SaveBookmark",
                RemoveBookmark: "RemoveBookmark",
                ExportHistory: "ExportHistory",
                ExportBookmark: "ExportBookmark",
                PlaySourceAudio: "PlaySourceAudio",
            },
            tabs: [
                { id: "history", name: "History" },
                { id: "bookmark", name: "Bookmark" },
                { id: "translation", name: "Translation" },
                { id: "definition", name: "Definition" },
                { id: "example", name: "Example" },
            ],
            state: {
                sl: null,
                tl: null,
                q: null,
                defaultResult: null,
                result: null,
                currentTab: "history",
                history: [],
                bookmark: [],
            },
            loading: false,
            hasInit: false,
        }
    },
    created() {
        this.getState()
        vscode.postMessage({
            operation: this.Operation.Init,
            parameter: {},
        })
    },
    watch: {
        state: {
            deep: true,
            handler() {
                this.setState()
            }
        }
    },
    methods: {
        getState() {
            let state = vscode.getState()
            if (state) {
                this.state = copy(state)
            }
        },
        setState() {
            vscode.setState(copy(this.state))
        },
        panelViewMaxHeight() {
            let otherHeight = (166 + 10) // height of query
                + (1 + 4 * 2) // height of divider
                + (28 + 4 * 2) // height of panel-tab
                + (10 * 2) // top and bottom padding of panel-view
                + 1 // tolerance
            return `${this.windowInnerHeight - otherHeight}px`
        },
        doSwap() {
            if (this.state.sl !== "auto") {
                let sl = this.state.sl
                this.state.sl = this.state.tl
                this.state.tl = sl
                if (this.state.defaultResult) {
                    this.state.q = this.state.defaultResult
                    this.getTranslate()
                }
            }
        },
        toTranslate(q, sl, tl) {
            this.state.sl = sl
            this.state.tl = tl
            this.state.q = q
            this.getTranslate()
        },
        getTranslate() {
            if (this.state.q) {
                this.loading = true
                this.state.currentTab = "translation"
                vscode.postMessage({
                    operation: this.Operation.GetTranslation,
                    parameter: {
                        sl: this.state.sl,
                        tl: this.state.tl,
                        q: this.state.q,
                    },
                })
            }
        },
        getTTS(type) {
            if (this.state.result) {
                let parameter = {}
                switch (type) {
                    case "sl": {
                        parameter = {
                            tl: this.state.result?.sourceLanguage,
                            q: this.state.result?.item.q,
                        }
                        break;
                    }
                    case "tl": {
                        parameter = {
                            tl: this.state.result?.item.tl,
                            q: this.state.result?.defaultResult,
                        }
                        break;
                    }
                }
                vscode.postMessage({
                    operation: this.Operation.GetTTS,
                    parameter,
                })
            }
        },
        getSourceLang() {
            let key = this.state.result?.sourceLanguage
            if (key) {
                let lang = this.sourceLangList.filter(i => i.key === key)
                if (lang.length > 0) return `(${lang[0].label})`
            }
            return ""
        },
        renderExample(text) {
            return text.replaceAll("<b>", "<code>").replaceAll("</b>", "</code>")
        },
        saveHistory() {
            if (this.state.result) {
                vscode.postMessage({
                    operation: this.Operation.SaveHistory,
                    parameter: copy(this.state.result.item),
                })
            }
        },
        clearHistory() {
            vscode.postMessage({
                operation: this.Operation.ClearHistory,
                parameter: [],
            })
        },
        removeHistory(item) {
            vscode.postMessage({
                operation: this.Operation.RemoveHistory,
                parameter: copy(item),
            })
        },
        exportHistory() {
            vscode.postMessage({
                operation: this.Operation.ExportHistory,
                parameter: [],
            })
        },
        saveBookmark() {
            if (this.state.result) {
                vscode.postMessage({
                    operation: this.Operation.SaveBookmark,
                    parameter: copy(this.state.result.item),
                })
            }
        },
        removeBookmark(item) {
            vscode.postMessage({
                operation: this.Operation.RemoveBookmark,
                parameter: copy(item),
            })
        },
        exportBookmark() {
            vscode.postMessage({
                operation: this.Operation.ExportBookmark,
                parameter: [],
            })
        },
        inBookmark() {
            for (let i = 0; i < this.state.bookmark.length; i++) {
                let item = this.state.bookmark[i]
                if (this.state.q === item.q && this.state.sl === item.sl && this.state.tl === item.tl) return true
            }
            return false
        },
        receiveMessage(data) {
            switch (data.operation) {
                case this.Operation.Init: {
                    this.state.sl = data.parameter.sl
                    this.state.tl = data.parameter.tl
                    break;
                }
                case this.Operation.GetTranslation: {
                    this.loading = false
                    this.state.result = copy(data.parameter)
                    this.state.defaultResult = data.parameter.defaultResult
                    if (data.parameter.sourceLanguage) {
                        this.state.sl = data.parameter.sourceLanguage
                    }
                    this.saveHistory()
                    break;
                }
                case this.Operation.DoTranslate: {
                    this.state.q = data.parameter.q
                    this.getTranslate()
                    break;
                }
                case this.Operation.GetTTS: {
                    new Audio(data.parameter.url).play()
                    break;
                }
                case this.Operation.RemoveHistory:
                case this.Operation.ClearHistory:
                case this.Operation.SaveHistory: {
                    this.state.history = data.parameter
                    break;
                }
                case this.Operation.RemoveBookmark:
                case this.Operation.SaveBookmark: {
                    this.state.bookmark = data.parameter
                    break;
                }
            }
        },
    },
})

app.config.compilerOptions.isCustomElement = tag => tag.startsWith("vscode-")

const appInstance = app.mount("#app")

window.addEventListener("message", event => {
    appInstance.receiveMessage(event.data)
})

window.addEventListener("resize", event => {
    appInstance.windowInnerHeight = window.innerHeight
})