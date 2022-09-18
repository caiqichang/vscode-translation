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
    examples?: examples[]
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
    text?: string
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

const translate = (item: api.TranslateItem): Promise<api.TranslateResult> => {
    let url = `${apiDomain}${translatePath}?${createQuery(new Map([...translateDefaultQuery, ...transParam(item)]))}`
    return new Promise<api.TranslateResult>((resolve, reject) => {
        httpProxy.request(url, {
            method: "GET"
        }).then(data => {
            let json = JSON.parse(data.toString()) as ApiResult
            resolve(convertToTranslateResult(json))
        }).catch(e => reject(e))
    })
}

const tts = (item: api.TranslateItem): Promise<Buffer> => {
    let url = `${apiDomain}${ttsPath}?${createQuery(new Map([...ttsDefaultQuery, ...transParam(item)]))}`
    return new Promise<Buffer>((resolve, reject) => {
        httpProxy.request(url, {
            method: "GET"
        }).then(data => resolve(data)).catch(e => reject(e))
    })
}

const convertToTranslateResult = (apiResult: ApiResult): api.TranslateResult => {
    let result: api.TranslateResult = {
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
    if (apiResult?.alternative_translations && apiResult?.alternative_translations.length === 1) {
        apiResult.alternative_translations?.forEach(i => {
            if (i.alternative && i.alternative.length > 0) {
                result.alternative.push(i.alternative.filter(j => j.word_postproc).map(j => j.word_postproc as string))
            }
        })
    }

    // todo

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

    result.example = apiResult.examples?.filter(i => i.text).map(i => i.text as string) ?? []

    return result
}

export {
    translate,
    tts,
}