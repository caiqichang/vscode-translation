import http from "http"
import https from "https"

const requestHelper = (request: http.ClientRequest, reject: (reason?: any) => void) => {
    request.on("error", error => reject(error))
    request.end()
}

const responseHandler = (response: http.IncomingMessage,
    resolve: (value: Buffer | PromiseLike<Buffer>) => void,
    reject: (reason?: any) => void) => {

    let chunks: Array<Uint8Array> = []
    response.on("data", data => chunks.push(data))
    response.on("end", () => resolve(Buffer.concat(chunks)))
    response.on("error", error => reject(error))
}

const request = (url: string, options: http.RequestOptions | https.RequestOptions, body?: any): Promise<Buffer> => {
    let apiUrl = new URL(url)
    let apiClient = apiUrl.protocol.toLowerCase() === "http:" ? http : https
    return new Promise<Buffer>((resolve, reject) => {
        let request = apiClient.request(apiUrl.href, {
            ...{
                rejectUnauthorized: false,
            },
            ...options,
        }, response => {
            responseHandler(response, resolve, reject)
        })
        if (body) request.write(body)
        requestHelper(request, reject)
    })
}

export {
    request,
}