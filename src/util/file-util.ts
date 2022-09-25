import fs from "fs"
import { App } from "./app"


const readFile = (path: string): Buffer => {
    return fs.readFileSync(path)
}

const writeFile = (path: string, content: string | NodeJS.ArrayBufferView) => {
    let folder = path.substring(0, path.lastIndexOf("/"))
    fs.mkdirSync(folder, {
        recursive: true,
        mode: 0o777,
    })
    fs.writeFileSync(path, content, {
        mode: 0o777,
    })
}

const readJsonFile = (path: string): any => {
    return JSON.parse(new String(readFile(path)).toString())
}

const readExtensionFile = (subpath: string): Buffer => {
    return readFile(`${App.instance().getContext()?.extensionPath ?? "."}/${subpath}`)
}

const writeExtensionFile = (subpath: string, content: string | NodeJS.ArrayBufferView) => {
    writeFile(`${App.instance().getContext()?.extensionPath ?? "."}/${subpath}`, content)
}

const readExtensionJsonFile = (subpath: string): any => {
    return readJsonFile(`${App.instance().getContext()?.extensionPath ?? "."}/${subpath}`)
}

export {
    readExtensionJsonFile,
    writeExtensionFile,
    readExtensionFile,
    writeFile,
}