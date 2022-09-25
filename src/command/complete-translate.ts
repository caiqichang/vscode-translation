import { TranslationPanel } from "../webview/translate-panel/index"
import * as command from "./index"

const action = (command: command.CommandName) => {
    TranslationPanel.instance().showPanel(command)
}

export {
    action,
}