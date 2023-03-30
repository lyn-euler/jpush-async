"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL = exports.JPushClient = exports.buildClient = void 0;
const debug_1 = __importDefault(require("debug"));
const JPushError = __importStar(require("../jpush-error"));
const request_promise_1 = __importDefault(require("request-promise"));
const push_payload_async_1 = require("./push-payload-async");
const pkg = require("../../package");
const debug = (0, debug_1.default)('jpush');
const headers = {
    'User-Agent': `JPush-API-NodeJS-Client ${pkg.version}`,
    Connection: 'Keep-Alive',
    Charset: 'UTF-8',
    'Content-Type': 'application/json',
};
const PUSH_API_URL = 'https://api.jpush.cn/v3/push';
const GROUP_API_URL = 'https://api.jpush.cn/v3/grouppush';
const REPORT_API_URL = 'https://report.jpush.cn/v3';
const SCHEDULE_API_URL = 'https://api.jpush.cn/v3/schedules'; // 定时任务
const REPORT_RECEIVED = '/received';
const REPORT_RECEIVED_DETAIL = '/received/detail';
const REPORT_STATUS_MESSAGE = '/status/message';
const REPORT_USER = '/users';
const REPORT_MESSAGE = '/messages';
const REPORT_MESSAGE_DETAIL = '/messages/detail';
const HOST_NAME_SSL = 'https://device.jpush.cn';
const DEVICE_PATH = '/v3/devices';
const TAG_PATH = '/v3/tags/';
const ALIAS_PATH = '/v3/aliases';
const VALIDATE = '/validate';
const DEFAULT_MAX_RETRY_TIMES = 3;
const READ_TIMEOUT = 30 * 1000;
// Pattern
const PUSH_PATTERNS = /^[a-zA-Z0-9]{24}/;
const MSG_IDS_PATTERNS = /[^\d,]/;
function buildClient(appKey, masterSecret, retryTimes, isDebug, readTimeOut, proxy, isGroup = false) {
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
        const options = arguments[0];
        return new JPushClient(options.appKey, options.masterSecret, options.retryTimes, options.isDebug, options.readTimeOut, options.proxy, options.isGroup);
    }
    else {
        return new JPushClient(appKey, masterSecret, retryTimes, isDebug, readTimeOut, proxy, isGroup);
    }
}
exports.buildClient = buildClient;
class JPushClient {
    constructor(appKey, masterSecret, maxTryTimes, isDebug, readTimeOut, proxy, isGroup) {
        if (!appKey || !masterSecret) {
            throw new JPushError.InvalidArgumentError('Key and Secret are both required.');
        }
        this.isGroup = isGroup;
        if (typeof appKey !== 'string' ||
            typeof masterSecret !== 'string' ||
            !PUSH_PATTERNS.test(appKey) ||
            !PUSH_PATTERNS.test(masterSecret)) {
            throw new JPushError.InvalidArgumentError('appKey and masterSecret format is incorrect. ' +
                'They should be 24 size, and be composed with alphabet and numbers. ' +
                'Please confirm that they are coming from JPush Web Portal.');
        }
        this.appkey = isGroup ? `group-${appKey}` : appKey;
        this.masterSecret = masterSecret;
        if (maxTryTimes) {
            if (typeof maxTryTimes !== 'number') {
                throw new JPushError.InvalidArgumentError('Invalid retryTimes.');
            }
            this.maxTryTimes = maxTryTimes;
        }
        else {
            this.maxTryTimes = DEFAULT_MAX_RETRY_TIMES;
        }
        if (isDebug != null) {
            this.isDebug = isDebug;
        }
        else {
            this.isDebug = true;
        }
        if (readTimeOut != null) {
            this.readTimeOut = readTimeOut;
        }
        else {
            this.readTimeOut = READ_TIMEOUT;
        }
        this.proxy = proxy;
    }
    /**
     * create a push payload
     * @returns {exports.PushPayload}
     */
    push() {
        return new push_payload_async_1.PushPayload(this);
    }
    sendPush(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return _request(this, this.isGroup === true ? GROUP_API_URL : PUSH_API_URL, payload, 'POST');
        });
    }
    getReportReceiveds(msgIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (MSG_IDS_PATTERNS.test(msgIds)) {
                throw new JPushError.InvalidArgumentError('Invalid msg_ids, msg_ids should be composed with alphabet and comma.');
            }
            const url = `${REPORT_API_URL}${REPORT_RECEIVED}?msg_ids=${msgIds}`;
            return _request(this, url, null, 'GET');
        });
    }
    getReportReceivedDetail(msgIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (MSG_IDS_PATTERNS.test(msgIds)) {
                throw new JPushError.InvalidArgumentError('Invalid msg_ids, msg_ids should be composed with alphabet and comma.');
            }
            const url = `${REPORT_API_URL}${REPORT_RECEIVED_DETAIL}?msg_ids=${msgIds}`;
            return _request(this, url, null, 'GET');
        });
    }
    getReportStatusMessage(msgId, registrationIds, date) {
        return __awaiter(this, void 0, void 0, function* () {
            if (msgId == null) {
                throw new JPushError.InvalidArgumentError('msgId is null!');
            }
            if (registrationIds == null) {
                throw new JPushError.InvalidArgumentError('registrationIds is null!');
            }
            const json = {
                msg_id: msgId > Number.MAX_SAFE_INTEGER ? String(msgId) : msgId,
                registration_ids: registrationIds,
            };
            if (date != null) {
                json.date = date;
            }
            const url = REPORT_API_URL + REPORT_STATUS_MESSAGE;
            return _request(this, url, json, 'POST').then((res) => ({ res })).catch((error) => ({ err: error }));
        });
    }
    getReportMessages(msgIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (MSG_IDS_PATTERNS.test(msgIds)) {
                throw new JPushError.InvalidArgumentError('Invalid msg_ids, msg_ids should be composed with alphabet and comma.');
            }
            const url = `${REPORT_API_URL}${REPORT_MESSAGE}?msg_ids=${msgIds}`;
            return _request(this, url, null, 'GET');
        });
    }
    getReportMessagesDetail(msgIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (MSG_IDS_PATTERNS.test(msgIds)) {
                throw new JPushError.InvalidArgumentError('Invalid msg_ids, msg_ids should be composed with alphabet and comma.');
            }
            const url = `${REPORT_API_URL}${REPORT_MESSAGE_DETAIL}?msg_ids=${msgIds}`;
            return _request(this, url, null, 'GET');
        });
    }
    getReportUsers(timeUnit, start, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${REPORT_API_URL}${REPORT_USER}?time_unit=${timeUnit}&start=${start}&duration=${duration}`;
            return _request(this, url, null, 'GET');
        });
    }
    /**
     * device api
     *
     * @param registrationId
     */
    getDeviceTagAlias(registrationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${HOST_NAME_SSL}${DEVICE_PATH}/${registrationId}`;
            return _request(this, url, null, 'GET');
        });
    }
    // 结合短信业务使用，需要先调用该方法将用户的手机号码与设备的 registration id 匹配。
    setMobile(registrationId, mobileNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = { mobile: mobileNumber };
            const url = `${HOST_NAME_SSL}${DEVICE_PATH}/${registrationId}`;
            return _request(this, url, json, 'POST');
        });
    }
    updateDeviceTagAlias(registrationId, alias, clearTag, tagsToAdd, tagsToRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${HOST_NAME_SSL}${DEVICE_PATH}/${registrationId}`;
            if (tagsToAdd instanceof Array && tagsToRemove instanceof Array) {
                const json = {};
                const tags = {};
                if (alias != null) {
                    json.alias = alias;
                }
                if (clearTag) {
                    json.tags = '';
                }
                else {
                    if (tagsToAdd != null && tagsToAdd.length > 0) {
                        tags.add = tagsToAdd;
                    }
                    if (tagsToRemove != null && tagsToRemove.length > 0) {
                        tags.remove = tagsToRemove;
                    }
                    json.tags = tags;
                    debug(json);
                }
                return _request(this, url, json, 'POST');
            }
            else {
                throw new JPushError.InvalidArgumentError('tagsToAdd or tagsToRemove type should be array');
            }
        });
    }
    getTagList() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${HOST_NAME_SSL}${TAG_PATH}`;
            return _request(this, url, null, 'GET');
        });
    }
    isDeviceInTag(theTag, registrationID) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${HOST_NAME_SSL}${TAG_PATH}${theTag}/registration_ids/${registrationID}`;
            return _request(this, url, null, 'GET');
        });
    }
    addRemoveDevicesFromTag(theTag, toAddUsers, toRemoveUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${HOST_NAME_SSL}${TAG_PATH}${theTag}`;
            const registrationIds = {};
            if (toAddUsers != null && toAddUsers.length > 0) {
                registrationIds.add = toAddUsers;
            }
            if (toRemoveUsers != null && toRemoveUsers.length > 0) {
                registrationIds.remove = toRemoveUsers;
            }
            const json = {};
            json.registration_ids = registrationIds;
            debug(json.registration_ids);
            return _request(this, url, json, 'POST');
        });
    }
    deleteTag(theTag, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${HOST_NAME_SSL}${TAG_PATH}/${theTag}`;
            if (platform != null) {
                url += `/?platform=${platform}`;
            }
            return _request(this, url, null, 'delete');
        });
    }
    getAliasDeviceList(alias, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${HOST_NAME_SSL}${ALIAS_PATH}/${alias}`;
            if (platform != null) {
                url += `/?platform=${platform}`;
            }
            return _request(this, url, null, 'GET');
        });
    }
    deleteAlias(alias, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${HOST_NAME_SSL}${ALIAS_PATH}/${alias}`;
            if (platform != null) {
                url += `/?platform=${platform}`;
            }
            return _request(this, url, null, 'delete');
        });
    }
    validate(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return _request(this, PUSH_API_URL + VALIDATE, payload, 'POST');
        });
    }
    // 定时任务 start
    setSchedule(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return _request(this, SCHEDULE_API_URL, payload, 'POST');
        });
    }
    updateSchedule(scheduleId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${SCHEDULE_API_URL}/${scheduleId}`;
            return _request(this, url, payload, 'PUT');
        });
    }
    // 获取有效的定时任务列表。
    getScheduleList(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof page !== 'number') {
                throw new JPushError.InvalidArgumentError('Invalid argument, it can only be set to the Number.');
            }
            const url = `${SCHEDULE_API_URL}?page=${page}`;
            return _request(this, url, null, 'GET');
        });
    }
    // 获取指定的定时任务。
    getSchedule(scheduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof scheduleId !== 'string') {
                throw new JPushError.InvalidArgumentError('Invalid argument, it can only be set to the String.');
            }
            const url = `${SCHEDULE_API_URL}/${scheduleId}`;
            return _request(this, url, null, 'GET');
        });
    }
    // 删除指定的定时任务。
    delSchedule(scheduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof scheduleId !== 'string') {
                throw new JPushError.InvalidArgumentError('Invalid argument, it can only be set to the String.');
            }
            const url = `${SCHEDULE_API_URL}/${scheduleId}`;
            return _request(this, url, null, 'DELETE');
        });
    }
    // 获取定时任务对应的所有 msg_id
    getScheduleMsgIds(scheduleId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof scheduleId !== 'string') {
                throw new JPushError.InvalidArgumentError('Invalid argument, it can only be set to the String.');
            }
            const url = `${SCHEDULE_API_URL}/${scheduleId}/msg_ids`;
            return _request(this, url, null, 'GET', callback);
        });
    }
    // 定时任务 end
    // Proxy start
    // Proxy end
    /**
     * 获取用户在线状态（vip专属接口）
     * https://docs.jiguang.cn//jpush/server/push/rest_api_v3_device/#vip
     * @param {*} regIds 需要在线状态的用户 registration_id
     */
    getDeviceStatus(regIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = {
                registration_ids: regIds,
            };
            const url = `${HOST_NAME_SSL}${DEVICE_PATH}/status/`;
            return _request(this, url, json, 'POST')
                .then((res) => ({ res }))
                .catch((error) => ({ err: error }));
        });
    }
}
exports.JPushClient = JPushClient;
function _request(client, url, body, method, times = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        if (client.isDebug) {
            debug('Push URL :' + url);
            if (body) {
                debug('Body :' + body);
            }
            // debug("Auth :" + JSON.stringify(auth))
            debug('Method :' + method);
            debug('Times/MaxTryTimes : ' + times + '/' + client.maxTryTimes);
        }
        const options = {
            method: method.toUpperCase(),
            json: true,
            uri: url,
            body: body,
            headers: headers,
            auth: {
                user: client.appkey,
                pass: client.masterSecret,
            },
            timeout: client.readTimeOut,
            proxy: client.proxy,
        };
        try {
            return yield (0, request_promise_1.default)(options);
        }
        catch (err) {
            if (err.error.code === 'ETIMEDOUT' && err.error.syscall !== 'connect') {
                // response timeout
                throw new JPushError.APIConnectionError('Response timeout. Your request to the server may have already received, please check whether or not to push', true);
            }
            else if (err.error.code === 'ENOTFOUND') {
                // unknown host
                throw new JPushError.APIConnectionError('Unknown host : ' + url);
            }
            else if (times < client.maxTryTimes) {
                return _request(client, url, body, method, times + 1);
            }
            else {
                if (client.isDebug) {
                    debug('Fail, HttpStatusCode: ' + err.statusCode + ' result: ' + JSON.stringify(err.error));
                }
                throw new JPushError.APIRequestError(err.statusCode, JSON.stringify(err.error));
            }
        }
    });
}
var push_payload_async_2 = require("./push-payload-async");
Object.defineProperty(exports, "ALL", { enumerable: true, get: function () { return push_payload_async_2.ALL; } });
