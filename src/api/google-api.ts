import * as httpProxy from "../util/http-proxy"
import * as api from "./index"

const apiDomain = "https://translate.googleapis.com"

const translatePath = "/translate_a/single"
const translateDefaultQuery = new Map<string, string | Array<string>>([
    ["client", "gtx"],
    ["dj", "1"],
    // input encoding
    ["ie", "utf8"],
    // output encoding
    ["oe", "utf8"],
    // dictionary
    ["dt", ["t", "rm", "bd", "ex", "md", "ss", "at"]],
])

const ttsPath = "/translate_tts"
const ttsDefaultQuery = new Map<string, string | Array<string>>([
    ["client", "gtx"],
    // input encoding
    ["ie", "utf8"],
])

interface ApiResult {
    sentences?: sentences[]
    alternative_translations?: alternative_translations[]
    src?: string
    dict?: dict[]
    examples?: examples
    synsets?: synsets[]
    definitions?: definitions[]
}

interface sentences {
    trans?: string
    translit?: string
    src_translit?: string
}

interface alternative_translations {
    alternative?: alternative[]
}

interface alternative {
    word_postproc?: string
}

interface dict {
    pos?: string
    entry?: dictEntry[]
}

interface dictEntry {
    word?: string
    reverse_translation?: string[]
}

interface examples {
    example?: example[]
}

interface example {
    text?: string
}

interface synsets {
    pos?: string
    entry?: synsetsEntry[]
}

interface synsetsEntry {
    synonym?: string[]
    definition_id?: string
}

interface definitions {
    pos?: string
    entry?: definitionsEntry[]
}

interface definitionsEntry {
    gloss?: string
    example?: string
    definition_id?: string
}

const createQuery = (query: Map<string, string | Array<string>>): string => {
    let params: Array<string> = []
    query.forEach((v, k) => {
        if (Array.isArray(v)) {
            v.forEach(i => params.push(`${k}=${i}`))
        } else {
            params.push(`${k}=${v}`)
        }
    })
    return params.join("&")
}

const transParam = (item: api.TranslateItem): Map<string, string> => {
    return new Map<string, string>([
        ["q", encodeURIComponent(item.q)],
        ["sl", item.sl],
        ["tl", item.tl],
        // dictionary language
        ["hl", item.tl],
    ])
}

const generateRequest = (path: string): Promise<Buffer> => {
    return httpProxy.request(`${apiDomain}${path}`, {
        method: "GET",
    })
}

const translate = (item: api.TranslateItem): Promise<api.TranslateResult> => {
    let path = `${translatePath}?${createQuery(new Map([...translateDefaultQuery, ...transParam(item)]))}`
    return new Promise<api.TranslateResult>((resolve, reject) => {
        generateRequest(path).then(data => {
            let result = JSON.parse(data.toString()) as ApiResult
            resolve(convertToTranslateResult(item, result))
        }).catch(e => reject(e))
    })
}

const tts = (item: api.TranslateItem): Promise<Buffer> => {
    let path = `${ttsPath}?${createQuery(new Map([...ttsDefaultQuery, ...transParam(item)]))}`
    return new Promise<Buffer>((resolve, reject) => {
        generateRequest(path).then(data => resolve(data)).catch(e => reject(e))
    })
}

const convertToTranslateResult = (item: api.TranslateItem, apiResult: ApiResult): api.TranslateResult => {
    let result: api.TranslateResult = {
        item,
        defaultResult: "",
        alternative: [],
        sourceLanguage: apiResult.src,
        dictionary: [],
        definition: [],
        example: [],
    }

    let srcPronounce = apiResult.sentences?.filter(i => i.src_translit).map(i => i.src_translit as string) ?? []
    if (srcPronounce?.length > 0) result.sourcePronounce = srcPronounce[0]
    let targetPronounce = apiResult.sentences?.filter(i => i.translit).map(i => i.translit as string) ?? []
    if (targetPronounce?.length > 0) result.targetPronounce = targetPronounce[0]

    result.defaultResult = apiResult?.sentences?.map(i => i?.trans ?? "").join("") ?? ""
    if (apiResult?.alternative_translations) {
        apiResult.alternative_translations?.forEach(i => {
            if (i.alternative && i.alternative.length > 0) {
                result.alternative.push(i.alternative.filter(j => j.word_postproc).map(j => j.word_postproc as string))
            }
        })
    }

    apiResult.definitions?.forEach(i => {
        result.definition.push({
            pos: i.pos,
            entry: i.entry?.map(j => {
                return {
                    gloss: j.gloss,
                    example: j.example,
                    synonym: apiResult.synsets?.map(k => (k.pos === i.pos ? (k.entry ?? []) : []) as synsetsEntry[])
                        .reduce((p, c) => [...p, ...c], [])
                        .map(h => h.definition_id === j.definition_id ? (h.synonym ?? []) : [])
                        .reduce((p, c) => [...p, ...c], [])
                        ?? []
                }
            }) ?? []
        })
    })

    apiResult.dict?.forEach(i => {
        result.dictionary.push({
            pos: i.pos,
            entry: i.entry?.map(i => {
                return {
                    word: i.word,
                    reserve: i.reverse_translation ?? []
                }
            }) ?? []
        })
    })

    result.example = apiResult.examples?.example?.filter(i => i.text).map(i => {
        return {
            source: i.text as string
        }
    }) ?? []

    if (result?.sourceLanguage) result.item.sl = result.sourceLanguage
    result.item.results = []
    if (result.alternative?.length === 1) {
        result.alternative[0].forEach(i => result.item.results?.push(i))
    } else {
        result.item.results?.push(result.defaultResult)
    }

    return result
}

export {
    translate,
    tts,
}