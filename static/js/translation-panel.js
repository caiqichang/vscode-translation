"use strict"

const vscode = acquireVsCodeApi()

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
            },
            loading: false,
        }
    },
    created() {
        let state = vscode.getState()
        if (state) this.state = JSON.parse(JSON.stringify(state))
        vscode.postMessage({
            operation: this.Operation.Init,
        })
    },
    watch: {
        state: {
            deep: true,
            handler(newValue) {
                this.setState(JSON.parse(JSON.stringify(newValue)))
            },
        },
    },
    methods: {
        setState() {
            vscode.setState(JSON.parse(JSON.stringify(this.state)))
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
        receiveMessage(data) {
            switch (data.operation) {
                case this.Operation.Init: {
                    this.state.sl = data.parameter.sl
                    this.state.tl = data.parameter.tl
                    break;
                }
                case this.Operation.GetTranslation: {
                    console.log(data.parameter)
                    this.loading = false
                    this.state.result = JSON.parse(JSON.stringify(data.parameter))
                    this.state.defaultResult = data.parameter.defaultResult
                    this.state.currentTab = "translation"
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