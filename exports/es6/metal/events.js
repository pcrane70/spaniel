/*
Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
Version 2.0 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License
at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*/
import { Frame, PredicatedScheduler, FunctionQueue, getGlobalScheduler } from './index';
import w from './window-proxy';
var GenericEventRecord = /** @class */ (function () {
    function GenericEventRecord() {
        this.queue = new FunctionQueue();
    }
    GenericEventRecord.prototype.listen = function (callback) {
        this.queue.push(callback);
    };
    GenericEventRecord.prototype.unlisten = function (callback) {
        this.queue.remove(callback);
    };
    GenericEventRecord.prototype.trigger = function (value) {
        for (var i = 0; i < this.queue.items.length; i++) {
            this.queue.items[i](value);
        }
    };
    return GenericEventRecord;
}());
var RAFEventRecord = /** @class */ (function () {
    function RAFEventRecord(predicate) {
        this.scheduler = new PredicatedScheduler(predicate.bind(this));
    }
    RAFEventRecord.prototype.trigger = function (value) { };
    RAFEventRecord.prototype.listen = function (callback) {
        this.state = Frame.generate();
        this.scheduler.watch(callback);
    };
    RAFEventRecord.prototype.unlisten = function (cb) {
        this.scheduler.unwatch(cb);
    };
    return RAFEventRecord;
}());
var eventStore = null;
function getEventStore() {
    return eventStore || (eventStore = {
        scroll: new RAFEventRecord(function (frame) {
            var _a = this.state, scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
            this.state = frame;
            return scrollTop !== frame.scrollTop || scrollLeft !== frame.scrollLeft;
        }),
        resize: new RAFEventRecord(function (frame) {
            var _a = this.state, width = _a.width, height = _a.height;
            this.state = frame;
            return height !== frame.height || width !== frame.width;
        }),
        destroy: new GenericEventRecord(),
        beforeunload: new GenericEventRecord(),
        hide: new GenericEventRecord(),
        show: new GenericEventRecord()
    });
}
if (w.hasDOM) {
    window.addEventListener('beforeunload', function (e) {
        // First fire internal event to fire any observer callbacks
        trigger('beforeunload');
        // Then fire external event to allow flushing of any beacons
        trigger('destroy');
    });
    document.addEventListener('visibilitychange', function onVisibilityChange() {
        if (document.visibilityState === 'visible') {
            trigger('show');
        }
        else {
            trigger('hide');
        }
    });
}
export function on(eventName, callback) {
    var evt = getEventStore()[eventName];
    if (evt) {
        evt.listen(callback);
    }
}
export function off(eventName, callback) {
    if (eventStore) {
        var evt = eventStore[eventName];
        if (evt) {
            evt.unlisten(callback);
        }
    }
}
export function trigger(eventName, value) {
    if (eventStore) {
        var evt = eventStore[eventName];
        if (evt) {
            evt.trigger(value);
        }
    }
}
/**
 * Schedule a callback to be batched along with other DOM read/query work.
 * Use to schedule any DOM reads. Doing so will avoid DOM thrashing.
 */
export function scheduleWork(callback) {
    getGlobalScheduler().scheduleWork(callback);
}
/**
 * Schedule a callback to be batched along with other DOM write/mutation
 * work. Use to schedule any DOM changes. Doing so will avoid DOM thrashing.
 */
export function scheduleRead(callback) {
    getGlobalScheduler().scheduleRead(callback);
}
//# sourceMappingURL=events.js.map