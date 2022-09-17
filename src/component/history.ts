import * as common from "../util/common"
import * as translateModel from "./translate-model"
import { App } from "../util/app"

const key = "history"

const readHistory = (): Array<translateModel.TranslateItem> => {
    return (App.instance().getContext()?.globalState.get(key) ?? []) as Array<translateModel.TranslateItem>
}

const writeHistoryHelper = (content: any) => {
    App.instance().getContext()?.globalState.update(key, content)
}

const writeHistory = (item: translateModel.TranslateItem) => {
    let max = common.getUserConfig<number>(common.ConfigKey.historyMax) ?? 0
    if (max <= 0) return;
    let history = readHistory()
    if (history.length >= max) history.pop()
    history.unshift(item)
    writeHistoryHelper(history)
}

const clearHistory = () => {
    writeHistoryHelper([])
}

export {
    key,
    readHistory,
    writeHistory,
    clearHistory,
}