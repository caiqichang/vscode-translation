import * as common from "../util/common"
import * as api from "../api/index"
import { App } from "../util/app"

const key = "history"

const readHistory = (): Array<api.TranslateItem> => {
    return (App.instance().getContext()?.globalState.get(key) ?? []) as Array<api.TranslateItem>
}

const writeHistoryHelper = (content: Array<api.TranslateItem>) => {
    App.instance().getContext()?.globalState.update(key, content)
}

const writeHistory = (item: api.TranslateItem): Array<api.TranslateItem> => {
    let max = common.getUserConfig<number>(common.ConfigKey.historyMax) ?? 0
    if (max <= 0) return [];
    let history = readHistory()
    if (history.length >= max) history.pop()
    history = history.filter(i => !(i.q === item.q && i.sl === item.sl && i.tl === item.tl))
    history.unshift(item)
    writeHistoryHelper(history)
    return history
}

const clearHistory = (): Array<api.TranslateItem> => {
    writeHistoryHelper([])
    return []
}

const removeHistory = (item: api.TranslateItem): Array<api.TranslateItem> => {
    let history = readHistory()
    history = history.filter(i => !(i.q === item.q && i.sl === item.sl && i.tl === item.tl))
    writeHistoryHelper(history)
    return history
}

const exportHistory = () => {
    common.exportToFile(JSON.stringify(readHistory(), null, 4), "history.json")
}

export {
    key,
    readHistory,
    writeHistory,
    clearHistory,
    removeHistory,
    exportHistory,
}