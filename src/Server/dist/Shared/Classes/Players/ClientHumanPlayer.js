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
var HumanPlayer_1 = require("./HumanPlayer");
var CientHumanPlayer = /** @class */ (function (_super) {
    __extends(CientHumanPlayer, _super);
    function CientHumanPlayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CientHumanPlayer.prototype.sendMove = function (move) {
        throw new Error("Method not implemented.");
    };
    return CientHumanPlayer;
}(HumanPlayer_1.HumanPlayer));
exports.CientHumanPlayer = CientHumanPlayer;
//# sourceMappingURL=ClientHumanPlayer.js.map