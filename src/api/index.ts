import * as googleApi from "./google-api"

interface TranslateItem {
    q: string
    sl: string
    tl: string
    results?: string[]
}

interface TranslateResult {
    item: TranslateItem,
    defaultResult: string
    alternative: string[][]
    sourceLanguage?: string
    sourcePronounce?: string
    targetPronounce?: string
    dictionary: Dictionary[]
    definition: Definition[]
    example: string[]
}

interface Dictionary {
    pos?: string
    entry?: DictionaryEntry[]
}

interface DictionaryEntry {
    word?: string
    reserve: string[]
}

interface Definition {
    pos?: string
    entry?: DefinitionEntry[]
}

interface DefinitionEntry {
    gloss?: string
    example?: string
    synonym: string[]
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