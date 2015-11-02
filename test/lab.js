import esprima from "esprima";
import { transform } from "babel-core";
import kit from "nokit";

let { _ } = kit;
let src = kit.readFileSync("test/fixtures/index.js");
let es5 = transform(src + "").code;
let tokens = esprima.tokenize(es5);

_.each(tokens, token => {
    // A simple finite state machine.

    let state = 0;

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
        if (state === 2 && token.value)
            state = 3;
        break;

    default:
        state = 0;
    }
});

