import * as api from "../api/index"
import * as common from "../util/common"
import * as history from "../component/history"

const action = (command: string) => {
    let item:api.TranslateItem = {
        q: common.getEditorSelection(),
        sl: common.getUserConfig<string>(common.ConfigKey.sourceLanguage) ?? "",
        tl: common.getUserConfig<string>(common.ConfigKey.targetLanguage) ?? "",
    }

    api.translate(item).then(result => {
        item.result = result.defaultResults.join("")
        history.writeHistory(item)

        let msgType = common.getUserConfig<common.MessageMode>(common.ConfigKey.simpleDisplayMode)
        switch (msgType) {
            case common.MessageMode.notification: {
                common.showNotification(item.result)
                break;
            }
            case common.MessageMode.statusBar: {
                common.showStatusBar(item.result)
                break;
            }
            case common.MessageMode.modal: {
                common.showModal(result.defaultResults.join("\n"))
                break;
            }
        }
    }).catch(e => common.showError(e))
}

export {
    action,
}