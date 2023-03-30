"use strict";
/**
 * JPush Error
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidArgumentError = exports.APIRequestError = exports.APIConnectionError = void 0;
class APIConnectionError extends Error {
    constructor(message, isResponseTimeout) {
        super(message);
        this.name = "APIConnectionError";
        this.isResponseTimeout = isResponseTimeout || false;
    }
}
exports.APIConnectionError = APIConnectionError;
class APIRequestError extends Error {
    constructor(httpCode, response) {
        const message = `Push Fail, HttpStatusCode: ${httpCode} result: ${response.toString()}`;
        super(message);
        this.name = "APIRequestError";
        this.httpCode = httpCode;
        this.response = response;
    }
}
exports.APIRequestError = APIRequestError;
class InvalidArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidArgumentError";
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
