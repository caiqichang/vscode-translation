import * as api from "../api/index"
import * as common from "../util/common"
import * as history from "../component/history"
import * as command from "./index"

const action = (command: command.CommandName) => {
    let item: api.TranslateItem = {
        q: common.getEditorSelection(),
        sl: common.getUserConfig<string>(common.ConfigKey.sourceLanguage) ?? "",
        tl: common.getUserConfig<string>(common.ConfigKey.targetLanguage) ?? "",
        results: [],
    }

    api.translate(item).then(result => {
        item.results?.push(result.defaultResult)
        if (result.alternative?.length === 1) result.alternative[0].forEach(i => item.results?.push(i))
        history.writeHistory(item)

        let msgArr = item.results?.map(i => `🔹${i}`) ?? []
        let msgType = common.getUserConfig<common.MessageMode>(common.ConfigKey.simpleDisplayMode)
        switch (msgType) {
            case common.MessageMode.notification: {
                common.showNotification(msgArr.join(""))
                break;
            }
            case common.MessageMode.statusBar: {
                common.showStatusBar(msgArr.join(""))
                break;
            }
            case common.MessageMode.modal: {
                common.showModal(msgArr.join("\n"))
                break;
            }
        }
    }).catch(e => common.showError(e))
}

export {
    action,
}