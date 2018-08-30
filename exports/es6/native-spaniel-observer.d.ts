import { DOMString, DOMMargin, SpanielObserverInterface, SpanielThreshold, SpanielObserverInit, SpanielRecord, SpanielObserverEntry, SpanielTrackedElement, IntersectionObserverClass } from './interfaces';
export declare function DOMMarginToRootMargin(d: DOMMargin): DOMString;
export declare class SpanielObserver implements SpanielObserverInterface {
    callback: (entries: SpanielObserverEntry[]) => void;
    observer: IntersectionObserver;
    thresholds: SpanielThreshold[];
    recordStore: {
        [key: string]: SpanielRecord;
    };
    queuedEntries: SpanielObserverEntry[];
    private paused;
    constructor(ObserverClass: IntersectionObserverClass, callback: (entries: SpanielObserverEntry[]) => void, options?: SpanielObserverInit);
    private onWindowClosed();
    private setAllHidden();
    private onTabHidden();
    private onTabShown();
    private internalCallback(records);
    private flushQueuedEntries();
    private generateSpanielEntry(entry, state);
    private handleRecordExiting(record, time?);
    private handleThresholdExiting(spanielEntry, state);
    private handleObserverEntry(entry);
    disconnect(): void;
    unobserve(element: SpanielTrackedElement): void;
    observe(target: Element, payload?: any): string;
}
