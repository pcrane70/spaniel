/*
Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
Version 2.0 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License
at http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*/
import { entrySatisfiesRatio } from './utils';
import { ElementScheduler, generateToken } from './metal/index';
function marginToRect(margin) {
    var left = margin.left, right = margin.right, top = margin.top, bottom = margin.bottom;
    return {
        left: left,
        top: top,
        bottom: bottom,
        right: right,
        width: right - left,
        height: bottom - top
    };
}
function rootMarginToDOMMargin(rootMargin) {
    var c = rootMargin.split(' ').map(function (n) { return parseInt(n, 10); });
    switch (c.length) {
        case 2:
            return { top: c[0], left: c[1], bottom: c[0], right: c[1] };
        case 3:
            return { top: c[0], left: c[1], bottom: c[2], right: c[1] };
        case 4:
            return { top: c[0], left: c[1], bottom: c[2], right: c[3] };
        default:
            return { top: 0, left: 0, bottom: 0, right: 0 };
    }
}
var SpanielIntersectionObserver = /** @class */ (function () {
    function SpanielIntersectionObserver(callback, options) {
        if (options === void 0) { options = {}; }
        this.records = {};
        this.callback = callback;
        this.id = generateToken();
        options.threshold = options.threshold || 0;
        this.rootMarginObj = rootMarginToDOMMargin(options.rootMargin || '0px');
        this.root = options.root;
        if (Array.isArray(options.threshold)) {
            this.thresholds = options.threshold;
        }
        else {
            this.thresholds = [options.threshold];
        }
        this.scheduler = new ElementScheduler(null, this.root, options.ALLOW_CACHED_SCHEDULER);
    }
    SpanielIntersectionObserver.prototype.observe = function (target) {
        var _this = this;
        var trackedTarget = target;
        var id = trackedTarget.__spanielId = trackedTarget.__spanielId || generateToken();
        this.scheduler.watch(target, function (frame, id, clientRect) {
            _this.onTick(frame, id, clientRect, trackedTarget);
        }, trackedTarget.__spanielId);
        return id;
    };
    SpanielIntersectionObserver.prototype.onTick = function (frame, id, clientRect, el) {
        var _this = this;
        var _a = this.generateEntryEvent(frame, clientRect, el), numSatisfiedThresholds = _a.numSatisfiedThresholds, entry = _a.entry;
        var record = this.records[id] || (this.records[id] = {
            entry: entry,
            numSatisfiedThresholds: 0
        });
        if (numSatisfiedThresholds !== record.numSatisfiedThresholds) {
            record.numSatisfiedThresholds = numSatisfiedThresholds;
            this.scheduler.scheduleWork(function () {
                _this.callback([entry]);
            });
        }
    };
    SpanielIntersectionObserver.prototype.unobserve = function (target) {
        this.scheduler.unwatch(target.__spanielId);
        delete this.records[target.__spanielId];
    };
    SpanielIntersectionObserver.prototype.disconnect = function () {
        this.scheduler.unwatchAll();
        this.records = {};
    };
    SpanielIntersectionObserver.prototype.takeRecords = function () {
        return [];
    };
    SpanielIntersectionObserver.prototype.generateEntryEvent = function (frame, clientRect, el) {
        var count = 0;
        var entry = generateEntry(frame, clientRect, el, this.rootMarginObj);
        var ratio = entry.intersectionRatio;
        for (var i = 0; i < this.thresholds.length; i++) {
            var threshold = this.thresholds[i];
            if (entrySatisfiesRatio(entry, threshold)) {
                count++;
            }
        }
        return {
            numSatisfiedThresholds: count,
            entry: entry
        };
    };
    return SpanielIntersectionObserver;
}());
export { SpanielIntersectionObserver };
;
function addRatio(entryInit) {
    var time = entryInit.time, rootBounds = entryInit.rootBounds, boundingClientRect = entryInit.boundingClientRect, intersectionRect = entryInit.intersectionRect, target = entryInit.target;
    var boundingArea = boundingClientRect.height * boundingClientRect.width;
    var intersectionRatio = boundingArea > 0 ? (intersectionRect.width * intersectionRect.height) / boundingArea : 0;
    return {
        time: time, rootBounds: rootBounds, boundingClientRect: boundingClientRect, intersectionRect: intersectionRect, target: target, intersectionRatio: intersectionRatio
    };
}
/*
export class IntersectionObserverEntry implements IntersectionObserverEntryInit {
  time: DOMHighResTimeStamp;
  intersectionRatio: number;
  rootBounds: DOMRectReadOnly;
  boundingClientRect: DOMRectReadOnly;
  intersectionRect: DOMRectReadOnly;
  target: SpanielTrackedElement;

  constructor(entryInit: IntersectionObserverEntryInit) {
    this.time = entryInit.time;
    this.rootBounds = entryInit.rootBounds;
    this.boundingClientRect = entryInit.boundingClientRect;
    this.intersectionRect = entryInit.intersectionRect;
    this.target = entryInit.target;

    let {
      intersectionRect,
      boundingClientRect
    } = entryInit;
    let boundingArea = boundingClientRect.height * boundingClientRect.width;
    this.intersectionRatio = boundingArea > 0 ? (intersectionRect.width * intersectionRect.height) / boundingArea : 0;
  }
};
*/
export function generateEntry(frame, clientRect, el, rootMargin) {
    var top = clientRect.top, bottom = clientRect.bottom, left = clientRect.left, right = clientRect.right;
    var rootBounds = {
        left: frame.left + rootMargin.left,
        top: frame.top + rootMargin.top,
        bottom: rootMargin.bottom,
        right: rootMargin.right,
        width: frame.width - (rootMargin.right + rootMargin.left),
        height: frame.height - (rootMargin.bottom + rootMargin.top)
    };
    var intersectX = Math.max(rootBounds.left, clientRect.left);
    var intersectY = Math.max(rootBounds.top, clientRect.top);
    var width = Math.min(rootBounds.left + rootBounds.width, clientRect.right) - intersectX;
    var height = Math.min(rootBounds.top + rootBounds.height, clientRect.bottom) - intersectY;
    var intersectionRect = {
        left: width >= 0 ? intersectX : 0,
        top: intersectY >= 0 ? intersectY : 0,
        width: width,
        height: height,
        right: right,
        bottom: bottom
    };
    return addRatio({
        time: frame.timestamp,
        rootBounds: rootBounds,
        target: el,
        boundingClientRect: marginToRect(clientRect),
        intersectionRect: intersectionRect
    });
}
//# sourceMappingURL=intersection-observer.js.map