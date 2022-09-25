import http from "http"
import https from "https"
import * as common from "./common"

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
    let proxyUrl = new URL(common.getUserConfig<string>(common.ConfigKey.proxyUrl) ?? "")

    let apiClient = apiUrl.protocol.toLowerCase() === "http:" ? http : https
    let proxyClient = proxyUrl.protocol.toLowerCase() === "http:" ? http : https

    return new Promise<Buffer>((resolve, reject) => {
        if (common.getUserConfig<boolean>(common.ConfigKey.enableProxy) ?? false) {
            let proxyRequest = proxyClient.request(proxyUrl.href, {
                method: "CONNECT",
                path: `${apiUrl.hostname}:${apiUrl.port ?? (apiUrl.protocol.toLowerCase() === "http:" ? 80 : 443)}`,
                rejectUnauthorized: false,
            })
            proxyRequest.on("connect", (response, socket) => {

                let request = apiClient.request(apiUrl.href, {
                    ...options, ...{
                        rejectUnauthorized: false,
                        agent: new apiClient.Agent({ socket }),
                    }
                }, response => {
                    responseHandler(response, resolve, reject)
                })
                if (body) request.write(body)
                requestHelper(request, reject)

            })
            requestHelper(proxyRequest, reject)
        } else {
            let request = apiClient.request(apiUrl.href, {
                ...options, ...{
                    rejectUnauthorized: false,
                }
            }, response => {
                responseHandler(response, resolve, reject)
            })
            if (body) request.write(body)
            requestHelper(request, reject)
        }

    })
}

export {
    request,
}