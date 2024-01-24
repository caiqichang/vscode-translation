import * as api from "../api/index"
import * as common from "../util/common"
import * as command from "./index"

const action = (command: command.CommandName) => {
    let item: api.TranslateItem = {
        q: common.getEditorSelection(),
        sl: common.getUserConfig<string>(common.ConfigKey.sourceLanguage) ?? "",
        tl: common.getUserConfig<string>(common.ConfigKey.targetLanguage) ?? "",
        results: [],
    }

    api.tts(item).then(result => {

    }).catch(e => common.showError(e))

}

export {
    action,
}
