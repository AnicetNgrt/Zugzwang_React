"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Orientation;
(function (Orientation) {
    Orientation[Orientation["NORTH"] = 0] = "NORTH";
    Orientation[Orientation["EAST"] = 1] = "EAST";
    Orientation[Orientation["SOUTH"] = 2] = "SOUTH";
    Orientation[Orientation["WEST"] = 3] = "WEST";
})(Orientation = exports.Orientation || (exports.Orientation = {}));
function reOrient(path, orientation) {
    var ret = [];
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var step = path_1[_i];
        ret.push((orientation + step) % 4);
    }
    return ret;
}
exports.reOrient = reOrient;
//# sourceMappingURL=Orientation.js.map