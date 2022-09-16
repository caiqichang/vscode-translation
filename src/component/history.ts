import * as fileUtil from "../util/file-util"
import * as common from "../util/common"

interface HistoryItem {
    text: string,
    sl: string,
    tl: string,
}

interface HistoryFileContent {
    history: Array<HistoryItem>,
}

const historyFilePath = "data/history.json"

const readHistory = (): Array<HistoryItem> => {
    try {
        return (fileUtil.readExtensionJsonFile(historyFilePath) as HistoryFileContent).history
    }catch(e) {
        return []
    }
}

const writeHistoryHelper = (content: string) => {
    fileUtil.writeExtensionFile(historyFilePath, content)
}

const writeHistory = (item: HistoryItem) => {
    let max = common.getUserConfig<number>(common.ConfigKey.historyMax) ?? 0
    if (max <= 0) return ;
    let history = readHistory()
    if (history.length >= max) history.pop()
    history.unshift(item)
    writeHistoryHelper(JSON.stringify({history}))
}

const clearHistory = () => {
    writeHistoryHelper(JSON.stringify({history: []}))
}

export {
    HistoryItem,
    readHistory,
    writeHistory,
    clearHistory,
}