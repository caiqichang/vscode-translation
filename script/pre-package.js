const fs = require('fs');

// relatived to root path of project
const build = 'build';
if (fs.existsSync(build)) {
    fs.rmSync(build, {
        recursive: true,
    });
}
fs.mkdirSync(build);