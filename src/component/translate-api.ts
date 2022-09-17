import * as httpProxy from "../util/http-proxy"
import * as translateModel from "./translate-model"

const apiDomain = "https://translate.googleapis.com"

const translateApi = "/translate_a/single"
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

const ttsApi = "/translate_tts"
const ttsDefaultQuery = new Map<string, string | Array<string>>([
    ["client", "gtx"],
    // input encoding
    ["ie", "utf8"],
])

interface TranslateResult {
    sentences?: sentences[],
    alternative_translations?: alternative_translations[],
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

const transParam = (item: translateModel.TranslateItem): Map<string, string> => {
    return new Map<string, string>([
        ["q", encodeURIComponent(item.q)],
        ["sl", item.sl],
        ["tl", item.tl],
    ])
}

const translate = (item: translateModel.TranslateItem): Promise<TranslateResult> => {
    let url = `${apiDomain}${translateApi}?${createQuery(new Map([...translateDefaultQuery, ...transParam(item)]))}`
    return new Promise<TranslateResult>((resolve, reject) => {
        httpProxy.request(url, {
            method: "GET"
        }).then(data => {
            let json = JSON.parse(data.toString()) as TranslateResult
            resolve(json)
        }).catch(e => reject(e))
    })
}

const tts = (item: translateModel.TranslateItem): Promise<Buffer> => {
    let url = `${apiDomain}${ttsApi}?${createQuery(new Map([...translateDefaultQuery, ...transParam(item)]))}`
    return new Promise<Buffer>((resolve, reject) => {
        httpProxy.request(url, {
            method: "GET"
        }).then(data => resolve(data)).catch(e => reject(e))
    })
}

export {
    TranslateResult,
    translate,
    tts,
}