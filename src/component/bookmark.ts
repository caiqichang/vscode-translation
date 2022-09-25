import * as api from "../api/index"
import { App } from "../util/app"
import * as common from "../util/common"

const key = "bookmark"

const readBookmark = (): Array<api.TranslateItem> => {
    return (App.instance().getContext()?.globalState.get(key) ?? []) as Array<api.TranslateItem>
}

const writebookmarkHelper = (content: Array<api.TranslateItem>) => {
    App.instance().getContext()?.globalState.update(key, content)
}

const writeBookmark = (item: api.TranslateItem): Array<api.TranslateItem> => {
    let bookmark = readBookmark()
    bookmark = bookmark.filter(i => !(i.q === item.q && i.sl === item.sl && i.tl === item.tl))
    bookmark.unshift(item)
    writebookmarkHelper(bookmark)
    return bookmark
}

const removeBookmark = (item: api.TranslateItem): Array<api.TranslateItem> => {
    let bookmark = readBookmark()
    bookmark = bookmark.filter(i => !(i.q === item.q && i.sl === item.sl && i.tl === item.tl))
    writebookmarkHelper(bookmark)
    return bookmark
}

const exportBookmark = () => {
    common.exportToFile(JSON.stringify(readBookmark(), null, 4), "bookmark.json")
}

export {
    key,
    readBookmark,
    writeBookmark,
    removeBookmark,
    exportBookmark,
}