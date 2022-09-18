import * as googleApi from "./google-api"

interface TranslateItem {
    q: string,
    sl: string,
    tl: string,
    result?: string,
}

interface TranslateResult {
    defaultResults: string[],
}

const translator = googleApi

const translate = (item: TranslateItem): Promise<TranslateResult> => {
    return translator.translate(item)
}

const tts = (item: TranslateItem): Promise<Buffer> => {
    return translator.tts(item)
}

export {
    TranslateItem,
    TranslateResult,
    translate,
    tts,
}