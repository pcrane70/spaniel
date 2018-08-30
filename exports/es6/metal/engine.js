/*
Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
Version 2.0 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License
at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*/
import W from './window-proxy';
var Engine = /** @class */ (function () {
    function Engine() {
        this.reads = [];
        this.work = [];
        this.running = false;
    }
    Engine.prototype.scheduleRead = function (callback) {
        this.reads.unshift(callback);
        this.run();
    };
    Engine.prototype.scheduleWork = function (callback) {
        this.work.unshift(callback);
        this.run();
    };
    Engine.prototype.run = function () {
        var _this = this;
        if (!this.running) {
            this.running = true;
            W.rAF(function () {
                _this.running = false;
                for (var i = 0, rlen = _this.reads.length; i < rlen; i++) {
                    _this.reads.pop()();
                }
                for (var i = 0, wlen = _this.work.length; i < wlen; i++) {
                    _this.work.pop()();
                }
                if (_this.work.length > 0 || _this.reads.length > 0) {
                    _this.run();
                }
            });
        }
    };
    return Engine;
}());
export { Engine };
var globalEngine = null;
export function setGlobalEngine(engine) {
    if (!!globalEngine) {
        return false;
    }
    globalEngine = engine;
    return true;
}
export function getGlobalEngine() {
    return globalEngine || (globalEngine = new Engine());
}
//# sourceMappingURL=engine.js.map