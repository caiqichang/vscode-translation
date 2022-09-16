import * as httpProxy from "../util/http-proxy"

const apiDomain = "https://translate.googleapis.com"

const translateApi = "/translate_a/single"
const translateDefaultQuery = new Map<string, string | Array<string>>([
    ["client", "gtx"],
    ["dj", "1"],
    ["ie", "utf8"],
    ["oe", "utf8"],
    ["dt", ["t", "rm", "bd", "ex", "md", "ss", "at"]],
])

const ttsApi = "/translate_tts"
const ttsDefaultQuery = new Map<string, string | Array<string>>([
    ["client", "gtx"],
    ["ie", "utf8"],
])

const createQuery = (query: Map<string, string | Array<string>>): string => {
    let params: Array<string> = []
    query.forEach((k, v) => {
        if (Array.isArray(v)) {
            v.forEach(i => params.push(`${k}=${i}`))
        }else {
            params.push(`${k}=${v}`)
        }
    })
    return params.join("&")
}

const translate = () => {
    let url = `${apiDomain}${translateApi}?${createQuery(translateDefaultQuery)}&q=`
}

const tts = () => {
    let url = `${apiDomain}${ttsApi}?${createQuery(ttsDefaultQuery)}&q=`
}

export {
    translate,
    tts,
}