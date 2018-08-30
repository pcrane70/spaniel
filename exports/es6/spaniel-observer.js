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
import { SpanielIntersectionObserver } from './intersection-observer';
import w from './metal/window-proxy';
import { generateToken, on, off, scheduleWork } from './metal/index';
var emptyRect = { x: 0, y: 0, width: 0, height: 0 };
export function DOMMarginToRootMargin(d) {
    return d.top + "px " + d.right + "px " + d.bottom + "px " + d.left + "px";
}
var SpanielObserver = /** @class */ (function () {
    function SpanielObserver(callback, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.paused = false;
        this.queuedEntries = [];
        this.recordStore = {};
        this.callback = callback;
        var root = options.root, rootMargin = options.rootMargin, threshold = options.threshold, ALLOW_CACHED_SCHEDULER = options.ALLOW_CACHED_SCHEDULER;
        rootMargin = rootMargin || '0px';
        var convertedRootMargin = typeof rootMargin !== 'string' ? DOMMarginToRootMargin(rootMargin) : rootMargin;
        this.thresholds = threshold.sort(function (t) { return t.ratio; });
        var o = {
            root: root,
            rootMargin: convertedRootMargin,
            threshold: this.thresholds.map(function (t) { return t.ratio; }),
            ALLOW_CACHED_SCHEDULER: ALLOW_CACHED_SCHEDULER
        };
        this.observer = new SpanielIntersectionObserver(function (records) { return _this.internalCallback(records); }, o);
        this.onTabHidden = this._onTabHidden.bind(this);
        this.onWindowClosed = this._onWindowClosed.bind(this);
        this.onTabShown = this._onTabShown.bind(this);
        if (w.hasDOM) {
            on('beforeunload', this.onWindowClosed);
            on('hide', this.onTabHidden);
            on('show', this.onTabShown);
        }
    }
    SpanielObserver.prototype._onWindowClosed = function () {
        this.onTabHidden();
    };
    SpanielObserver.prototype.setAllHidden = function () {
        var ids = Object.keys(this.recordStore);
        var time = Date.now();
        for (var i = 0; i < ids.length; i++) {
            this.handleRecordExiting(this.recordStore[ids[i]], time);
        }
        this.flushQueuedEntries();
    };
    SpanielObserver.prototype._onTabHidden = function () {
        this.paused = true;
        this.setAllHidden();
    };
    SpanielObserver.prototype._onTabShown = function () {
        this.paused = false;
        var ids = Object.keys(this.recordStore);
        var time = Date.now();
        for (var i = 0; i < ids.length; i++) {
            var entry = this.recordStore[ids[i]].lastSeenEntry;
            if (entry) {
                var intersectionRatio = entry.intersectionRatio, boundingClientRect = entry.boundingClientRect, rootBounds = entry.rootBounds, intersectionRect = entry.intersectionRect, target = entry.target;
                this.handleObserverEntry({
                    intersectionRatio: intersectionRatio,
                    boundingClientRect: boundingClientRect,
                    time: time,
                    rootBounds: rootBounds,
                    intersectionRect: intersectionRect,
                    target: target
                });
            }
        }
    };
    SpanielObserver.prototype.internalCallback = function (records) {
        records.forEach(this.handleObserverEntry.bind(this));
    };
    SpanielObserver.prototype.flushQueuedEntries = function () {
        if (this.queuedEntries.length > 0) {
            this.callback(this.queuedEntries);
            this.queuedEntries = [];
        }
    };
    SpanielObserver.prototype.generateSpanielEntry = function (entry, state) {
        var intersectionRatio = entry.intersectionRatio, time = entry.time, rootBounds = entry.rootBounds, boundingClientRect = entry.boundingClientRect, intersectionRect = entry.intersectionRect, target = entry.target;
        var record = this.recordStore[target.__spanielId];
        return {
            intersectionRatio: intersectionRatio,
            time: time,
            rootBounds: rootBounds,
            boundingClientRect: boundingClientRect,
            intersectionRect: intersectionRect,
            target: target,
            duration: 0,
            entering: null,
            payload: record.payload,
            label: state.threshold.label
        };
    };
    SpanielObserver.prototype.handleRecordExiting = function (record, time) {
        var _this = this;
        if (time === void 0) { time = Date.now(); }
        record.thresholdStates.forEach(function (state) {
            _this.handleThresholdExiting({
                intersectionRatio: -1,
                time: time,
                payload: record.payload,
                label: state.threshold.label,
                entering: false,
                rootBounds: emptyRect,
                boundingClientRect: emptyRect,
                intersectionRect: emptyRect,
                duration: time - state.lastVisible,
                target: record.target
            }, state);
            state.lastSatisfied = false;
            state.visible = false;
            state.lastEntry = null;
        });
    };
    SpanielObserver.prototype.handleThresholdExiting = function (spanielEntry, state) {
        var time = spanielEntry.time, intersectionRatio = spanielEntry.intersectionRatio;
        var hasTimeThreshold = !!state.threshold.time;
        if (state.lastSatisfied && (!hasTimeThreshold || (hasTimeThreshold && state.visible))) {
            // Make into function
            spanielEntry.duration = time - state.lastVisible;
            spanielEntry.entering = false;
            state.visible = false;
            this.queuedEntries.push(spanielEntry);
        }
        clearTimeout(state.timeoutId);
    };
    SpanielObserver.prototype.handleObserverEntry = function (entry) {
        var _this = this;
        var time = entry.time;
        var target = entry.target;
        var record = this.recordStore[target.__spanielId];
        record.lastSeenEntry = entry;
        if (!this.paused) {
            record.thresholdStates.forEach(function (state) {
                // Find the thresholds that were crossed. Since you can have multiple thresholds
                // for the same ratio, could be multiple thresholds
                var hasTimeThreshold = !!state.threshold.time;
                var spanielEntry = _this.generateSpanielEntry(entry, state);
                var ratioSatisfied = entrySatisfiesRatio(entry, state.threshold.ratio);
                if (ratioSatisfied && !state.lastSatisfied) {
                    spanielEntry.entering = true;
                    if (hasTimeThreshold) {
                        state.lastVisible = time;
                        var timerId = Number(setTimeout(function () {
                            state.visible = true;
                            spanielEntry.duration = Date.now() - state.lastVisible;
                            _this.callback([spanielEntry]);
                        }, state.threshold.time));
                        state.timeoutId = timerId;
                    }
                    else {
                        state.visible = true;
                        _this.queuedEntries.push(spanielEntry);
                    }
                }
                else if (!ratioSatisfied) {
                    _this.handleThresholdExiting(spanielEntry, state);
                }
                state.lastEntry = entry;
                state.lastSatisfied = ratioSatisfied;
            });
            this.flushQueuedEntries();
        }
    };
    SpanielObserver.prototype.disconnect = function () {
        this.setAllHidden();
        this.observer.disconnect();
        this.recordStore = {};
    };
    /*
     * Must be called when the SpanielObserver is done being used.
     * This will prevent memory leaks.
     */
    SpanielObserver.prototype.destroy = function () {
        this.disconnect();
        if (w.hasDOM) {
            off('beforeunload', this.onWindowClosed);
            off('hide', this.onTabHidden);
            off('show', this.onTabShown);
        }
    };
    SpanielObserver.prototype.unobserve = function (element) {
        var _this = this;
        var record = this.recordStore[element.__spanielId];
        if (record) {
            delete this.recordStore[element.__spanielId];
            this.observer.unobserve(element);
            scheduleWork(function () {
                _this.handleRecordExiting(record);
                _this.flushQueuedEntries();
            });
        }
    };
    SpanielObserver.prototype.observe = function (target, payload) {
        if (payload === void 0) { payload = null; }
        var trackedTarget = target;
        var id = trackedTarget.__spanielId = trackedTarget.__spanielId || generateToken();
        this.recordStore[id] = {
            target: trackedTarget,
            payload: payload,
            lastSeenEntry: null,
            thresholdStates: this.thresholds.map(function (threshold) { return ({
                lastSatisfied: false,
                lastEntry: null,
                threshold: threshold,
                visible: false,
                lastVisible: null
            }); })
        };
        this.observer.observe(trackedTarget);
        return id;
    };
    return SpanielObserver;
}());
export { SpanielObserver };
//# sourceMappingURL=spaniel-observer.js.map