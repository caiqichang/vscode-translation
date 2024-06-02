const translationMap = new Map<string, string>([
    ["en", "en"],
    ["zh-CN", "zh-Hans"],
])

const voiceMap = new Map<string, string>([
    ["en", "en-US-AvaMultilingualNeural"],
    ["zh-CN", "zh-CN-XiaoxiaoNeural"],
])

const parseTranslation = (value: string) => {
    let key = value
    translationMap.forEach((k, v) => {
        if (v === value) key = k
    })
    return key
}

const parseVoice = (value: string) => {
    let key = value
    voiceMap.forEach((k, v) => {
        if (v === value) key = k
    })
    return key
}

export {
    translationMap,
    voiceMap,
    parseTranslation,
    parseVoice,
}