/**
 * The transaction center
 */

import kit from "nokit";

let regLocalMod = /^[\.\/\\]/;

export default () => $ => {
    let cmd = JSON.parse($.reqBody + "");
    let absPath;

    let cwd = process.cwd();
    process.chdir(cmd.dir || ".");

    if (regLocalMod.test(cmd.path))
        absPath = kit.path.resolve(cmd.path);
    else
        absPath = require.resolve(cmd.path);

    process.chdir(cwd);

    $.body = kit.createReadStream(absPath);
};
