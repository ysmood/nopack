import kit from "nokit";
import compile from "./compile";
import tcenter from "./tcenter";

let { flow, select, match, body } = kit.require("proxy");

export default async (conf) => {
    let app = flow();

    app.push(
        body(),

        select(match("/compile"), compile(conf)),

        select(match("/tcenter"), tcenter(conf))
    );

    kit.logs("pid:", process.pid);
    kit.logs("nodes:", conf.nodes);
    kit.logs("listen:", conf.port);

    await app.listen(conf.port);
};
