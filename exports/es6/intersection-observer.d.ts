import { Frame } from './metal/index';
import { SpanielTrackedElement, DOMString, DOMRectReadOnly, IntersectionObserverInit, DOMMargin } from './interfaces';
export declare class SpanielIntersectionObserver implements IntersectionObserver {
    private id;
    private scheduler;
    private callback;
    root: SpanielTrackedElement;
    rootMargin: DOMString;
    protected rootMarginObj: DOMMargin;
    thresholds: number[];
    private records;
    observe(target: Element): string;
    private onTick(frame, id, clientRect, el);
    unobserve(target: SpanielTrackedElement): void;
    disconnect(): void;
    takeRecords(): IntersectionObserverEntry[];
    private generateEntryEvent(frame, clientRect, el);
    constructor(callback: Function, options?: IntersectionObserverInit);
}
export declare function generateEntry(frame: Frame, clientRect: DOMRectReadOnly, el: Element, rootMargin: DOMMargin): IntersectionObserverEntry;
