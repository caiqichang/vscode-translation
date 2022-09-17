import * as translateModel from "./translate-model"
import { App } from "../util/app"

// todo

const key = "bookmark"

const readBookmark = (): Array<translateModel.TranslateItem> => {
    return (App.instance().getContext()?.globalState.get(key) ?? []) as Array<translateModel.TranslateItem>
}

const writebookmarkHelper = (content: string) => {
    App.instance().getContext()?.globalState.update(key, content)
}

const writeBookmark = (item: translateModel.TranslateItem) => {
    let bookmark = readBookmark()
    bookmark.unshift(item)
    writebookmarkHelper(JSON.stringify(bookmark))
}

const removeBookmark = (item: translateModel.TranslateItem) => {
    // todo
}

export {
    key,
    readBookmark,
    writeBookmark,
    removeBookmark,
}