import * as googleApi from "./google-api"
import * as microsoftApi from "./microsoft-api"
import * as common from "../util/common"

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
    example: Example[]
}

interface Example {
    source: string,
    trans?: string,
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

const translate = (item: TranslateItem): Promise<TranslateResult> => {
    return (
        common.getUserConfig<string>(common.ConfigKey.translationApiProvider) === "Microsoft" ? microsoftApi : googleApi
    ).translate(item)
}

const tts = (item: TranslateItem): Promise<Buffer> => {
    return (
        common.getUserConfig<string>(common.ConfigKey.voiceApiProvider) === "Microsoft" ? microsoftApi : googleApi
    ).tts(item)
}

export {
    TranslateItem,
    TranslateResult,
    translate,
    tts,
}