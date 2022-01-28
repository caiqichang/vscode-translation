const vscode = require('vscode');
const httpProxy = require('../utils/http-proxy.js');

const TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';
const TRANSLATE_COMMON_PARAM =
    'client=gtx'
    + '&dj=1'
    + '&ie=utf8'
    + '&oe=utf8'
    + '&dt=t&dt=rm&dt=bd&dt=ex&dt=md&dt=ss&dt=at'
    ;

const TTS_API = 'https://translate.googleapis.com/translate_tts';
const TTS_COMMON_PARAM =
    'client=gtx'
    + '&ie=utf8'
    ;

const getEnableProxy = () => vscode.workspace.getConfiguration('translation').get('enable-proxy');

/**
 * Get translation from google.
 * @param param {tl: target-language, sl: source-language, q: query}  
 * @returns 
 */
const getTranslate = param => {
    return new Promise((resolve, reject) => {
        param.q = encodeURIComponent(param.q.replace(/\r\n/g, ' ').replace(/\n/g, ' '));
        let query = Object.keys(param).map(k => `&${k}=${param[k]}`).join('');
        httpProxy.doGet(`${TRANSLATE_API}?${TRANSLATE_COMMON_PARAM}${query}`, getEnableProxy()).then(data => {
            let json = JSON.parse(data.toString());
            resolve(json);
        }).catch(error => reject(error));
    });
};

/**
 * Get pronunciation from google.
 * @param param {tl: target-language, sl: source-language, q: query}  
 * @returns 
 */
const getTts = param => {
    return new Promise((resolve, reject) => {
        param.q = encodeURIComponent(param.q.replace(/\r\n/g, ' ').replace(/\n/g, ' '));
        let query = Object.keys(param).map(k => `&${k}=${param[k]}`).join('');
        httpProxy.doGet(`${TTS_API}?${TTS_COMMON_PARAM}${query}`, getEnableProxy()).then(data => {
            resolve(data);
        }).catch(error => reject(error));
    });
};

module.exports = {
    getTranslate,
    getTts,
};