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
export declare type IProcessHash = IDictionary<IProcess>;
export interface IOptions {
    process: Array<IProcessDetail>;
}
export declare class ProcessPluginClass {
    test: RegExp;
    opts: IOptions;
    processList: IProcessHash;
    constructor(opts: IOptions);
    start(): void;
    stop(): void;
    postBundle(context: any): void;
    createProcess(detail: IProcessDetail): IProcess;
}
export declare function ProcessPlugin(options: IOptions): ProcessPluginClass;
