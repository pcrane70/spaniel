import { QueueInterface, QueueElementInterface, QueueDOMElementInterface } from './interfaces';
export declare abstract class BaseQueue implements QueueInterface {
    protected items: Array<any>;
    constructor();
    abstract removePredicate(identifier: any, element: any): void;
    remove(identifier: string | Element | Function): void;
    clear(): void;
    push(element: any): void;
    isEmpty(): boolean;
}
export default class Queue extends BaseQueue implements QueueInterface {
    items: Array<QueueElementInterface>;
    removePredicate(identifier: string, element: QueueElementInterface): boolean;
}
export declare class FunctionQueue extends BaseQueue implements QueueInterface {
    items: Array<Function>;
    removePredicate(identifier: Function, element: Function): boolean;
}
export declare class DOMQueue extends BaseQueue implements QueueInterface {
    items: Array<QueueDOMElementInterface>;
    removePredicate(identifier: Element | string | Function, element: QueueDOMElementInterface): boolean;
}
