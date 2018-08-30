/*
Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
Version 2.0 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License
at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import W from './window-proxy';
import { default as Queue, DOMQueue } from './queue';
import { getGlobalEngine } from './engine';
import { getBoundingClientRect } from '../utils';
var TOKEN_SEED = 'xxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
var tokenCounter = 0;
var Frame = /** @class */ (function () {
    function Frame(timestamp, scrollTop, scrollLeft, width, height, x, y, top, left) {
        this.timestamp = timestamp;
        this.scrollTop = scrollTop;
        this.scrollLeft = scrollLeft;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.top = top;
        this.left = left;
    }
    Frame.generate = function (root) {
        if (root === void 0) { root = window; }
        var rootMeta = this.revalidateRootMeta(root);
        return new Frame(Date.now(), rootMeta.scrollTop, rootMeta.scrollLeft, rootMeta.width, rootMeta.height, rootMeta.x, rootMeta.y, rootMeta.top, rootMeta.left);
    };
    Frame.revalidateRootMeta = function (root) {
        if (root === void 0) { root = window; }
        var _clientRect = null;
        var _rootMeta = {
            width: 0,
            height: 0,
            scrollTop: 0,
            scrollLeft: 0,
            x: 0,
            y: 0,
            top: 0,
            left: 0
        };
        // if root is dirty update the cached values
        if (W.isDirty) {
            W.updateMeta();
        }
        if (root === window) {
            _rootMeta.height = W.meta.height;
            _rootMeta.width = W.meta.width;
            _rootMeta.scrollLeft = W.meta.scrollLeft;
            _rootMeta.scrollTop = W.meta.scrollTop;
            return _rootMeta;
        }
        _clientRect = getBoundingClientRect(root);
        _rootMeta.scrollTop = root.scrollTop;
        _rootMeta.scrollLeft = root.scrollLeft;
        _rootMeta.width = _clientRect.width;
        _rootMeta.height = _clientRect.height;
        _rootMeta.x = _clientRect.x;
        _rootMeta.y = _clientRect.y;
        _rootMeta.top = _clientRect.top;
        _rootMeta.left = _clientRect.left;
        return _rootMeta;
    };
    return Frame;
}());
export { Frame };
export function generateToken() {
    return tokenCounter++ + TOKEN_SEED;
}
var BaseScheduler = /** @class */ (function () {
    function BaseScheduler(customEngine, root) {
        if (root === void 0) { root = window; }
        this.isTicking = false;
        this.toRemove = [];
        if (customEngine) {
            this.engine = customEngine;
        }
        else {
            this.engine = getGlobalEngine();
        }
        this.root = root;
    }
    BaseScheduler.prototype.tick = function () {
        if (this.queue.isEmpty()) {
            this.isTicking = false;
        }
        else {
            if (this.toRemove.length > 0) {
                for (var i = 0; i < this.toRemove.length; i++) {
                    this.queue.remove(this.toRemove[i]);
                }
                this.toRemove = [];
            }
            this.applyQueue(Frame.generate(this.root));
            this.engine.scheduleRead(this.tick.bind(this));
        }
    };
    BaseScheduler.prototype.scheduleWork = function (callback) {
        this.engine.scheduleWork(callback);
    };
    BaseScheduler.prototype.scheduleRead = function (callback) {
        this.engine.scheduleRead(callback);
    };
    BaseScheduler.prototype.queryElement = function (el, callback) {
        var _this = this;
        var clientRect = null;
        var frame = null;
        this.engine.scheduleRead(function () {
            clientRect = getBoundingClientRect(el);
            frame = Frame.generate(_this.root);
        });
        this.engine.scheduleWork(function () {
            callback(clientRect, frame);
        });
    };
    BaseScheduler.prototype.unwatch = function (id) {
        this.toRemove.push(id);
    };
    BaseScheduler.prototype.unwatchAll = function () {
        this.queue.clear();
    };
    BaseScheduler.prototype.startTicking = function () {
        if (!this.isTicking) {
            this.isTicking = true;
            this.engine.scheduleRead(this.tick.bind(this));
        }
    };
    return BaseScheduler;
}());
export { BaseScheduler };
var Scheduler = /** @class */ (function (_super) {
    __extends(Scheduler, _super);
    function Scheduler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.queue = new Queue();
        return _this;
    }
    Scheduler.prototype.applyQueue = function (frame) {
        for (var i = 0; i < this.queue.items.length; i++) {
            var _a = this.queue.items[i], id = _a.id, callback = _a.callback;
            callback(frame, id);
        }
    };
    Scheduler.prototype.watch = function (callback) {
        this.startTicking();
        var id = generateToken();
        this.queue.push({
            callback: callback,
            id: id
        });
        return id;
    };
    return Scheduler;
}(BaseScheduler));
export { Scheduler };
var PredicatedScheduler = /** @class */ (function (_super) {
    __extends(PredicatedScheduler, _super);
    function PredicatedScheduler(predicate) {
        var _this = _super.call(this, null, window) || this;
        _this.predicate = predicate;
        return _this;
    }
    PredicatedScheduler.prototype.applyQueue = function (frame) {
        if (this.predicate(frame)) {
            _super.prototype.applyQueue.call(this, frame);
        }
    };
    return PredicatedScheduler;
}(Scheduler));
export { PredicatedScheduler };
var ElementScheduler = /** @class */ (function (_super) {
    __extends(ElementScheduler, _super);
    function ElementScheduler(customEngine, root, ALLOW_CACHED_SCHEDULER) {
        if (ALLOW_CACHED_SCHEDULER === void 0) { ALLOW_CACHED_SCHEDULER = false; }
        var _this = _super.call(this, customEngine, root) || this;
        _this.lastVersion = W.version;
        _this.queue = new DOMQueue();
        _this.ALLOW_CACHED_SCHEDULER = ALLOW_CACHED_SCHEDULER;
        return _this;
    }
    Object.defineProperty(ElementScheduler.prototype, "isDirty", {
        get: function () {
            return W.version !== this.lastVersion;
        },
        enumerable: true,
        configurable: true
    });
    ElementScheduler.prototype.applyQueue = function (frame) {
        for (var i = 0; i < this.queue.items.length; i++) {
            var _a = this.queue.items[i], callback = _a.callback, el = _a.el, id = _a.id, clientRect = _a.clientRect;
            if (this.isDirty || !clientRect || !this.ALLOW_CACHED_SCHEDULER) {
                clientRect = this.queue.items[i].clientRect = getBoundingClientRect(el);
            }
            callback(frame, id, clientRect);
        }
        this.lastVersion = W.version;
    };
    ElementScheduler.prototype.watch = function (el, callback, id) {
        this.startTicking();
        id = id || generateToken();
        var clientRect = null;
        this.queue.push({
            el: el,
            callback: callback,
            id: id,
            clientRect: clientRect
        });
        return id;
    };
    return ElementScheduler;
}(BaseScheduler));
export { ElementScheduler };
var globalScheduler = null;
export function getGlobalScheduler() {
    return globalScheduler || (globalScheduler = new Scheduler());
}
//# sourceMappingURL=scheduler.js.map