import kit from "nokit";
import compile from "./compile";

let proxy = kit.require("proxy");
let { _ } = kit;

export default async (conf) => {
    let app = proxy.flow();

    app.push(
        proxy.body(),

        proxy.select(proxy.match("/compile"), async $ => {
            try {
                let cmd = JSON.parse($.reqBody);
                let res = await compile(cmd);

                kit.logs("compiled:", cmd.path, res.deps);

                res.depNodes = await * res.deps.map(async dep => {
                    cmd.path = dep;
                    let out = await kit.request({
                        url: `http://${_.sample(conf.nodes)}/compile`,
                        reqData: JSON.stringify(cmd)
                    });

                    return JSON.parse(out);
                });

                $.body = res;
            } catch (err) {
                $.body = err.stack;
            }
        }),

        proxy.select(proxy.match("/src"), $ => {
            $.body = kit.readFile($.reqBody + "");
        })
    );

    kit.logs("pid:", process.pid);
    kit.logs("nodes:", conf.nodes);
    kit.logs("listen:", conf.port);
    await app.listen(conf.port);
};
