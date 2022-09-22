"use strict"

const vscode = acquireVsCodeApi()

const app = Vue.createApp({
    data() {
        return {

        }
    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    methods: {
        receiveMessage() {
            // todo
        },
    },
})

app.config.compilerOptions.isCustomElement = tag => tag.startsWith("vscode-")

const appInstance = app.mount("#app")

window.addEventListener("message", event => {
    appInstance.receiveMessage(event.data)
})