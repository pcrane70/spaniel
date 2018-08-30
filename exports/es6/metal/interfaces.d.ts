export interface QueueElementInterface {
    callback: (frame: FrameInterface, id: string) => void;
    id: string;
}
export interface QueueDOMElementInterface {
    id: string;
    callback: (frame: FrameInterface, id: string, clientRect: ClientRect) => void;
    el: Element;
    clientRect: ClientRect;
}
export interface QueueInterface {
    push: (element: QueueElementInterface) => void;
    isEmpty: () => Boolean;
    remove: (id: string | Element | Function) => void;
    clear: () => void;
}
export interface EngineInterface {
    scheduleRead: (callback: Function) => void;
    scheduleWork: (callback: Function) => void;
}
export interface BaseSchedulerInterface {
    scheduleRead: (callback: Function) => void;
    scheduleWork: (callback: Function) => void;
}
export interface SchedulerInterface extends BaseSchedulerInterface {
    watch: (callback: (frame: FrameInterface) => void) => string;
}
export interface ElementSchedulerInterface extends BaseSchedulerInterface {
    watch: (el: Element, callback: (frame: FrameInterface, id: string, clientRect: ClientRect) => void, id?: string) => string;
}
export interface FrameInterface {
    timestamp: number;
    scrollTop: number;
    scrollLeft: number;
    width: number;
    height: number;
    x: number;
    y: number;
    top: number;
    left: number;
}
export interface MetaInterface {
    scrollTop: number;
    scrollLeft: number;
    width: number;
    height: number;
    x: number;
    y: number;
    top: number;
    left: number;
}
export interface SpanielClientRectInterface {
    width: number;
    height: number;
    x: number;
    y: number;
    bottom: number;
    top: number;
    left: number;
    right: number;
}
