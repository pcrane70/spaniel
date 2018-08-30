export interface SpanielTrackedElement extends Element {
    __spanielId: string;
}
export interface SpanielThreshold {
    label: string;
    ratio: number;
    time?: number;
}
export interface SpanielObserverInit {
    root?: SpanielTrackedElement;
    rootMargin?: DOMString | DOMMargin;
    threshold?: SpanielThreshold[];
    ALLOW_CACHED_SCHEDULER?: boolean;
}
export interface SpanielRecord {
    target: SpanielTrackedElement;
    payload: any;
    thresholdStates: SpanielThresholdState[];
    lastSeenEntry: IntersectionObserverEntry;
}
export interface SpanielThresholdState {
    lastSatisfied: Boolean;
    lastEntry: IntersectionObserverEntry;
    threshold: SpanielThreshold;
    lastVisible: number;
    visible: boolean;
    timeoutId?: number;
}
export interface SpanielIntersectionObserverEntryInit {
    time: DOMHighResTimeStamp;
    rootBounds: ClientRect;
    boundingClientRect: ClientRect;
    intersectionRect: ClientRect;
    target: SpanielTrackedElement;
}
export interface SpanielObserverEntry extends IntersectionObserverEntryInit {
    duration: number;
    intersectionRatio: number;
    entering: boolean;
    label?: string;
    payload?: any;
}
export interface IntersectionObserverClass {
    new (callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
}
export interface SpanielObserverInterface {
    disconnect: () => void;
    unobserve: (element: SpanielTrackedElement) => void;
    observe: (target: Element, payload: any) => string;
}
export declare type DOMString = string;
export declare type DOMHighResTimeStamp = number;
export interface DOMMargin {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export interface DOMRectReadOnly extends DOMRectInit, DOMMargin {
}
export interface IntersectionObserverInit {
    root?: SpanielTrackedElement;
    rootMargin?: DOMString;
    threshold?: number | number[];
    ALLOW_CACHED_SCHEDULER?: boolean;
}
