import kit from "nokit";
import babelCompiler from "nopack-babel";

let src = kit.readFileSync("test/fixtures/index.js");

kit.logs(babelCompiler(src));
