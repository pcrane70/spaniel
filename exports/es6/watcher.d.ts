import { SpanielObserver } from './spaniel-observer';
import { DOMString, DOMMargin, SpanielTrackedElement } from './interfaces';
export interface WatcherConfig {
    ratio?: number;
    time?: number;
    rootMargin?: DOMString | DOMMargin;
    root?: SpanielTrackedElement;
    ALLOW_CACHED_SCHEDULER?: boolean;
}
export declare type EventName = 'impressed' | 'exposed' | 'visible' | 'impression-complete';
export declare type WatcherCallback = (eventName: EventName, callback: WatcherCallbackOptions) => void;
export interface Threshold {
    label: EventName;
    time: number;
    ratio: number;
}
export interface WatcherCallbackOptions {
    duration: number;
    visibleTime?: number;
    boundingClientRect: DOMRectInit;
}
export declare class Watcher {
    observer: SpanielObserver;
    constructor(config?: WatcherConfig);
    watch(el: Element, callback: WatcherCallback): void;
    unwatch(el: Element): void;
    disconnect(): void;
    destroy(): void;
}
