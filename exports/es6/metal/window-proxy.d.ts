import { MetaInterface } from './interfaces';
interface WindowProxy {
    hasDOM: boolean;
    hasRAF: boolean;
    getScrollTop: Function;
    getScrollLeft: Function;
    getHeight: Function;
    getWidth: Function;
    rAF: Function;
    meta: MetaInterface;
    version: number;
    lastVersion: number;
    updateMeta: Function;
    isDirty: boolean;
}
declare let W: WindowProxy;
export declare function invalidate(): void;
export { WindowProxy };
export default W;
