/**
 * JPush Error
 */

export class APIConnectionError extends Error {
	isResponseTimeout: boolean;
	constructor(message: string, isResponseTimeout?: boolean) {
		super(message);
		this.name = "APIConnectionError";
		this.isResponseTimeout = isResponseTimeout || false;
	}
}

export class APIRequestError extends Error {
	httpCode: number;
	response: any;
	constructor(httpCode: number, response: any) {
		const message = `Push Fail, HttpStatusCode: ${httpCode} result: ${response.toString()}`;
		super(message);
		this.name = "APIRequestError";
		this.httpCode = httpCode;
		this.response = response;
	}
}

export class InvalidArgumentError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidArgumentError";
	}
}
