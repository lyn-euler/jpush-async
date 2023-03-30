"use strict";
/* extend start */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = exports.extend = void 0;
const _isObject = function (o) {
    return Object.prototype.toString.call(o) === '[object Object]';
};
const _extend = function self(destination, source) {
    let property;
    for (property in destination) {
        if (destination.hasOwnProperty(property)) {
            // 若 destination[property] 和 source[property] 都是对象，则递归。
            if (_isObject(destination[property]) && _isObject(source[property])) {
                self(destination[property], source[property]);
            }
            // 若 source[property] 已存在，则跳过。
            if (!source.hasOwnProperty(property)) {
                source[property] = destination[property];
            }
        }
    }
};
const extend = function (payload, opts) {
    let arr = arguments;
    let result = {};
    let i;
    if (!arr.length) {
        return {};
    }
    for (i = arr.length - 1; i >= 0; i--) {
        if (_isObject(arr[i])) {
            _extend(arr[i], result);
        }
    }
    arr[0] = result;
    return result;
};
exports.extend = extend;
/* extend end */
const isEmptyObject = function (obj) {
    for (let t in obj) {
        return false;
    }
    return true;
};
exports.isEmptyObject = isEmptyObject;
