"use strict"

const LANGUAGE = {
    "enum": [
        "auto", "zh-CN", "en", "zh-TW", "ja", "sq", "ar", "am", "az", "ga", "et",
        "bg", "is", "pl", "bs", "fa", "af", "da", "de",
        "ru", "fr", "tl", "fi", "km", "ka", "gu", "kk",
        "ko", "nl", "gl", "ca", "cs", "kn", "hr",
        "lv", "lo", "lt", "rw", "ro", "mt",
        "mr", "ml", "ms", "mk", "mn", "bn", "my",
        "zu", "ne", "no", "pt", "ps", "sv",
        "sr", "si", "sk", "sl", "sw", "so",
        "te", "ta", "th", "tr", "cy", "ur", "uk", "uz",
        "es", "iw", "el", "hu", "it",
        "hi", "id", "vi"
    ],
    "enumDescriptions": [
        "Auto", "Chinese-Simple", "English", "Chinese-Traditional", "Japanese", "Albanian", "Arabic", "Amharic", "Azerbaijani", "Irish", "Estonian",
        "Bulgarian", "Icelandic", "Polish", "Bosnian", "Persian", "Afrikaans", "Danish", "German",
        "Russian", "French", "Filipino", "Finnish", "Khmer", "Georgian", "Gujarati", "Kazakh",
        "Korean", "Dutch", "Galician", "Catalan", "Czech", "Kannada", "Croatian",
        "Latvian", "Lao", "Lithuanian", "Kinyarwanda", "Romanian", "Maltese",
        "Marathi", "Malayalam", "Malay", "Macedonian", "Mongolian", "Bengali", "Myanmar",
        "Zulu", "Nepali", "Norwegian", "Portuguese", "Pashto", "Swedish",
        "Serbian", "Sinhala", "Slovak", "Slovenian", "Swahili", "Somali",
        "Telugu", "Tamil", "Thai", "Turkish", "Welsh", "Urdu", "Ukrainian", "Uzbek",
        "Spanish", "Hebrew", "Greek", "Hungarian", "Italian",
        "Hindi", "Indonesian", "Vietnamese"
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
