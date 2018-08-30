import { EngineInterface, SchedulerInterface, ElementSchedulerInterface, FrameInterface, QueueInterface, MetaInterface } from './interfaces';
import { default as Queue, DOMQueue } from './queue';
export declare class Frame implements FrameInterface {
    timestamp: number;
    scrollTop: number;
    scrollLeft: number;
    width: number;
    height: number;
    x: number;
    y: number;
    top: number;
    left: number;
    constructor(timestamp: number, scrollTop: number, scrollLeft: number, width: number, height: number, x: number, y: number, top: number, left: number);
    static generate(root?: Element | Window): Frame;
    static revalidateRootMeta(root?: any): MetaInterface;
}
export declare function generateToken(): string;
export declare abstract class BaseScheduler {
    protected root: Element | Window;
    protected engine: EngineInterface;
    protected queue: QueueInterface;
    protected isTicking: Boolean;
    protected toRemove: Array<string | Element | Function>;
    protected id?: string;
    constructor(customEngine?: EngineInterface, root?: Element | Window);
    protected abstract applyQueue(frame: Frame): void;
    protected tick(): void;
    scheduleWork(callback: Function): void;
    scheduleRead(callback: Function): void;
    queryElement(el: Element, callback: (clientRect: ClientRect, frame: Frame) => void): void;
    unwatch(id: string | Element | Function): void;
    unwatchAll(): void;
    startTicking(): void;
}
export declare class Scheduler extends BaseScheduler implements SchedulerInterface {
    protected queue: Queue;
    applyQueue(frame: Frame): void;
    watch(callback: (frame: FrameInterface) => void): string;
}
export declare class PredicatedScheduler extends Scheduler implements SchedulerInterface {
    predicate: (frame: Frame) => Boolean;
    constructor(predicate: (frame: Frame) => Boolean);
    applyQueue(frame: Frame): void;
}
export declare class ElementScheduler extends BaseScheduler implements ElementSchedulerInterface {
    protected queue: DOMQueue;
    protected lastVersion: number;
    protected ALLOW_CACHED_SCHEDULER: boolean;
    constructor(customEngine?: EngineInterface, root?: Element | Window, ALLOW_CACHED_SCHEDULER?: boolean);
    readonly isDirty: boolean;
    applyQueue(frame: Frame): void;
    watch(el: Element, callback: (frame: FrameInterface, id: string, clientRect?: ClientRect | null) => void, id?: string): string;
}
export declare function getGlobalScheduler(): Scheduler;
