import { EngineInterface } from './interfaces';
export declare class Engine implements EngineInterface {
    private reads;
    private work;
    private running;
    scheduleRead(callback: Function): void;
    scheduleWork(callback: Function): void;
    private run();
}
export declare function setGlobalEngine(engine: EngineInterface): boolean;
export declare function getGlobalEngine(): EngineInterface;
