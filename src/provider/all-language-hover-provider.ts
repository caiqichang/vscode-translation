import vscode from "vscode"
import * as api from "../api/index"
import * as common from "../util/common"
import * as history from "../component/history"

const language = "*"

const provider: vscode.HoverProvider = {
    async provideHover(document, position, token) {
        if (common.getUserConfig<boolean>(common.ConfigKey.translateHoverWord)) {
            let text = document.getText(document.getWordRangeAtPosition(position))

            if (text.indexOf("\n") < 0) {
                let item: api.TranslateItem = {
                    q: text,
                    sl: common.getUserConfig<string>(common.ConfigKey.sourceLanguage) ?? "",
                    tl: common.getUserConfig<string>(common.ConfigKey.targetLanguage) ?? "",
                    results: [],
                }

                let translate = ""
                await api.translate(item).then(result => {
                    history.writeHistory(result.item)

                    translate = (item.results?.map(i => `🔹${i}`) ?? []).join("")
                })

                let content = new vscode.MarkdownString(`[${text}](${vscode.Uri.parse(`command:translation?["${Buffer.from(text).toString("base64")}"]`)}): ${translate}`)
                content.isTrusted = true

                return new vscode.Hover(content)
            }
        }

        return null


    },
}

export {
    language,
    provider,
}