import fs from "fs"
import {App} from "./app"

export const getPackageJson = (): Object => {
    return JSON.parse(new String(fs.readFileSync(`${App.instance().getContext()?.extensionPath ?? "."}/package.json`)).toString())
}