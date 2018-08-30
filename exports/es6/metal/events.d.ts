import { FrameInterface } from './interfaces';
export declare function on(eventName: string, callback: (frame: FrameInterface, id: string) => void): void;
export declare function off(eventName: string, callback: Function): void;
export declare function trigger(eventName: string, value?: any): void;
/**
 * Schedule a callback to be batched along with other DOM read/query work.
 * Use to schedule any DOM reads. Doing so will avoid DOM thrashing.
 */
export declare function scheduleWork(callback: Function): void;
/**
 * Schedule a callback to be batched along with other DOM write/mutation
 * work. Use to schedule any DOM changes. Doing so will avoid DOM thrashing.
 */
export declare function scheduleRead(callback: Function): void;
