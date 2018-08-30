import { SpanielIntersectionObserver } from './intersection-observer';
import { DOMString, DOMMargin, SpanielObserverInterface, SpanielThreshold, SpanielObserverInit, SpanielRecord, SpanielObserverEntry, SpanielTrackedElement } from './interfaces';
export declare function DOMMarginToRootMargin(d: DOMMargin): DOMString;
export declare class SpanielObserver implements SpanielObserverInterface {
    callback: (entries: SpanielObserverEntry[]) => void;
    observer: SpanielIntersectionObserver;
    thresholds: SpanielThreshold[];
    recordStore: {
        [key: string]: SpanielRecord;
    };
    queuedEntries: SpanielObserverEntry[];
    private paused;
    private onWindowClosed;
    private onTabHidden;
    private onTabShown;
    constructor(callback: (entries: SpanielObserverEntry[]) => void, options?: SpanielObserverInit);
    private _onWindowClosed();
    private setAllHidden();
    private _onTabHidden();
    private _onTabShown();
    private internalCallback(records);
    private flushQueuedEntries();
    private generateSpanielEntry(entry, state);
    private handleRecordExiting(record, time?);
    private handleThresholdExiting(spanielEntry, state);
    private handleObserverEntry(entry);
    disconnect(): void;
    destroy(): void;
    unobserve(element: SpanielTrackedElement): void;
    observe(target: Element, payload?: any): string;
}
