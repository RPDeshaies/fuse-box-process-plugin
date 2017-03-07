# fuse-box-process-plugin
A Plugin for fuse-box that gives you the ability to 
 run any tasks (npm, tsc, etc.) after fuse-box bundled your code

## Installation
```
npm install fuse-box-process-plugin --save-dev
```


## How to use 
To run npm tasks like `npm run lint` and `npm run server`

```
const ProcessPlugin = require('fuse-box-process-plugin').ProcessPlugin;

let fuse = new FuseBox({
    homeDir: "src/",
    sourcemaps: true,
    outFile: "./build/out.js",
    plugins: [
        ProcessPlugin({
            process: [{
                    processName: 'npm',
                    processArgs: ['run', 'lint'],
                    verbose: true,
                },
                {
                    processName: 'npm',
                    processArgs: ['run', 'server'],
                    verbose: false,
                },
            ]
        }),
    ]
});
```

## Typescript
I love Typescript, so this project also has typings !:)
```
import { ProcessPlugin } from 'fuse-box-process-plugin';
```

## Microsoft Windows...
For Microsoft windows, you might need to do something like this to run commands : 

```
const isWindows: boolean = /^win/.test(process.platform);

let fuse = new FuseBox({
    homeDir: "src/",
    sourcemaps: true,
    outFile: "./build/out.js",
    plugins: [
        ProcessPlugin({
            process: [{
                    processName: isWindows ? 'npm.cmd' : 'npm',
                    processArgs: ['run', 'lint'],
                    verbose: true,
                },
                {
                    processName: isWindows ? 'npm.cmd' : 'npm',
                    processArgs: ['run', 'server'],
                    verbose: false,
                },
            ]
        }),
    ]
});
```