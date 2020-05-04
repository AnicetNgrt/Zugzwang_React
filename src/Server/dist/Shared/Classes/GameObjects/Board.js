"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GameObject_1 = require("./GameObject");
var CopyIdProvider_1 = require("../IdProviders/CopyIdProvider");
var Board = /** @class */ (function (_super) {
    __extends(Board, _super);
    function Board(maxCrd, slippery, obstructed, shiftMap, idProvider) {
        var _this = _super.call(this, idProvider) || this;
        _this.maxCrd = maxCrd;
        _this.slippery = slippery;
        _this.obstructed = obstructed;
        _this.shiftMap = shiftMap;
        return _this;
    }
    Board.prototype.copy = function () {
        var slipperyCopy = Object.assign([], this.slippery);
        var obstructedCopy = Object.assign([], this.obstructed);
        var shiftMapCopy = [];
        this.shiftMap.forEach(function (row) { return shiftMapCopy.push(Object.assign([], row)); });
        return new Board(this.maxCrd, slipperyCopy, obstructedCopy, shiftMapCopy, CopyIdProvider_1.CopyIdProvider.getYours(this));
    };
    Board.getFromSize = function (size, idProvider) {
        var shiftMap = [];
        var mys = [];
        var mxs = [];
        if (size.y % 2 == 0) {
            mys.push(size.y / 2);
            mys.push((size.y / 2) - 1);
        }
        else {
            mys.push((size.y - 1) / 2);
        }
        if (size.x % 2 == 0) {
            mxs.push(size.x / 2);
            mxs.push((size.x / 2) - 1);
        }
        else {
            mxs.push((size.x - 1) / 2);
        }
        var middles = [];
        mxs = mxs.sort();
        mys = mys.sort();
        // [higher left, higher right,
        //  lower left,  lower right]
        for (var _i = 0, mys_1 = mys; _i < mys_1.length; _i++) { // haut en bas
            var y = mys_1[_i];
            for (var _a = 0, mxs_1 = mxs; _a < mxs_1.length; _a++) { // gauche à droite
                var x = mxs_1[_a];
                middles.push({ x: x, y: y });
            }
        }
        for (var y = 0; y < size.y; y++) {
            shiftMap.push([]);
            for (var x = 0; x < size.x; x++) {
                var vec1;
                var vec2;
                if (y > middles[0].y) {
                    vec1 = { x: 0, y: 1 };
                }
                else if (y < middles[(middles.length - 1)].y) {
                    vec1 = { x: 0, y: -1 };
                }
                else {
                    vec1 = { x: 0, y: 0 };
                }
                if (x > middles[(middles.length - 1)].x) {
                    vec2 = { x: -1, y: 0 };
                }
                else if (x < middles[0].x) {
                    vec2 = { x: 1, y: 0 };
                }
                else {
                    vec2 = { x: 0, y: 0 };
                }
                shiftMap[y].push({ x: vec1.x + vec2.x, y: vec1.y + vec2.y });
            }
        }
        return new Board({ x: size.x - 1, y: size.y - 1 }, [], [], shiftMap, idProvider);
    };
    return Board;
}(GameObject_1.GameObject));
exports.Board = Board;
//# sourceMappingURL=Board.js.map