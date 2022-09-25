"use strict"

const LANGUAGE = {
    "enum": [
        "auto", "zh-CN", "en", "zh-TW", "sq", "ar", "am", "az", "ga", "et",
        "eu", "be", "bg", "is", "pl", "bs", "fa", "af", "da", "de",
        "ru", "fr", "tl", "fi", "fy", "km", "ka", "gu", "kk", "ht",
        "ko", "ha", "nl", "ky", "gl", "ca", "cs", "kn", "co", "hr",
        "ku", "la", "lv", "lo", "lt", "lb", "rw", "ro", "mg", "mt",
        "mr", "ml", "ms", "mk", "mi", "mn", "bn", "my", "hmn", "xh",
        "zu", "ne", "no", "pa", "pt", "ps", "ny", "ja", "sv", "sm",
        "sr", "st", "si", "eo", "sk", "sl", "sw", "gd", "ceb", "so",
        "tg", "te", "ta", "th", "tr", "tk", "cy", "ur", "uk", "uz",
        "es", "iw", "el", "haw", "sd", "hu", "sn", "hy", "ig", "it",
        "yi", "hi", "su", "id", "jw", "yo", "vi"
    ],
    "enumDescriptions": [
        "Auto", "Chinese-Simple", "English", "Chinese-Traditional", "Albanian", "Arabic", "Amharic", "Azerbaijani", "Irish", "Estonian",
        "Basque", "Belarusian", "Bulgarian", "Icelandic", "Polish", "Bosnian", "Persian", "Afrikaans", "Danish", "German",
        "Russian", "French", "Filipino", "Finnish", "Frisian", "Khmer", "Georgian", "Gujarati", "Kazakh", "Haitian Creole",
        "Korean", "Hausa", "Dutch", "Kyrgyz", "Galician", "Catalan", "Czech", "Kannada", "Corsican", "Croatian",
        "Kurdish", "Latin", "Latvian", "Lao", "Lithuanian", "Luxembourgish", "Kinyarwanda", "Romanian", "Malagasy", "Maltese",
        "Marathi", "Malayalam", "Malay", "Macedonian", "Maori", "Mongolian", "Bengali", "Myanmar", "Hmong", "Xhosa",
        "Zulu", "Nepali", "Norwegian", "Punjabi", "Portuguese", "Pashto", "Chichewa", "Japanese", "Swedish", "Samoan",
        "Serbian", "Sesotho", "Sinhala", "Esperanto", "Slovak", "Slovenian", "Swahili", "Scots Gaelic", "Cebuano", "Somali",
        "Tajik", "Telugu", "Tamil", "Thai", "Turkish", "Turkmen", "Welsh", "Urdu", "Ukrainian", "Uzbek",
        "Spanish", "Hebrew", "Greek", "Hawaiian", "Sindhi", "Hungarian", "Shona", "Armenian", "Igbo", "Italian",
        "Yiddish", "Hindi", "Sundanese", "Indonesian", "Javanese", "Yoruba", "Vietnamese"
    ],
}

const SOURCE_LANGUAGE = []
LANGUAGE.enum.forEach((i, index) => {
    if (index === 0) return;
    SOURCE_LANGUAGE.push({
        key: i,
        label: LANGUAGE.enumDescriptions[index],
    })
})
SOURCE_LANGUAGE.sort((l, r) => l.label.localeCompare(r.label))
SOURCE_LANGUAGE.unshift({
    key: "auto",
    label: "Auto",
})

const TARGET_LANGUAGE = []
LANGUAGE.enum.forEach((i, index) => {
    if (index === 0) return;
    TARGET_LANGUAGE.push({
        key: i,
        label: LANGUAGE.enumDescriptions[index],
    })
})
TARGET_LANGUAGE.sort((l, r) => l.label.localeCompare(r.label))
