import kit from "nokit";

let { _ } = kit;

export default async (cmd) => {
    cmd = _.clone(cmd);

    let ext = kit.path.extname(cmd.path);

    cmd.src = await kit.request({
        url: `http://${cmd.root}/src`,
        reqData: JSON.stringify({
            dir: cmd.dir,
            path: cmd.path
        })
    });

    let compiler = require(_.find(cmd.compilers, { ext }).compiler);

    return await compiler(cmd);
};
