# Overview

A distributed build program.

Read the files in the `doc/` folder for more design details of this project.


# Build Process

Here's the dependency tree:

```
       a
     /   \
    b     c
   / \     \
  c   d     f
```

The `a` is the root the of the whole process. Every sub build process, such as `b`, is a same build process of `a`.

## API


### Middlewares

Each middleware is a function:

```js
async function middleware ({
    // The transaction id of a build task.
    id: String,

    // The body of the target to compile.
    src: Buffer,

    // The path of the target relative to the project.
    path: String
}) => {
    // The compiled source.
    src: String | Buffer,

    // The dependencies of this source.
    deps: [String]
}
```
