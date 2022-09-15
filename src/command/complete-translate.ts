import vscode from "vscode"
import * as fileUtil from "../util/file-util"

export const action = (command: String) => {
    console.log(fileUtil.getPackageJson())
}