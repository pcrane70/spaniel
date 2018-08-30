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
var BaseQueue = /** @class */ (function () {
    function BaseQueue() {
        this.items = [];
    }
    BaseQueue.prototype.remove = function (identifier) {
        var len = this.items.length;
        for (var i = 0; i < len; i++) {
            if (this.removePredicate(identifier, this.items[i])) {
                this.items.splice(i, 1);
                i--;
                len--;
            }
        }
    };
    BaseQueue.prototype.clear = function () {
        this.items = [];
    };
    BaseQueue.prototype.push = function (element) {
        this.items.push(element);
    };
    BaseQueue.prototype.isEmpty = function () {
        return this.items.length === 0;
    };
    return BaseQueue;
}());
export { BaseQueue };
var Queue = /** @class */ (function (_super) {
    __extends(Queue, _super);
    function Queue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Queue.prototype.removePredicate = function (identifier, element) {
        if (typeof identifier === 'string') {
            return element.id === identifier;
        }
        else {
            return element.callback === identifier;
        }
    };
    return Queue;
}(BaseQueue));
export default Queue;
var FunctionQueue = /** @class */ (function (_super) {
    __extends(FunctionQueue, _super);
    function FunctionQueue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FunctionQueue.prototype.removePredicate = function (identifier, element) {
        return element === identifier;
    };
    return FunctionQueue;
}(BaseQueue));
export { FunctionQueue };
var DOMQueue = /** @class */ (function (_super) {
    __extends(DOMQueue, _super);
    function DOMQueue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DOMQueue.prototype.removePredicate = function (identifier, element) {
        if (typeof identifier === 'string') {
            return element.id === identifier;
        }
        else if (typeof identifier === 'function') {
            return element.callback === identifier;
        }
        else {
            return element.el === identifier;
        }
    };
    return DOMQueue;
}(BaseQueue));
export { DOMQueue };
//# sourceMappingURL=queue.js.map