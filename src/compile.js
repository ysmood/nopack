import kit from "nokit";

let { _ } = kit;

async function compile (cmd) {
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
}

export default (conf) => async $ => {
    try {
        let cmd = JSON.parse($.reqBody);
        let res = await compile(cmd);

        kit.logs("compiled:", cmd.path, res.deps);

        res.depNodes = await * res.deps.map(async dep => {
            cmd.dir = kit.path.dirname(cmd.path);
            cmd.path = dep;
            let out = await kit.request({
                // For demo, here we randomly select a node.
                url: `http://${_.sample(conf.nodes)}/compile`,
                reqData: JSON.stringify(cmd)
            });

            return JSON.parse(out);
        });

        $.body = res;
    } catch (err) {
        $.body = err.stack;
    }
};
