import * as common from "../util/common"
import * as history from "../component/history"

const action = (command: string) => {
    console.log(history.readHistory())
}

export {
    action,
}