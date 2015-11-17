import esprima from "esprima";
import { transform } from "babel-core";

// A simple finite state machine.
let getDeps = (js) => {
    let state = 0;
    let token, dep;
    let deps = [];
    let tokens = esprima.tokenize(js);
    let index = 0;

    while (index < tokens.length) {
        token = tokens[index++];

        switch (token.type) {
        case "Identifier":
            if (state === 0 && token.value === "require")
                state = 1;
            else
                state = 0;
            break;

        case "Punctuator":
            if (state === 1 && token.value === "(")
                state = 2;
            else if (state === 3 && token.value === ")")
                state = 4;
            else
                state = 0;
            break;

        case "String":
            if (state === 2 && token.value) {
                dep = esprima.parse(token.value).body[0].expression.value;
                state = 3;
            }
            break;

        default:
            state = 0;
        }

        if (state === 4) {
            deps.push(dep);
        }
    }

    return deps;
};

export default (src) => {
    let es5 = transform(src + "").code;
    return {
        src: es5,
        deps: getDeps(es5)
    };
};
