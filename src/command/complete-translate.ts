import { TranslationPanel } from "../webview/translate-panel/index"
import * as command from "./index"

const action = (command: command.CommandName, args: any[]) => {
    TranslationPanel.instance().showPanel(command, args)
}

export {
    action,
}