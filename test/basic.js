import kit from "nokit";
import { spawn } from "child_process";

let startService = (path) => {
    return new Promise((resolve, reject) => {
        let p = spawn("babel-node", [
            "src/cli.js", "-c", path
        ]);

        p.on("error", (err) => {
            reject(err);
        });
        p.stderr.on("data", (c) => {
            process.stderr.write(c);
        });
        p.on("exit", reject);

        let pid;
        p.stdout.on("data", (c) => {
            process.stdout.write(c);
            c = c + "";
            let pm = c.match(/] pid: (\d+)/);
            if (pm)
                pid = pm[1];

            if (/] listen: \d{4}/.test(c))
                resolve(pid);
        });
    });
};

let killall = (pids) => pids.forEach(pid => spawn("kill", [pid]));

export default async (it) => {
    await it.describe("baisc", async (it) => {
        await it("simple compile js", async () => {

            let pids = await * [
                startService("test/nopack.0.js"),
                startService("test/nopack.1.js")
            ];

            let url = "http://127.0.0.1:8070/";
            let path = kit.path.resolve("test/fixtures/index.js");

            let cmd = {
                root: "127.0.0.1:8070",
                path: path,
                loaders: [
                    {
                        ext: ".js",
                        loader: kit.path.resolve("test/babel-loader.js")
                    }
                ]
            };

            try {
                let res = await kit.request({
                    url: url + "compile",
                    reqData: JSON.stringify(cmd)
                });
                kit.logs("test result:", JSON.parse(res));
            } catch (err) {
                kit.err(err);
            } finally {
                killall(pids);
            }
        });
    });
};
