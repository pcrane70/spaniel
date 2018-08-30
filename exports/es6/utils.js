export function entrySatisfiesRatio(entry, threshold) {
    var boundingClientRect = entry.boundingClientRect, intersectionRatio = entry.intersectionRatio;
    // Edge case where item has no actual area
    if (boundingClientRect.width === 0 || boundingClientRect.height === 0) {
        var boundingClientRect_1 = entry.boundingClientRect, intersectionRect = entry.intersectionRect;
        return boundingClientRect_1.left === intersectionRect.left &&
            boundingClientRect_1.top === intersectionRect.top &&
            intersectionRect.width >= 0 &&
            intersectionRect.height >= 0;
    }
    else {
        return intersectionRatio > threshold || (intersectionRatio === 1 && threshold === 1);
    }
}
export function getBoundingClientRect(element) {
    try {
        return element.getBoundingClientRect();
    }
    catch (e) {
        if (typeof e === 'object' && e !== null && (e.number & 0xFFFF) === 16389) {
            return { top: 0, bottom: 0, left: 0, width: 0, height: 0, right: 0, x: 0, y: 0 };
        }
        else {
            throw e;
        }
    }
}
export function throttle(cb, thottleDelay, scope) {
    if (thottleDelay === void 0) { thottleDelay = 5; }
    if (scope === void 0) { scope = window; }
    var cookie;
    return function () {
        scope.clearTimeout(cookie);
        cookie = scope.setTimeout(cb, thottleDelay);
    };
}
//# sourceMappingURL=utils.js.map