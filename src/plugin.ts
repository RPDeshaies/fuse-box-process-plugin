const spawn: any = require('child_process').spawn;

interface IDictionary<T> {
    [key: string]: T;
}

interface IProcessDetail {
    processName: string;
    processArgs: Array<string>;
    verbose: boolean;
}

interface IProcess {
    process: any;
    detail: IProcessDetail;
}

type IProcessHash = IDictionary<IProcess>;

interface IOptions {
    process: Array<IProcessDetail>;
}

class ProcessPluginClass {
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
            process: spawn(detail.processName, detail.processArgs),
            detail
        };
        if (detail.verbose) {
            process.process.stdout.on('data', (data: BufferSource) => {
                console.log(data.toString());
            });
            process.process.stderr.on('data', (data: BufferSource) => {
                console.log(data.toString());
            });
        }
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

