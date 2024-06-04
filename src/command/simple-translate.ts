import * as api from "../api/index"
import * as common from "../util/common"
import * as history from "../component/history"
import * as command from "./index"

const action = (command: command.CommandName, args: any[]) => {
    let q = common.getEditorSelection()
    if (typeof args === "string") {
        q = Buffer.from(args as string, "base64").toString()
    }

    let item: api.TranslateItem = {
        q,
        sl: common.getUserConfig<string>(common.ConfigKey.sourceLanguage) ?? "",
        tl: common.getUserConfig<string>(common.ConfigKey.targetLanguage) ?? "",
        results: [],
    }

    api.translate(item).then(result => {
        history.writeHistory(result.item)

        let msg = (item.results?.map(i => `🔹${i}`) ?? []).join("")
        let msgType = common.getUserConfig<common.MessageMode>(common.ConfigKey.simpleDisplayMode)
        switch (msgType) {
            case common.MessageMode.notification: {
                common.showNotification(msg)
                break;
            }
            case common.MessageMode.statusBar: {
                common.showStatusBar(msg)
                break;
            }
        }
    }).catch(e => common.showError(e))
}

export {
    action,
}