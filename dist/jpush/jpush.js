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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL = exports.JPushClient = exports.buildClient = void 0;
const debug_1 = __importDefault(require("debug"));
const JPushError = __importStar(require("../jpush-error"));
const request_1 = __importDefault(require("request"));
const push_payload_1 = require("./push-payload");
const pkg = require('../../package');
const debug = (0, debug_1.default)('jpush');
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
const TAG_PATH = '/v3/tags';
const ALIAS_PATH = '/v3/aliases';
const VALIDATE = '/validate';
const DEFAULT_MAX_RETRY_TIMES = 3;
const READ_TIMEOUT = 30 * 1000;
// Pattern
const PUSH_PATTERNS = /^[a-zA-Z0-9]{24}/;
const MSG_IDS_PATTERNS = /[^\d,]/;
function buildClient(appKey, masterSecret, retryTimes, isDebug, readTimeOut, proxy, isGroup) {
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
    constructor(appKey, masterSecret, retryTimes, isDebug, readTimeOut, proxy, isGroup) {
        if (!appKey || !masterSecret) {
            throw new JPushError.InvalidArgumentError('appKey and masterSecret are both required.');
        }
        this.isGroup = isGroup;
        if (typeof appKey !== 'string' || typeof masterSecret !== 'string' ||
            !PUSH_PATTERNS.test(appKey) || !PUSH_PATTERNS.test(masterSecret)) {
            throw new JPushError.InvalidArgumentError('Key and Secret format is incorrect. ' +
                'They should be 24 size, and be composed with alphabet and numbers. ' +
                'Please confirm that they are coming from JPush Web Portal.');
        }
        this.appkey = isGroup ? 'group-' + appKey : appKey;
        this.masterSecret = masterSecret;
        this.isGroup = isGroup;
        if (retryTimes) {
            if (typeof retryTimes !== 'number') {
                throw new JPushError.InvalidArgumentError('Invalid retryTimes.');
            }
            this.retryTimes = retryTimes;
        }
        else {
            this.retryTimes = DEFAULT_MAX_RETRY_TIMES;
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
     * @returns {PushPayload}
     */
    push() {
        return new push_payload_1.PushPayload(this);
    }
    sendPush(payload, callback) {
        return this._request(this, this.isGroup === true ? GROUP_API_URL : PUSH_API_URL, payload, 'POST', callback);
    }
    getReportReceiveds(msgIds, callback) {
        if (MSG_IDS_PATTERNS.test(msgIds)) {
            throw new JPushError.InvalidArgumentError('Invalid msg_ids, msg_ids should be composed with alphabet and comma.');
        }
        const url = REPORT_API_URL + REPORT_RECEIVED + '?msg_ids=' + msgIds;
        return this._request(this, url, null, 'GET', callback);
    }
    getReportReceivedDetail(msgIds, callback) {
        if (MSG_IDS_PATTERNS.test(msgIds)) {
            throw new JPushError.InvalidArgumentError('Invalid msg_ids, msg_ids should be composed with alphabet and comma.');
        }
        const url = REPORT_API_URL + REPORT_RECEIVED_DETAIL + '?msg_ids=' + msgIds;
        return this._request(this, url, null, 'GET', callback);
    }
    getReportStatusMessage(msgId, registrationIds, date, callback) {
        if (msgId == null) {
            throw new JPushError.InvalidArgumentError('msgId is null!');
        }
        if (registrationIds == null) {
            throw new JPushError.InvalidArgumentError('registrationIds is null!');
        }
        const json = {
            "msg_id": msgId,
            "registration_ids": registrationIds
        };
        if (date) {
            json.date = date;
        }
        const url = REPORT_API_URL + REPORT_STATUS_MESSAGE;
        return this._request(this, url, JSON.stringify(json), 'POST', callback);
    }
    getReportMessages(msgIds, callback) {
        if (MSG_IDS_PATTERNS.test(msgIds)) {
            throw new JPushError.InvalidArgumentError('Invalid msg_ids, msg_ids should be composed with alphabet and comma.');
        }
        const url = REPORT_API_URL + REPORT_MESSAGE + '?msg_ids=' + msgIds;
        return this._request(this, url, null, 'GET', callback);
    }
    getReportMessagesDetail(msgIds, callback) {
        if (MSG_IDS_PATTERNS.test(msgIds)) {
            throw new JPushError.InvalidArgumentError('Invalid msg_ids, msg_ids should be composed with alphabet and comma.');
        }
        const url = REPORT_API_URL + REPORT_MESSAGE_DETAIL + '?msg_ids=' + msgIds;
        return this._request(this, url, null, 'GET', callback);
    }
    getReportUsers(timeUnit, start, duration, callback) {
        const url = REPORT_API_URL + REPORT_USER + '?time_unit=' + timeUnit + '&start=' + start + '&duration=' + duration;
        return this._request(this, url, null, 'GET', callback);
    }
    /**
     * device api
     *
     * @param registrationId
     */
    getDeviceTagAlias(registrationId, callback) {
        const url = HOST_NAME_SSL + DEVICE_PATH + '/' + registrationId;
        return this._request(this, url, null, 'GET', callback);
    }
    // 结合短信业务使用，需要先调用该方法将用户的手机号码与设备的 registration id 匹配。
    setMobile(registrationId, mobileNumber, callback) {
        const json = {};
        json['mobile'] = mobileNumber;
        const url = HOST_NAME_SSL + DEVICE_PATH + '/' + registrationId;
        return this._request(this, url, JSON.stringify(json), 'POST', callback);
    }
    updateDeviceTagAlias(registrationId, alias, clearTag, tagsToAdd, tagsToRemove, callback) {
        const url = HOST_NAME_SSL + DEVICE_PATH + '/' + registrationId;
        const json = {};
        if (tagsToAdd instanceof Array && tagsToRemove instanceof Array) {
            const tags = {};
            if (alias != null) {
                json['alias'] = alias;
            }
            if (clearTag) {
                json['tags'] = '';
            }
            else {
                if (tagsToAdd != null && tagsToAdd.length > 0) {
                    tags['add'] = tagsToAdd;
                }
                if (tagsToRemove != null && tagsToRemove.length > 0) {
                    tags['remove'] = tagsToRemove;
                }
                json['tags'] = tags;
                debug(json);
            }
        }
        else {
            throw new JPushError.InvalidArgumentError('tagsToAdd or tagsToRemove type should be array');
        }
        return this._request(this, url, JSON.stringify(json), 'POST', callback);
    }
    getTagList(callback) {
        const url = HOST_NAME_SSL + TAG_PATH;
        return this._request(this, url, null, 'GET', callback);
    }
    isDeviceInTag(theTag, registrationID, callback) {
        const url = HOST_NAME_SSL + TAG_PATH + '/' + theTag + '/registration_ids/' + registrationID;
        return this._request(this, url, null, 'GET', callback);
    }
    addRemoveDevicesFromTag(theTag, toAddUsers, toRemoveUsers, callback) {
        const url = HOST_NAME_SSL + TAG_PATH + '/' + theTag;
        const registrationIds = {};
        if (toAddUsers != null && toAddUsers.length > 0) {
            registrationIds['add'] = toAddUsers;
        }
        if (toRemoveUsers != null && toRemoveUsers.length > 0) {
            registrationIds['remove'] = toRemoveUsers;
        }
        const json = {};
        json['registration_ids'] = registrationIds;
        debug(json['registration_ids']);
        return this._request(this, url, JSON.stringify(json), 'POST', callback);
    }
    deleteTag(theTag, platform, callback) {
        let url = HOST_NAME_SSL + TAG_PATH + '/' + theTag;
        if (platform != null) {
            url += ('/?platform=' + platform);
        }
        return this._request(this, url, null, 'delete', callback);
    }
    getAliasDeviceList(alias, platform, callback) {
        let url = HOST_NAME_SSL + ALIAS_PATH + '/' + alias;
        if (platform != null) {
            url += '/?platform=' + platform;
        }
        return this._request(this, url, null, 'GET', callback);
    }
    deleteAlias(alias, platform, callback) {
        let url = HOST_NAME_SSL + ALIAS_PATH + '/' + alias;
        if (platform != null) {
            url += '/?platform=' + platform;
        }
        return this._request(this, url, null, 'delete', callback);
    }
    validate(payload, callback) {
        return this._request(this, PUSH_API_URL + VALIDATE, payload, 'POST', callback);
    }
    // 定时任务 start
    setSchedule(payload, callback) {
        return this._request(this, SCHEDULE_API_URL, payload, 'POST', callback);
    }
    updateSchedule(scheduleId, payload, callback) {
        const url = SCHEDULE_API_URL + '/' + scheduleId;
        return this._request(this, url, payload, 'PUT', callback);
    }
    // 获取有效的定时任务列表。
    getScheduleList(page, callback) {
        if (typeof page !== 'number') {
            throw new JPushError.InvalidArgumentError('Invalid argument, it can only be set to the Number.');
        }
        const url = SCHEDULE_API_URL + '?page=' + page;
        return this._request(this, url, null, 'GET', callback);
    }
    // 获取指定的定时任务。
    getSchedule(scheduleId, callback) {
        if (typeof scheduleId !== 'string') {
            throw new JPushError.InvalidArgumentError('Invalid argument, it can only be set to the String.');
        }
        const url = SCHEDULE_API_URL + '/' + scheduleId;
        return this._request(this, url, null, 'GET', callback);
    }
    // 删除指定的定时任务。
    delSchedule(scheduleId, callback) {
        if (typeof scheduleId !== 'string') {
            throw new JPushError.InvalidArgumentError('Invalid argument, it can only be set to the String.');
        }
        const url = SCHEDULE_API_URL + '/' + scheduleId;
        return this._request(this, url, null, 'DELETE', callback);
    }
    // 获取定时任务对应的所有 msg_id
    getScheduleMsgIds(scheduleId, callback) {
        if (typeof scheduleId !== 'string') {
            throw new JPushError.InvalidArgumentError('Invalid argument, it can only be set to the String.');
        }
        const url = SCHEDULE_API_URL + '/' + scheduleId + '/msg_ids';
        return this._request(this, url, null, 'GET', callback);
    }
    /**
     * 获取推送唯一标识符
     * http://docs.jiguang.cn/jpush/server/push/rest_api_v3_push/#cid
     * @param {*} count 可选参数。数值类型，不传则默认为 1。范围为 [1, 1000]
     * @param {*} type 可选参数。CID 类型。取值：push（默认），schedule
     * @param {*} callback
     */
    getCid(count, type, callback) {
        if (!count) {
            count = 1;
        }
        if (!type) {
            type = 'push';
        }
        const url = PUSH_API_URL + '/cid?count=' + count + '&type=' + type;
        return this._request(this, url, null, 'GET', callback);
    }
    /**
     * 针对RegID方式批量单推（VIP专属接口）
     * http://docs.jiguang.cn/jpush/server/push/rest_api_v3_push/#vip
     * @param {*} singlePayloads 单推payload数组
     * @param {*} callback
     */
    batchPushByRegid(singlePayloads, callback) {
        const url = PUSH_API_URL + '/batch/regid/single';
        return this.batchPush.call(this, url, singlePayloads, callback);
    }
    /**
     * 针对Alias方式批量单推（VIP专属接口）s
     * http://docs.jiguang.cn/jpush/server/push/rest_api_v3_push/#vip
     * @param {*} singlePayloads 单推payload数组
     * @param {*} callback
     */
    batchPushByAlias(singlePayloads, callback) {
        const url = PUSH_API_URL + '/batch/alias/single';
        return this.batchPush.call(this, url, singlePayloads, callback);
    }
    batchPush(url, singlePayloads, callback) {
        const client = this;
        return this.getCid.call(client, singlePayloads.length, 'push', function (err, res) {
            if (err) {
                return callback(err);
            }
            const body = { "pushlist": {} };
            for (let i = 0; i < singlePayloads.length; i++) {
                body.pushlist[res.cidlist[i]] = singlePayloads[i];
            }
            return client._request(client, url, JSON.stringify(body), 'POST', callback);
        });
    }
    // 定时任务 end
    /**
     * 获取用户在线状态（vip专属接口）
     * https://docs.jiguang.cn//jpush/server/push/rest_api_v3_device/#vip
     * @param {*} regIds 需要在线状态的用户 registration_id
     * @param {*} callback
     */
    getDeviceStatus(regIds, callback) {
        const json = {
            "registration_ids": regIds
        };
        const url = HOST_NAME_SSL + DEVICE_PATH + '/status/';
        return this._request(this, url, JSON.stringify(json), 'POST', callback);
    }
    // Proxy start
    // Proxy end
    _request(client, url, body, method, callback, times = 1) {
        if (client.isDebug) {
            debug('Push URL :' + url);
            if (body) {
                debug('Body :' + body);
            }
            // debug("Auth :" + JSON.stringify(auth))
            debug('Method :' + method);
            debug('Times/MaxTryTimes : ' + times + '/' + client.maxTryTimes);
        }
        const _callback = function (err, res, body) {
            if (err) {
                if (err.code === 'ETIMEDOUT' && err.syscall !== 'connect') {
                    // response timeout
                    return callback(new JPushError.APIConnectionError('Response timeout. Your request to the server may have already received, please check whether or not to push', true));
                }
                else if (err.code === 'ENOTFOUND') {
                    // unknown host
                    return callback(new JPushError.APIConnectionError('Known host : ' + url));
                }
                // other connection error
                if (times < client.maxTryTimes) {
                    return client._request(client, url, body, method, callback, times + 1);
                }
                else {
                    return callback(new JPushError.APIConnectionError('Connect timeout. Please retry later.'));
                }
            }
            if (res.statusCode === 200) {
                if (body.length !== 0) {
                    if (client.isDebug) {
                        debug('Success, response : ' + body);
                    }
                    try {
                        callback(null, JSON.parse(body));
                    }
                    catch (e) {
                        callback(e);
                    }
                }
                else {
                    if (client.isDebug) {
                        debug('Success, response : ' + body);
                    }
                    callback(null, 200);
                }
            }
            else {
                if (client.isDebug) {
                    debug('Fail, HttpStatusCode: ' + res.statusCode + ' result: ' + body.toString());
                }
                callback(new JPushError.APIRequestError(res.statusCode, body));
            }
        };
        (0, request_1.default)({
            url,
            method,
            body: body,
            auth: {
                user: client.appkey,
                pass: client.masterSecret
            },
            timeout: client.readTimeOut,
            proxy: client.proxy
        }, _callback);
    }
}
exports.JPushClient = JPushClient;
var push_payload_2 = require("./push-payload");
Object.defineProperty(exports, "ALL", { enumerable: true, get: function () { return push_payload_2.ALL; } });
