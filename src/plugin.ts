const spawn: any = require('child_process').spawn;

export interface IDictionary<T> {
    [key: string]: T;
}

export interface IProcessDetail {
    processName: string;
    processArgs: Array<string>;
    verbose: boolean;
}

export interface IProcess {
    process: any;
    detail: IProcessDetail;
}

export type IProcessHash = IDictionary<IProcess>;

export interface IOptions {
    process: Array<IProcessDetail>;
}

export class ProcessPluginClass {
    test: RegExp;
    opts: IOptions;
    processList: IProcessHash = {};
    constructor(opts: IOptions) {
        this.opts = opts;
    };
    start(): void {
        this.opts.process.forEach(detail => {
            console.log(`Starting ${detail.processName} [${detail.processArgs}]...`);
            const process: IProcess = this.createProcess(detail);
            this.processList[detail.processName] = process;
        });
    }
    stop(): void {
        for (const key in this.processList) {
            const detail: IProcessDetail = this.processList[key].detail;
            console.log(`Killing ${detail.processName} [${detail.processArgs}]...`);
            this.processList[key].process.kill();
            delete this.processList[key];
        }
    }
    postBundle(context: any): void {
        this.stop();
        this.start();
    }
    createProcess(detail: IProcessDetail): IProcess {
        const process: IProcess = {
            process: spawnProcess(detail.processName, detail.processArgs, detail.verbose),
            detail
        };
        process.process.on('close', (code: any, signal: any) => {
            console.log(`Finished ${detail.processName} [${detail.processArgs}]...`);
            delete this.processList[detail.processName];
        });
        return process;
    }
}

export function ProcessPlugin(options: IOptions): ProcessPluginClass {
    return new ProcessPluginClass(options);
};

function spawnProcess(processName: string, processArgs: Array<string>, verbose: boolean): any {
    if (verbose) {
        return spawn(processName, processArgs, { stdio: 'inherit' });
    }
    return spawn(processName, processArgs);
}
