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
    sentences?: sentences[],
    alternative_translations?: alternative_translations[],
    src?: string,
}

interface sentences {
    trans?: string,
    translit?: string,
    src_translit?: string,
}

interface alternative_translations {
    alternative?: alternative[]
}

interface alternative {
    word_postproc?: string,
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
        defaultResults: [],
    }

    result.defaultResults.push(`🔹${apiResult?.sentences?.map(i => i?.trans ?? "").join("") ?? ""}`)
    if (apiResult?.alternative_translations && apiResult?.alternative_translations.length === 1) {
        apiResult.alternative_translations[0]?.alternative?.forEach(i => {
            if (i.word_postproc) result.defaultResults.push(`🔹${i.word_postproc}`)
        })
    }

    // todo

    return result
}

export {
    translate,
    tts,
}