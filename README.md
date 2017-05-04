# fuse-box-process-plugin
[![npm](https://img.shields.io/npm/v/fuse-box-process-plugin.svg?style=flat-square)](https://www.npmjs.com/package/fuse-box-process-plugin)
[![license](https://img.shields.io/github/license/RPDeshaies/fuse-box-process-plugin.svg?style=flat-square)](https://github.com/RPDeshaies/fuse-box-process-plugin/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/fuse-box-process-plugin.svg?style=flat-square)](https://www.npmjs.com/package/fuse-box-process-plugin)

A Plugin for fuse-box that gives you the ability to 
 run any tasks (npm, tsc, etc.) after fuse-box bundled your code

## Installation
```
npm install fuse-box-process-plugin --save-dev
```

## API
```
ProcessPlugin({
    process: [{
            processKey: '', // Uniq key that represent this process
            processName: '', // Name of the process to execute
            processArgs: Array<string>, // Args to pass to the process
            verbose: true, // If the process needs to log to the console
            child : IProcessDetail // Any child process that needs to be executed once the parent as `exit`
        } : IProcessDetail
    ]
}),
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
                    processKey: 'npm run lint',
                    processName: 'npm',
                    processArgs: ['run', 'lint'],
                    verbose: true,
                },
                {
                    processKey: 'npm run server',
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
                    processKey: 'npm run lint',
                    processName: isWindows ? 'npm.cmd' : 'npm',
                    processArgs: ['run', 'lint'],
                    verbose: true,
                },
                {
                    processKey: 'npm run server',
                    processName: isWindows ? 'npm.cmd' : 'npm',
                    processArgs: ['run', 'server'],
                    verbose: false,
                },
            ]
        }),
    ]
});
```
