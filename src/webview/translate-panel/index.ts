import * as common from "../../util/common"
import vscode from "vscode"
import * as command from "../../command/index"
import * as fileUtil from "../../util/file-util"
import { TranslationIpc } from "./ipc"

class TranslationPanel {
    private constructor() {

    }
    private static _instance = new TranslationPanel()

    public static instance(): TranslationPanel {
        return this._instance
    }

    private panel: vscode.WebviewPanel | null = null

    private initPanel = () => {
        if (this.panel === null) {
            this.panel = common.createWebviewPanel("translationPanel", "Translation")
            this.panel.onDidDispose(() => this.panel = null)
            this.panel.webview.html = fileUtil.readExtensionFile("static/translation-panel.html").toString()
                .replaceAll("${extensionPath}", common.createWebviewUri(this.panel, "").toString())
                .replaceAll("${version}", Math.random().toString())
            this.panel.iconPath = common.createUri("/resources/logo.jpg")
            TranslationIpc.instance().setWebview(this.panel)
        } else {
            if (!this.panel.visible) {
                this.panel.reveal()
            }
        }
    }

    public showPanel = (cmd: command.CommandName) => {
        this.initPanel()
        if (cmd === command.CommandName.completeTranslate) {
            TranslationIpc.instance().sendTranslate(common.getEditorSelection())
        }
    }
}

export {
    TranslationPanel,
}