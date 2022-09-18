import * as api from "../api/index"
import { App } from "../util/app"

const key = "bookmark"

const readBookmark = (): Array<api.TranslateItem> => {
    return (App.instance().getContext()?.globalState.get(key) ?? []) as Array<api.TranslateItem>
}

const writebookmarkHelper = (content: string) => {
    App.instance().getContext()?.globalState.update(key, content)
}

const writeBookmark = (item: api.TranslateItem): Array<api.TranslateItem> => {
    let bookmark = readBookmark()
    bookmark = bookmark.filter(i => !(i.q === item.q && i.sl === item.sl && i.tl === item.tl))
    bookmark.unshift(item)
    writebookmarkHelper(JSON.stringify(bookmark))
    return bookmark
}

const removeBookmark = (item: api.TranslateItem): Array<api.TranslateItem> => {
    let bookmark = readBookmark()
    bookmark = bookmark.filter(i => !(i.q === item.q && i.sl === item.sl && i.tl === item.tl))
    writebookmarkHelper(JSON.stringify(bookmark))
    return bookmark
}

export {
    key,
    readBookmark,
    writeBookmark,
    removeBookmark,
}