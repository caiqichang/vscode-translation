import * as api from "./index"
import * as common from "../util/common"
import * as ws from "ws"
import * as crypto from "crypto"
import * as microsoftApiDict from "./microsoft-api-dict"


const ttsToken = "6A5AA1D4EAFF4E9FB37E23D68491D6F4"
const ttsApi = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${ttsToken}&ConnectionId=`

const translationAuth = "https://edge.microsoft.com/translate/auth"
const translationApi = "https://api.cognitive.microsofttranslator.com"
const translationApiVersion = "3.0"

interface TranslationApiResult {
    detectedLanguage: detectedLanguage
    translations: translations[]
}

interface detectedLanguage {
    language: string
    score: number
}

interface translations {
    text: string
    to: string
}

interface DictionaryApiResult {
    normalizedSource: string
    displaySource: string
    translations: DictionaryApiResult_translations[]
}

interface DictionaryApiResult_translations {
    normalizedTarget: string
    displayTarget: string
    posTag: string
    confidence: number
    prefixWord: string
    backTranslations: backTranslations[]
}

interface backTranslations {
    normalizedText: string
    displayText: string
    numExamples: number
    frequencyCount: number
}

interface ExampleApiResult {
    normalizedSource: string
    normalizedTarget: string
    examples: examples[]
}

interface examples {
    sourcePrefix: string
    sourceTerm: string
    sourceSuffix: string
    targetPrefix: string
    targetTerm: string
    targetSuffix: string
}

let token = ""

const getAuth = async () => {
    await fetch(translationAuth).then(i => i.text()).then(i => token = i)
}

const getPostOptions = (body: any) => {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${token}`,
        },
        body: JSON.stringify(body),
    }
}

const getTranslation = async (item: api.TranslateItem): Promise<TranslationApiResult[]> => {
    let result = {}
    await fetch(`${translationApi}/translate?api-version=${translationApiVersion}${getToLanguage(item)}${getFromLanguage(item)}`, getPostOptions([
        {
            Text: item.q,
        }
    ]))
        .then(i => i.json())
        .then(i => {
            result = i
        })
    return result as TranslationApiResult[]
}

const getDictionary = async (item: api.TranslateItem): Promise<DictionaryApiResult[]> => {
    let result = {}
    await fetch(`${translationApi}/dictionary/lookup?api-version=${translationApiVersion}${getToLanguage(item)}${getFromLanguage(item)}`, getPostOptions([
        {
            Text: item.q,
        }
    ]))
        .then(i => i.json())
        .then(i => {
            result = i
        })
    return result as DictionaryApiResult[]
}

const getExample = async (item: api.TranslateItem, body: any): Promise<ExampleApiResult[]> => {
    let result = {}
    await fetch(`${translationApi}/dictionary/examples?api-version=${translationApiVersion}${getToLanguage(item)}${getFromLanguage(item)}`, getPostOptions(body))
        .then(i => i.json())
        .then(i => {
            result = i
        })
    return result as ExampleApiResult[]
}

const getToLanguage = (item: api.TranslateItem) => {
    return `&to=${microsoftApiDict.translationMap.get(item.tl)}`
}

const getFromLanguage = (item: api.TranslateItem) => {
    if (item.sl === "auto") return ""
    return `&from=${microsoftApiDict.translationMap.get(item.sl)}`
}

const translate = (item: api.TranslateItem): Promise<api.TranslateResult> => {
    return new Promise<api.TranslateResult>(async (resolve, reject) => {
        let result: api.TranslateResult = {
            item,
            defaultResult: "",
            alternative: [],
            sourceLanguage: "",
            dictionary: [],
            definition: [],
            example: [],
        }

        await getAuth()

        let translation = await getTranslation(item)
        let dictionary = await getDictionary(item)

        if (translation[0].detectedLanguage) {
            item.sl = microsoftApiDict.parseTranslation(translation[0].detectedLanguage.language)
        }
        item.results = translation[0].translations.map(i => i.text)

        result.defaultResult = translation[0].translations[0].text
        result.sourceLanguage = item.sl
        result.alternative.push(item.results)

        if (dictionary.length && dictionary.length > 0) {
            dictionary[0].translations.forEach(d => {
                let posArr = result.dictionary.filter(i => i.pos === d.posTag)
                if (posArr.length > 0) {
                    posArr[0].entry?.push({
                        word: d.displayTarget,
                        reserve: d.backTranslations.map(i => i.displayText)
                    })
                } else {
                    result.dictionary.push({
                        pos: d.posTag,
                        entry: [{
                            word: d.displayTarget,
                            reserve: d.backTranslations.map(i => i.displayText)
                        }]
                    })
                }
            })

            let example = await getExample(item, dictionary[0].translations.map(i => {
                return {
                    Text: dictionary[0].normalizedSource,
                    Translation: i.normalizedTarget,
                }
            }))

            example.forEach(e => {
                e.examples.forEach(i => {
                    result.example.push({
                        source: `${i.sourcePrefix}<b>${i.sourceTerm}</b>${i.sourceSuffix}`,
                        trans: `${i.targetPrefix}<b>${i.targetTerm}</b>${i.targetSuffix}`,
                    })
                })
            })
        }

        resolve(result)
    })
}

const tts = (item: api.TranslateItem): Promise<Buffer> => {
    return new Promise<Buffer>((resolve, reject) => {

        const websocket = new ws.WebSocket(`${ttsApi}${crypto.randomUUID()}`)

        let buffer = Buffer.from([])

        websocket.on("open", () => {

            websocket.send(`
Content-Type: application/json; charset=utf-8\r
X-Timestamp: ${new Date().toUTCString()}\r
Path: speech.config\r
\r
{
    "context": {
        "synthesis": {
            "audio": {
                "metadataoptions": {
                    "sentenceBoundaryEnabled": true,
                    "wordBoundaryEnabled": false
                },
                "outputFormat": "audio-24khz-48kbitrate-mono-mp3"
            }
        }
    }
}
        `)

            websocket.send(`
X-RequestId: ${crypto.randomUUID()}\r
Content-Type: application/ssml+xml\r
X-Timestamp: ${new Date().toUTCString()}\r
Path: ssml\r
\r
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="${microsoftApiDict.voiceMap.get(item.tl)}">
        <prosody pitch="+0Hz" rate="+0%" volume="+0%">
${common.escapeHtml(item.q)}
        </prosody>
    </voice>
</speak>
        `)
        })

        websocket.on("message", (data, isBinary) => {
            if (isBinary) {
                let arr = data as Buffer
                buffer = Buffer.concat([buffer, arr.subarray(arr[1] + 2, arr.length)])
            } else {
                let message = new String(data)
                if (message.indexOf("Path:turn.end") >= 0) {
                    resolve(buffer)
                    websocket.close()
                }
            }
        })
    })
}

export {
    translate,
    tts,
}