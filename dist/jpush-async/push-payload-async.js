"use strict";
/* eslint-disable camelcase */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushPayload = exports.ALL = void 0;
const jpush_error_1 = require("../jpush-error");
const util_1 = require("../util");
exports.ALL = 'all';
const VALID_DEVICE_TYPES = ['android', 'ios', 'winphone'];
const MIN_SENDNO = 100000;
const MAX_SENDNO = 2147483647;
function generateSendno() {
    return (MIN_SENDNO + Math.round(Math.random() * (MAX_SENDNO - MIN_SENDNO)));
}
class PushPayload {
    constructor(client) {
        this.client = client;
        this.payload = {};
        this.trigger = {};
    }
    setPlatform(platform) {
        this.payload = (0, util_1.extend)(this.payload, {
            'platform': platform
        });
        return this;
    }
    setAudience(audience) {
        if (audience == null) {
            throw new jpush_error_1.InvalidArgumentError('audience cannot be null');
        }
        this.payload = (0, util_1.extend)(this.payload, {
            'audience': audience
        });
        return this;
    }
    android(alert, title, builder_id, channel_id, extras, priority, category, style, alertType) {
        if (alert != null) {
            if (typeof alert !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('android.alert is require and only can be set to the string');
            }
        }
        const android = {
            'alert': alert
        };
        if (title != null) {
            if (typeof title !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.title, it only can be set to the string');
            }
            android['title'] = title;
        }
        if (builder_id != null) {
            if (typeof builder_id !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.builder_id, it only can be set to the number');
            }
            android['builder_id'] = builder_id;
        }
        if (channel_id != null) {
            if (typeof channel_id !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.channel_id, it only can be set to the string');
            }
            android['channel_id'] = channel_id;
        }
        if (extras != null) {
            if (typeof extras !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.extras');
            }
            android['extras'] = extras;
        }
        if (priority != null) {
            if (typeof priority !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.priority, it only can be set to the number.');
            }
            android['priority'] = priority;
        }
        if (category != null) {
            if (typeof category !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.category, it only can be set to the number.');
            }
            android['category'] = category;
        }
        if (style != null) {
            if (typeof style !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.style, it only can be set to the number.');
            }
            if (style === 1) {
                android['big_text'] = alert;
            }
            else if (style === 2) {
                android['inbox'] = alert;
            }
            else if (style === 3) {
                android['big_pic_path'] = alert;
            }
        }
        if (alertType != null) {
            if (typeof alertType !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.alertType, it only can be set to the number.');
            }
            android['alert_type'] = alertType;
        }
        return {
            'android': android
        };
    }
    ios(alert, sound, badge, contentAvailable, extras, category, mutableContent) {
        if (alert != null) {
            if (typeof alert !== 'string' && typeof alert !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('ios.alert is require and can only be set to the String or object');
            }
        }
        const ios = {
            'alert': alert
        };
        if (sound != null) {
            if (typeof sound !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.sound, it can only be set to the String');
            }
            ios['sound'] = sound;
        }
        if (badge != null) {
            ios['badge'] = badge;
        }
        if (contentAvailable != null) {
            if (typeof contentAvailable !== 'boolean') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.contentAvailable, it can only be set to the Boolean');
            }
            ios['content-available'] = contentAvailable;
        }
        if (extras != null) {
            if (typeof extras !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.extras');
            }
            ios['extras'] = extras;
        }
        if (category != null) {
            ios['category'] = category;
        }
        if (mutableContent != null) {
            if (typeof mutableContent !== 'boolean') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.mutable-content, it can only be set to the boolean.');
            }
            ios['mutable-content'] = mutableContent;
        }
        return {
            'ios': ios
        };
    }
    winphone(alert, title, openPage, extras) {
        if (alert != null) {
            if (typeof alert !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('winphone.alert is require and can only be set to the String');
            }
        }
        const winphone = {
            'alert': alert
        };
        if (title != null) {
            if (typeof title !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid winphone.title, it can only be set to the String');
            }
            winphone['title'] = title;
        }
        if (openPage != null) {
            if (typeof openPage !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid winphone.openPage, it can only be set to the String');
            }
            winphone['_open_page'] = openPage;
        }
        if (extras != null) {
            if (typeof extras !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid winphone.extras');
            }
            winphone['extras'] = extras;
        }
        return {
            'winphone': winphone
        };
    }
    setNotification() {
        if (arguments.length < 1) {
            throw new jpush_error_1.InvalidArgumentError('Invalid notification');
        }
        let notification = {};
        let offset = 0;
        if (typeof arguments[0] === 'string') {
            notification['alert'] = arguments[0];
            offset = 1;
        }
        for (; offset < arguments.length; offset++) {
            if (typeof arguments[offset] !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid notification argument at index ' + offset);
            }
            notification = (0, util_1.extend)(notification, arguments[offset]);
        }
        this.payload = (0, util_1.extend)(this.payload, {
            'notification': notification
        });
        return this;
    }
    setMessage(msg_content, title, content_type, extras) {
        if (msg_content == null || typeof msg_content !== 'string') {
            throw new jpush_error_1.InvalidArgumentError('message.msg_content is require and can only be set to the String');
        }
        const message = {
            'msg_content': msg_content
        };
        if (title != null) {
            if (typeof title !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid message.title, it can only be set to the String');
            }
            message['title'] = title;
        }
        if (content_type != null) {
            if (typeof content_type !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid message.content_type, it can only be set to the String');
            }
            message['content_type'] = content_type;
        }
        if (extras != null) {
            if (typeof extras !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid message.extras');
            }
            message['extras'] = extras;
        }
        this.payload = (0, util_1.extend)(this.payload, {
            'message': message
        });
        return this;
    }
    setSmsMessage(content, delay_time) {
        if (content == null || typeof content !== 'string') {
            throw new jpush_error_1.InvalidArgumentError('sms_message.content is require and can only be set to the String');
        }
        const sms_message = {
            'content': content
        };
        if (delay_time != null) {
            if (typeof delay_time !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid sms_message.delay_time, it can only be set to the Number');
            }
            sms_message['delay_time'] = delay_time;
        }
        this.payload = (0, util_1.extend)(this.payload, {
            'sms_message': sms_message
        });
        return this;
    }
    setOptions(sendno, time_to_live, override_msg_id, apns_production, big_push_duration, apns_collapse_id, third_party_channel) {
        const options = {};
        if (sendno != null) {
            if (typeof sendno !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid options.sendno, it can only be set to the Number');
            }
            options['sendno'] = sendno;
        }
        else {
            options['sendno'] = generateSendno();
        }
        if (time_to_live != null) {
            if (typeof time_to_live !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid options.time_to_live, it can only be set to the Number');
            }
            options['time_to_live'] = time_to_live;
        }
        if (override_msg_id != null) {
            if (typeof override_msg_id !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid options.override_msg_id, it can only be set to the Number');
            }
            options['override_msg_id'] = override_msg_id;
        }
        if (apns_production != null) {
            if (typeof apns_production !== 'boolean') {
                throw new jpush_error_1.InvalidArgumentError('Invalid options.apns_production, it can only be set to the Boolean');
            }
            options['apns_production'] = apns_production;
        }
        else {
            options['apns_production'] = true;
        }
        if (big_push_duration != null) {
            if (typeof big_push_duration !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid options.big_push_duration, it can only be set to the Number');
            }
            if (big_push_duration > 1400 || big_push_duration <= 0) {
                throw new jpush_error_1.InvalidArgumentError('Invalid options.big_push_duration, it should bigger than 0 and less than 1400');
            }
            options['big_push_duration'] = big_push_duration;
        }
        if (apns_collapse_id != null) {
            options['apns_collapse_id'] = apns_collapse_id;
        }
        if (third_party_channel != null) {
            if (typeof third_party_channel !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid options.third_party_channel, it can only be set to JSON Object');
            }
            options['third_party_channel'] = third_party_channel;
        }
        this.payload = (0, util_1.extend)(this.payload, {
            'options': options
        });
        return this;
    }
    toJSON() {
        this.payload.options = (0, util_1.extend)({
            'sendno': generateSendno(),
            'apns_production': false
        }, this.payload.options);
        return this.payload;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            this.validate(this.payload);
            const body = this.toJSON();
            return this.client.sendPush(body);
        });
    }
    sendValidate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.validate(this.payload);
            const body = this.toJSON();
            return this.client.validate(body);
        });
    }
    setSingleSchedule(date) {
        if (typeof date !== 'string') {
            throw new jpush_error_1.InvalidArgumentError('date must be set to the string.');
        }
        const single = {
            'time': date
        };
        this.trigger = (0, util_1.extend)(this.trigger, {
            'single': single
        });
        return this;
    }
    setPeriodicalSchedule(start, end, time, timeUnit, frequency, point) {
        const periodical = {
            'start': start,
            'end': end,
            'time': time,
            'time_unit': timeUnit,
            'frequency': frequency,
            'point': point
        };
        this.trigger = (0, util_1.extend)(this.trigger, {
            'periodical': periodical
        });
        return this;
    }
    setSchedule(name, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof name !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('name must be set to string.');
            }
            if (typeof enabled !== 'boolean') {
                throw new jpush_error_1.InvalidArgumentError('enabled must be set to boolean.');
            }
            this.validate(this.payload);
            this.payload.options = (0, util_1.extend)({
                'sendno': generateSendno(),
                'apns_production': false
            }, this.payload.options);
            const body = {
                'name': name,
                'enabled': enabled,
                'trigger': this.trigger,
                'push': this.payload
            };
            return this.client.setSchedule(body);
        });
    }
    updateSchedule(scheduleId, name, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof scheduleId !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Schedule ID must be set to string.');
            }
            let body = {};
            if (name != null) {
                if (typeof name !== 'string') {
                    throw new jpush_error_1.InvalidArgumentError('name must be set to string.');
                }
                body = (0, util_1.extend)(body, {
                    'name': name
                });
            }
            if (enabled != null) {
                if (typeof enabled !== 'boolean') {
                    throw new jpush_error_1.InvalidArgumentError('enabled must be set to boolean.');
                }
                body = (0, util_1.extend)(body, {
                    'enabled': enabled
                });
            }
            if (!(0, util_1.isEmptyObject)(this.trigger)) {
                body = (0, util_1.extend)(body, {
                    'trigger': this.trigger
                });
            }
            if (!(0, util_1.isEmptyObject)(this.payload)) {
                this.validate(this.payload);
                this.payload.options = (0, util_1.extend)({
                    'sendno': generateSendno(),
                    'apns_production': false
                }, this.payload.options);
                body = (0, util_1.extend)(body, {
                    'push': this.payload
                });
            }
            return this.client.updateSchedule(scheduleId, body);
        });
    }
    validate(payload) {
        const notification = payload.notification;
        const message = payload.message;
        if (!notification && !message) {
            throw new jpush_error_1.InvalidArgumentError('Either or both notification and message must be set.');
        }
    }
    calculateLength(str) {
        let re = [];
        for (let i = 0; i < str.length; i++) {
            let ch = str.charCodeAt(i);
            const st = [];
            do {
                st.push(ch & 0xFF);
                ch = ch >> 8;
            } while (ch);
            re = re.concat(st.reverse());
        }
        // return an array of bytes.
        return re.length;
    }
    isIosExceedLength() {
        let ios;
        const notification = this.payload.notification;
        const message = this.payload.message;
        const alert = (notification === null || notification === void 0 ? void 0 : notification.alert) ? notification.alert : '';
        ios = this.calculateLength(JSON.stringify((0, util_1.extend)({
            'alert': alert
        }, notification === null || notification === void 0 ? void 0 : notification.ios)));
        if (message != null) {
            const msgLen = this.calculateLength(JSON.stringify(message));
            return msgLen >= 1000;
        }
        return ios >= 2000;
    }
    isGlobalExceedLength() {
        let android = 0;
        let winphone = 0;
        let ios = false;
        const notification = this.payload.notification;
        const message = this.payload.message;
        const platform = this.payload.platform;
        let hasIOS = true;
        if (platform !== exports.ALL) {
            hasIOS = false;
            if (platform) {
                for (let i = 0; i < platform.length; i++) {
                    if (platform[i] === 'ios') {
                        hasIOS = true;
                        break;
                    }
                }
            }
        }
        if (hasIOS) {
            ios = this.isIosExceedLength();
        }
        if (notification != null) {
            const alert = notification.alert ? notification.alert : '';
            winphone = this.calculateLength(JSON.stringify((0, util_1.extend)({
                'alert': alert
            }, notification.winphone)));
            android = this.calculateLength(JSON.stringify((0, util_1.extend)({
                'alert': alert
            }, notification.android)));
        }
        if (message != null) {
            const msg_length = this.calculateLength(JSON.stringify(message));
            winphone += msg_length;
            android += msg_length;
        }
        return ios || winphone > 1000 || android > 1000;
    }
}
exports.PushPayload = PushPayload;
