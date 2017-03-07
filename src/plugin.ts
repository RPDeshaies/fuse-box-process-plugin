const spawn: any = require('child_process').spawn;
const kill: any = require('tree-kill');

export interface IDictionary<T> {
    [key: string]: T;
}

export interface IProcessDetail {
    /**
     * Uniq key that represent this process
     */
    processKey: string;
    /**
     * Name of the process to execute
     */
    processName: string;
    /**
     * Args to pass to the process
     */
    processArgs: Array<string>;
    /**
     * If the process needs to log to the console
     */
    verbose: boolean;
    /**
     * Any child process that needs to be executed once the parent as `exit`
     */
    child?: IProcessDetail;
}

export interface IProcessInstance {
    pid: number;
    on: Function;
}

export interface IProcess {
    instance: IProcessInstance;
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
            this.startProcess(detail);
        });
    }
    stop(): void {
        for (const key in this.processList) {
            kill(this.processList[key].instance.pid);
            logProcess('Killed', this.processList[key].detail, this.processList[key].instance);
            delete this.processList[key];
        }
    }
    postBundle(context: any): void {
        this.stop();
        this.start();
    }
    private startProcess(detail: IProcessDetail): void {
        logDetail('Starting', detail);
        const instance: any = this.createProcess(detail);

        instance.on('close', (code: any, signal: any) => {
            logProcess('Finished', detail, instance);
            delete this.processList[detail.processKey];
        });

        this.processList[detail.processKey] = {
            instance,
            detail,
        };

        if (detail.child) {
            this.processList[detail.processKey].instance.on('exit', (code: any, signal: any) => {
                console.log(`Parent "${detail.processKey}" is finished. Starting "${detail.child.processKey}"`);
                this.startProcess(detail.child);
            });
        }
    }
    private createProcess(detail: IProcessDetail): IProcess {
        const instance: any = spawnProcess(detail.processName, detail.processArgs, detail.verbose);
        return instance;
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

function logProcess(action: string, detail: IProcessDetail, instance: IProcessInstance): void {
    console.log(`${action} "${detail.processKey}" (pid : ${instance.pid})`);
}

function logDetail(action: string, detail: IProcessDetail): void {
    console.log(`${action} "${detail.processKey}"`);
}