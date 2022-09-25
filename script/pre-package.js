const fs = require("fs")

"use strict"

// clear package output
const build = "build"
if (fs.existsSync(build)) {
    fs.rmSync(build, {
        recursive: true,
    })
}
fs.mkdirSync(build)

// clear ts output
const out = "out"
if (fs.existsSync(out)) {
    fs.rmSync(out, {
        recursive: true,
    })
}