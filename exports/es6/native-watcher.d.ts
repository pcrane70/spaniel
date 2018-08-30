import { SpanielObserver } from './native-spaniel-observer';
import { DOMString, DOMMargin, SpanielTrackedElement, IntersectionObserverClass } from './interfaces';
export interface WatcherConfig {
    ratio?: number;
    time?: number;
    rootMargin?: DOMString | DOMMargin;
    root?: SpanielTrackedElement;
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
    constructor(ObserverClass: IntersectionObserverClass, config?: WatcherConfig);
    watch(el: Element, callback: WatcherCallback): void;
    unwatch(el: Element): void;
    disconnect(): void;
}
