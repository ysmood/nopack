import kit from "nokit";

export default (task, option) => {
    option("-g, --grep <.*>", "unit test regex filter", ".*");

    task("default build", "build project", () => {
        return kit.spawn("babel", [
            "--optional", "runtime",
            "-d", "lib", "src"
        ]);
    });

    task("test", "test project", (opts) => {
        return kit.spawn("junit", [
            "-g", opts.grep,
            "test/basic.js"
        ]);
    });
};
