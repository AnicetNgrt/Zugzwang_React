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
var LocalHumanPlayer = /** @class */ (function (_super) {
    __extends(LocalHumanPlayer, _super);
    function LocalHumanPlayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LocalHumanPlayer;
}(HumanPlayer_1.HumanPlayer));
exports.LocalHumanPlayer = LocalHumanPlayer;
//# sourceMappingURL=LocalHumanPlayer.js.map