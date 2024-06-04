import vscode from "vscode"
import * as api from "../api/index"
import * as common from "../util/common"
import * as history from "../component/history"

const language = "*"

const provider: vscode.HoverProvider = {
    async provideHover(document, position, token) {
        let q = common.getEditorSelection()
        if (!q) return null

        let text = document.getText(document.getWordRangeAtPosition(position))
        if (q.indexOf(text) < 0) return null

        let base64Query = Buffer.from(q).toString("base64")
        let simpleTranslateUrl = vscode.Uri.parse(`command:simpleTranslate?["${base64Query}"]`)
        let completeTranslateUrl = vscode.Uri.parse(`command:completeTranslate?["${base64Query}"]`)

        if (common.getUserConfig<boolean>(common.ConfigKey.autoTranslateHovering)) {
            let item: api.TranslateItem = {
                q,
                sl: common.getUserConfig<string>(common.ConfigKey.sourceLanguage) ?? "",
                tl: common.getUserConfig<string>(common.ConfigKey.targetLanguage) ?? "",
                results: [],
            }

            let translate = ""
            await api.translate(item).then(result => {
                history.writeHistory(result.item)

                translate = (item.results?.map(i => `<br>🔹${i}`) ?? []).join("")
            })

            let content = new vscode.MarkdownString(`[Complete Translation](${completeTranslateUrl})${translate}`)
            content.isTrusted = true
            content.supportHtml = true

            return new vscode.Hover(content)
        } else {
            let content = new vscode.MarkdownString(`Translation: [Simple](${simpleTranslateUrl}) | [Complete](${completeTranslateUrl})`)
            content.isTrusted = true

            return new vscode.Hover(content)
        }
    },
}

export {
    language,
    provider,
}