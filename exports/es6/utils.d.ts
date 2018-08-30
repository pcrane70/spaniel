import { SpanielClientRectInterface } from './metal/interfaces';
export declare function entrySatisfiesRatio(entry: IntersectionObserverEntry, threshold: number): boolean;
export declare function getBoundingClientRect(element: Element): SpanielClientRectInterface;
export declare function throttle(cb: Function, thottleDelay?: number, scope?: Window): () => void;
