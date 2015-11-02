import { transform } from "babel-core";
import esprima from "esprima";
import fsPath from "path";

export default ($) => {
    let res = transform($.src + "");

    let ast = esprima.parse(res.code);

    let ds = ast.body.filter(n => n.type === "VariableDeclaration");

    let deps = [];
    let dir = fsPath.dirname($.path);

    ds.forEach(d => {
        d.declarations.forEach(d => {
            let c = d.init.callee;
            if (c.type === "Identifier" && c.name === "require") {
                let p = d.init.arguments[0].value;
                if (!/\.js$/.test(p))
                    p = p + ".js";
                deps.push(fsPath.join(dir, p));
            }
        });
    });

    return {
        src: res.code,
        deps: deps
    };
};
