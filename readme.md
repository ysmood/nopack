# Overview

A distributed build program.

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


### Loader

Each loader is a function:

```js
async function loader ({
    // The transaction id of a build task.
    id: String,

    // The body of the target to compile.
    src: Buffer,

    // The path of the target relative to the project.
    path: String
}) => {
    src: String | Buffer,
    deps: [String]
}
```
