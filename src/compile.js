import kit from "nokit";

let { _ } = kit;

export default async (cmd) => {
    cmd = _.clone(cmd);

    let ext = kit.path.extname(cmd.path);

    cmd.src = await kit.request({
        url: `http://${cmd.root}/src`,
        reqData: cmd.path
    });

    let loader = require(_.find(cmd.loaders, { ext }).loader);

    return await loader(cmd);
};
