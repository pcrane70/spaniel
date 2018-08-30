import { QueueElementInterface, QueueDOMElementInterface, FrameInterface } from './interfaces';
declare class QueueElement implements QueueElementInterface {
    callback: (frame: FrameInterface, id: string) => void;
    id: string;
}
export default QueueElement;
export declare class QueueDOMElement implements QueueDOMElementInterface {
    el: Element;
    callback: (frame: FrameInterface, id: string, clientRect: ClientRect) => void;
    id: string;
    clientRect: ClientRect;
}
