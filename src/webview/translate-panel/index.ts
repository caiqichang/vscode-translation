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
        this.panel = common.createWebviewPanel("translationPanel", "Translation")
        this.panel.onDidDispose(() => this.panel = null)
        this.panel.webview.html = fileUtil.readExtensionFile("static/translation-panel.html").toString()
            .replaceAll("${extensionPath}", common.createWebviewUri(this.panel, "").toString())
            .replaceAll("${version}", Math.random().toString())
        this.panel.iconPath = common.createUri("/resources/logo.png")
        TranslationIpc.instance().setWebview(this.panel)
    }

    public showPanel = (cmd: command.CommandName, args: any[]) => {
        let q = common.getEditorSelection()

        let fromComplete = cmd === command.CommandName.completeTranslate
        if (typeof args === "string") {
            fromComplete = true
            q = Buffer.from(args as string, "base64").toString()
        }

        if (this.panel === null) {
            if (fromComplete) TranslationIpc.instance().setQuery(q)
            this.initPanel()
        } else if (!this.panel.visible) {
            this.panel.reveal()
            TranslationIpc.instance().sendTranslate(q)
        } else {
            TranslationIpc.instance().sendTranslate(q)
        }
    }
}

export {
    TranslationPanel,
}