import * as translateApi from "../component/translate-api"
import * as common from "../util/common"
import * as history from "../component/history"

const action = (command: string) => {
    let item = {
        q: common.getEditorSelection(),
        sl: common.getUserConfig<string>(common.ConfigKey.sourceLanguage) ?? "",
        tl: common.getUserConfig<string>(common.ConfigKey.targetLanguage) ?? "",
    }

    translateApi.translate(item).then(result => {
        history.writeHistory(item)

        let msgArr = [
            "🔹" + (result?.sentences?.map(i => i?.trans ?? "").join("") ?? ""),
        ]

        if (result.alternative_translations && result.alternative_translations.length > 0) {
            result.alternative_translations[0]?.alternative?.forEach(i => {
                if (i.word_postproc) msgArr.push(i.word_postproc)
            })
        }

        let msgType = common.getUserConfig<common.MessageMode>(common.ConfigKey.simpleDisplayMode)
        switch (msgType) {
            case common.MessageMode.notification: {
                common.showNotification(msgArr.join("🔹"))
                break;
            }
            case common.MessageMode.statusBar: {
                common.showStatusBar(msgArr.join("🔹"))
                break;
            }
            case common.MessageMode.modal: {
                common.showModal(msgArr.join("\n🔹"))
                break;
            }
        }
    }).catch(e => common.showError(e))
}

export {
    action,
}