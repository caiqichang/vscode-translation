import * as common from "../util/common"
import * as history from "../component/history"

const action = (command: string) => {
    history.writeHistory({
        text: "123",
        tl: "zh-cn",
        sl: "auto"
    })
    console.log("finish")
}

export {
    action,
}