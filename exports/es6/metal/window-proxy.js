/*
Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
Version 2.0 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License
at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*/
var nop = function () { return 0; };
var hasDOM = !!((typeof window !== 'undefined') && window && (typeof document !== 'undefined') && document);
var hasRAF = hasDOM && !!window.requestAnimationFrame;
var W = {
    hasDOM: hasDOM,
    hasRAF: hasRAF,
    getScrollTop: nop,
    getScrollLeft: nop,
    getHeight: nop,
    getWidth: nop,
    rAF: hasRAF ? window.requestAnimationFrame.bind(window) : function (callback) { callback(); },
    meta: {
        width: 0,
        height: 0,
        scrollTop: 0,
        scrollLeft: 0,
        x: 0,
        y: 0,
        top: 0,
        left: 0
    },
    version: 0,
    lastVersion: 0,
    updateMeta: nop,
    get isDirty() {
        return W.version !== W.lastVersion;
    }
};
export function invalidate() {
    ++W.version;
}
// Init after DOM Content has loaded
function hasDomSetup() {
    var se = document.scrollingElement != null;
    W.getScrollTop = se ? function () { return document.scrollingElement.scrollTop; } : function () { return window.scrollY; };
    W.getScrollLeft = se ? function () { return document.scrollingElement.scrollLeft; } : function () { return window.scrollX; };
}
if (hasDOM) {
    // Set the height and width immediately because they will be available at this point
    W.getHeight = function () { return window.innerHeight; };
    W.getWidth = function () { return window.innerWidth; };
    W.updateMeta = function () {
        W.meta.height = W.getHeight();
        W.meta.width = W.getWidth();
        W.meta.scrollLeft = W.getScrollLeft();
        W.meta.scrollTop = W.getScrollTop();
        W.lastVersion = W.version;
    };
    W.updateMeta();
    if (document.readyState !== 'loading') {
        hasDomSetup();
    }
    else {
        document.addEventListener('DOMContentLoaded', hasDomSetup);
    }
    window.addEventListener('resize', invalidate, false);
    window.addEventListener('scroll', invalidate, false);
}
export default W;
//# sourceMappingURL=window-proxy.js.map