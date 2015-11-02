import cmder from "commander";
import nopack from "./";

let cwd = process.cwd();

cmder
    .option("-c, --config <path>", "the path of the config file", "nopack.js")
    .parse(process.argv);

let conf = require(`${cwd}/${cmder.config}`);

nopack(conf);
