"use strict";
/* eslint-disable camelcase */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushPayload = exports.ALL = void 0;
const jpush_error_1 = require("../jpush-error");
const JUtil = __importStar(require("../util"));
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
        this.payload = JUtil.extend(this.payload, {
            'platform': platform
        });
        return this;
    }
    buildAudience(args, title) {
        if (args.length < 1) {
            throw new jpush_error_1.InvalidArgumentError('Should be set at least one ' + title);
        }
        let payload = [];
        let i;
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === 'string') {
                payload.push(args[i]);
            }
            else if (typeof args[i] === 'number') {
                payload.push(args[i].toString());
            }
            else if (typeof args[i] === 'object' && args[i].length != null) {
                payload = payload.concat(args[i]);
            }
            else {
                throw new jpush_error_1.InvalidArgumentError('Invalid ' + title + ' at index ' + i);
            }
        }
        return payload;
    }
    setAudience() {
        if (arguments.length < 1) {
            throw new jpush_error_1.InvalidArgumentError("audience's args cannot all be null");
        }
        let audience, i;
        if (arguments.length === 1 && arguments[0] === exports.ALL) {
            audience = exports.ALL;
        }
        else if (arguments.length === 1 && typeof arguments[0] === 'object') {
            audience = {};
            for (let i in arguments[0]) {
                if (arguments[0].hasOwnProperty(i)) {
                    if (i === 'tag') {
                        audience[i] = this.buildAudience(arguments[0][i], i);
                    }
                    else if (i === 'tag_and') {
                        audience[i] = this.buildAudience(arguments[0][i], i);
                    }
                    else if (i === 'tag_not') {
                        audience[i] = this.buildAudience(arguments[0][i], i);
                    }
                    else if (i === 'alias') {
                        audience[i] = this.buildAudience(arguments[0][i], i);
                    }
                    else if (i === 'registration_id') {
                        audience[i] = this.buildAudience(arguments[0][i], i);
                    }
                    else if (i === 'segment') {
                        audience[i] = arguments[0][i];
                    }
                    else if (i === 'abtest') {
                        audience[i] = arguments[0][i];
                    }
                    else {
                        throw new jpush_error_1.InvalidArgumentError("Invalid audience type '" + i + "'");
                    }
                }
            }
        }
        else {
            audience = {};
            for (let i = 0; i < arguments.length; i++) {
                if (VALID_DEVICE_TYPES.indexOf(arguments[i]) !== -1) {
                    if (audience.hasOwnProperty('registration_id')) {
                        throw new jpush_error_1.InvalidArgumentError('registration_id cannot be set with ' + arguments[i]);
                    }
                    audience[arguments[i]] = exports.ALL;
                }
                else if (typeof arguments[i] === 'string') {
                    if (audience.hasOwnProperty('alias')) {
                        throw new jpush_error_1.InvalidArgumentError('alias cannot be set with ' + arguments[i]);
                    }
                    audience['alias'] = arguments[i];
                }
                else if (typeof arguments[i] === 'number') {
                    if (audience.hasOwnProperty('registration_id')) {
                        throw new jpush_error_1.InvalidArgumentError('registration_id cannot be set with ' + arguments[i]);
                    }
                    audience['registration_id'] = arguments[i].toString();
                }
                else {
                    throw new jpush_error_1.InvalidArgumentError('Invalid audience at index ' + i);
                }
            }
        }
        this.payload = JUtil.extend(this.payload, {
            'audience': audience
        });
        return this;
    }
    android(alert, title, builder_id, extras, alert_type, big_text, inbox, big_pic_path, priority, category, style, uri_activity, uri_action, badge_class, badge_add_num) {
        const android = {};
        if (alert != null) {
            if (typeof alert !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.alert, it can only be set to the String');
            }
            android['alert'] = alert;
        }
        if (title != null) {
            if (typeof title !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.title, it can only be set to the String');
            }
            android['title'] = title;
        }
        if (builder_id != null) {
            if (typeof builder_id !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.builder_id, it can only be set to the Number');
            }
            android['builder_id'] = builder_id;
        }
        if (extras != null) {
            if (typeof extras !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.extras');
            }
            android['extras'] = extras;
        }
        if (alert_type != null) {
            if (typeof alert_type !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.alert_type, it only can be set to the number.');
            }
            android['alert_type'] = alert_type;
        }
        if (big_text != null) {
            if (typeof big_text !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.big_text, it only can be set to the string.');
            }
            android['big_text'] = big_text;
        }
        if (inbox != null) {
            if (typeof inbox !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.inbox, it only can be set to the JSON object.');
            }
            android['inbox'] = inbox;
        }
        if (big_pic_path != null) {
            if (typeof big_pic_path !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.big_pic_path, it only can be set to the string.');
            }
            android['big_pic_path'] = big_pic_path;
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
                android['big_text'] = big_text;
            }
            else if (style === 2) {
                android['inbox'] = inbox;
            }
            else if (style === 3) {
                android['big_pic_path'] = big_pic_path;
            }
            android['style'] = style;
        }
        if (uri_activity != null) {
            if (typeof uri_activity !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.uri_activity, it only can be set to the string.');
            }
            android['uri_activity'] = uri_activity;
        }
        if (uri_action != null) {
            if (typeof uri_action !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.uri_action, it only can be set to the string.');
            }
            android['uri_action'] = uri_action;
        }
        if (badge_class != null) {
            if (typeof badge_class !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.badge_class, it only can be set to the string.');
            }
            android['badge_class'] = badge_class;
        }
        if (badge_add_num != null) {
            if (typeof badge_add_num !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid android.badge_add_num, it only can be set to the number.');
            }
            android['badge_add_num'] = badge_add_num;
        }
        this.payload = JUtil.extend(this.payload, {
            'notification': {
                'android': android
            }
        });
        return this;
    }
    ios(alert, sound, badge, extras, category, contentAvailable, mutableContent, threadId, targetContentId, targetContentAvailable, alertType, bigPayload, title, subtitle, body, titleLocKey, titleLocArgs, actionLocKey, locKey, locArgs, launchImage, attachment, summaryArg, summaryArgCount, targetContent) {
        const ios = {};
        if (alert != null) {
            if (typeof alert === 'string') {
                ios['alert'] = alert;
            }
            else if (typeof alert === 'object') {
                ios['alert'] = {
                    'title': alert.title,
                    'subtitle': alert.subtitle,
                    'body': alert.body
                };
                if (alert.titleLocKey != null) {
                    ios['alert']['title-loc-key'] = alert.titleLocKey;
                }
                if (alert.titleLocArgs != null) {
                    ios['alert']['title-loc-args'] = alert.titleLocArgs;
                }
                if (alert.actionLocKey != null) {
                    ios['alert']['action-loc-key'] = alert.actionLocKey;
                }
                if (alert.locKey != null) {
                    ios['alert']['loc-key'] = alert.locKey;
                }
                if (alert.locArgs != null) {
                    ios['alert']['loc-args'] = alert.locArgs;
                }
                if (alert.launchImage != null) {
                    ios['alert']['launch-image'] = alert.launchImage;
                }
            }
            else {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.alert, it can only be set to the String or JSON Object');
            }
        }
        if (sound != null) {
            if (typeof sound === 'string') {
                ios['sound'] = sound;
            }
            else {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.sound, it can only be set to the String');
            }
        }
        if (badge != null) {
            if (typeof badge === 'number') {
                ios['badge'] = badge;
            }
            else {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.badge, it can only be set to the Number');
            }
        }
        if (extras != null) {
            if (typeof extras !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.extras');
            }
            ios['extras'] = extras;
        }
        if (category != null) {
            if (typeof category !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.category, it can only be set to the String');
            }
            ios['category'] = category;
        }
        if (contentAvailable != null) {
            if (typeof contentAvailable !== 'boolean') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.contentAvailable, it can only be set to the Boolean');
            }
            ios['content-available'] = contentAvailable ? 1 : 0;
        }
        if (mutableContent != null) {
            if (typeof mutableContent !== 'boolean') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.mutableContent, it can only be set to the Boolean');
            }
            ios['mutable-content'] = mutableContent ? 1 : 0;
        }
        if (threadId != null) {
            if (typeof threadId !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.threadId, it can only be set to the String');
            }
            ios['thread-id'] = threadId;
        }
        if (targetContentId != null) {
            if (typeof targetContentId !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.targetContentId, it can only be set to the String');
            }
            ios['target-content-id'] = targetContentId;
        }
        if (targetContentAvailable != null) {
            if (typeof targetContentAvailable !== 'boolean') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.targetContentAvailable, it can only be set to the Boolean');
            }
            ios['target-content-available'] = targetContentAvailable ? 1 : 0;
        }
        if (alertType != null) {
            if (typeof alertType !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.alertType, it can only be set to the Number');
            }
            ios['alert-type'] = alertType;
        }
        if (bigPayload != null) {
            if (typeof bigPayload !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.bigPayload, it can only be set to the JSON Object');
            }
            ios['bigPayload'] = bigPayload;
        }
        if (title != null) {
            if (typeof title !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.title, it can only be set to the String');
            }
            ios['title'] = title;
        }
        if (subtitle != null) {
            if (typeof subtitle !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.subtitle, it can only be set to the String');
            }
            ios['subtitle'] = subtitle;
        }
        if (body != null) {
            if (typeof body !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.body, it can only be set to the String');
            }
            ios['body'] = body;
        }
        if (titleLocKey != null) {
            if (typeof titleLocKey !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.titleLocKey, it can only be set to the String');
            }
            ios['title-loc-key'] = titleLocKey;
        }
        if (titleLocArgs != null) {
            if (typeof titleLocArgs !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.titleLocArgs, it can only be set to the JSON Object');
            }
            ios['title-loc-args'] = titleLocArgs;
        }
        if (actionLocKey != null) {
            if (typeof actionLocKey !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.actionLocKey, it can only be set to the String');
            }
            ios['action-loc-key'] = actionLocKey;
        }
        if (locKey != null) {
            if (typeof locKey !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.locKey, it can only be set to the String');
            }
            ios['loc-key'] = locKey;
        }
        if (locArgs != null) {
            if (typeof locArgs !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.locArgs, it can only be set to the JSON Object');
            }
            ios['loc-args'] = locArgs;
        }
        if (launchImage != null) {
            if (typeof launchImage !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.launchImage, it can only be set to the String');
            }
            ios['launch-image'] = launchImage;
        }
        if (attachment != null) {
            if (typeof attachment !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.attachment, it can only be set to the JSON Object');
            }
            ios['attachment'] = attachment;
        }
        if (summaryArg != null) {
            if (typeof summaryArg !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.summaryArg, it can only be set to the String');
            }
            ios['summary-arg'] = summaryArg;
        }
        if (summaryArgCount != null) {
            if (typeof summaryArgCount !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.summaryArgCount, it can only be set to the Number');
            }
            ios['summary-arg-count'] = summaryArgCount;
        }
        if (targetContent != null) {
            if (typeof targetContent !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid ios.targetContent, it can only be set to the JSON Object');
            }
            ios['target-content'] = targetContent;
        }
        this.payload = JUtil.extend(this.payload, {
            'notification': {
                'ios': ios
            }
        });
        return this;
    }
    winphone(alert, title, open_page, extras) {
        const winphone = {};
        if (alert != null) {
            if (typeof alert !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid winphone.alert, it can only be set to the String');
            }
            winphone['alert'] = alert;
        }
        if (title != null) {
            if (typeof title !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid winphone.title, it can only be set to the String');
            }
            winphone['title'] = title;
        }
        if (open_page != null) {
            if (typeof open_page !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid winphone.open_page, it can only be set to the String');
            }
            winphone['open_page'] = open_page;
        }
        if (extras != null) {
            if (typeof extras !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid winphone.extras');
            }
            winphone['extras'] = extras;
        }
        this.payload = JUtil.extend(this.payload, {
            'notification': {
                'winphone': winphone
            }
        });
        return this;
    }
    smsMessage(content, delay_time, sign_id, active_filter, template_id, temp_para) {
        const sms_message = {};
        if (content != null) {
            if (typeof content !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid sms_message.content, it can only be set to the String');
            }
            sms_message['content'] = content;
        }
        if (delay_time != null) {
            if (typeof delay_time !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid sms_message.delay_time, it can only be set to the Number');
            }
            sms_message['delay_time'] = delay_time;
        }
        if (sign_id != null) {
            if (typeof sign_id !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid sms_message.sign_id, it can only be set to the String');
            }
            sms_message['sign_id'] = sign_id;
        }
        if (active_filter != null) {
            if (typeof active_filter !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid sms_message.active_filter, it can only be set to the Number');
            }
            sms_message['active_filter'] = active_filter;
        }
        if (template_id != null) {
            if (typeof template_id !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid sms_message.template_id, it can only be set to the Number');
            }
            sms_message['template_id'] = template_id;
        }
        if (temp_para != null) {
            if (typeof temp_para !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid sms_message.temp_para');
            }
            sms_message['temp_para'] = temp_para;
        }
        this.payload = JUtil.extend(this.payload, {
            'sms_message': sms_message
        });
        return this;
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
            notification = JUtil.extend(notification, arguments[offset]);
        }
        this.payload = JUtil.extend(this.payload, {
            'notification': notification
        });
        return this;
    }
    setOptions(sendno, time_to_live, override_msg_id, apns_production, big_push_duration, third_party_channel, third_party_channel_id, third_party_callbacks, callback) {
        if (!this.payload.options) {
            this.payload.options = {};
        }
        if (sendno != null) {
            if (typeof sendno !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid sendno, it can only be set to the Number');
            }
            this.payload.options['sendno'] = sendno;
        }
        if (time_to_live != null) {
            if (typeof time_to_live !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid time_to_live, it can only be set to the Number');
            }
            this.payload.options['time_to_live'] = time_to_live;
        }
        if (override_msg_id != null) {
            if (typeof override_msg_id !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid override_msg_id, it can only be set to the Number');
            }
            this.payload.options['override_msg_id'] = override_msg_id;
        }
        this.payload.options['apns_production'] = !!apns_production;
        if (big_push_duration != null) {
            if (typeof big_push_duration !== 'number') {
                throw new jpush_error_1.InvalidArgumentError('Invalid big_push_duration, it can only be set to the Number');
            }
            this.payload.options['big_push_duration'] = big_push_duration;
        }
        if (third_party_channel != null) {
            if (typeof third_party_channel !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid third_party_channel, it can only be set to the String');
            }
            this.payload.options['third_party_channel'] = third_party_channel;
        }
        if (third_party_channel_id != null) {
            if (typeof third_party_channel_id !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('Invalid third_party_channel_id, it can only be set to the String');
            }
            this.payload.options['third_party_channel_id'] = third_party_channel_id;
        }
        if (third_party_callbacks != null) {
            if (typeof third_party_callbacks !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid third_party_callbacks');
            }
            this.payload.options['third_party_callbacks'] = third_party_callbacks;
        }
        if (callback != null) {
            if (typeof callback !== 'object') {
                throw new jpush_error_1.InvalidArgumentError('Invalid callback');
            }
            this.payload.options['callback'] = callback;
        }
        return this;
    }
    toJSON() {
        return this.payload;
    }
    send(callback) {
        this.sendValidate();
        return this.client.sendPush(JSON.stringify(this.payload), callback);
    }
    sendValidate() {
        if (this.payload.platform == null) {
            throw new jpush_error_1.InvalidArgumentError('Platform must be set');
        }
        if (this.payload.platform.length === 0) {
            throw new jpush_error_1.InvalidArgumentError('Platform must be set');
        }
        if (this.payload.audience == null) {
            throw new jpush_error_1.InvalidArgumentError('Audience must be set');
        }
        if (this.payload.notification == null && this.payload.message == null) {
            throw new jpush_error_1.InvalidArgumentError('Either notification or message must be set');
        }
        if (this.isGlobalExceedLength()) {
            throw new jpush_error_1.InvalidArgumentError('The global push payload length cannot exceed 8k bytes');
        }
    }
    setSingleSchedule(date) {
        if (typeof date !== 'string') {
            throw new jpush_error_1.InvalidArgumentError('date must be set to the string.');
        }
        const single = {
            'time': date
        };
        this.trigger = JUtil.extend(this.trigger, {
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
        this.trigger = JUtil.extend(this.trigger, {
            'periodical': periodical
        });
        return this;
    }
    setSchedule(name, enabled, callback) {
        if (typeof name !== 'string') {
            throw new jpush_error_1.InvalidArgumentError('name must be set to string.');
        }
        if (typeof enabled !== 'boolean') {
            throw new jpush_error_1.InvalidArgumentError('enabled must be set to boolean.');
        }
        this.validate(this.payload);
        this.payload.options = JUtil.extend({
            'sendno': generateSendno(),
            'apns_production': false
        }, this.payload.options);
        const body = {
            'name': name,
            'enabled': enabled,
            'trigger': this.trigger,
            'push': this.payload
        };
        return this.client.setSchedule(JSON.stringify(body), callback);
    }
    updateSchedule(scheduleId, name, enabled, callback) {
        if (typeof scheduleId !== 'string') {
            throw new jpush_error_1.InvalidArgumentError('Schedule ID must be set to string.');
        }
        let body = {};
        if (name != null) {
            if (typeof name !== 'string') {
                throw new jpush_error_1.InvalidArgumentError('name must be set to string.');
            }
            body = JUtil.extend(body, {
                'name': name
            });
        }
        if (enabled != null) {
            if (typeof enabled !== 'boolean') {
                throw new jpush_error_1.InvalidArgumentError('enabled must be set to boolean.');
            }
            body = JUtil.extend(body, {
                'enabled': enabled
            });
        }
        if (!JUtil.isEmptyObject(this.trigger)) {
            body = JUtil.extend(body, {
                'trigger': this.trigger
            });
        }
        if (!JUtil.isEmptyObject(this.payload)) {
            this.validate(this.payload);
            this.payload.options = JUtil.extend({
                'sendno': generateSendno(),
                'apns_production': false
            }, this.payload.options);
            body = JUtil.extend(body, {
                'push': this.payload
            });
        }
        return this.client.updateSchedule(scheduleId, JSON.stringify(body), callback);
    }
    validate(payload) {
        const notification = payload.notification;
        const message = payload.message;
        if (!notification && !message) {
            throw new jpush_error_1.InvalidArgumentError('Either or both notification and message must be set.');
        }
    }
    calculateLength(str) {
        let ch = [];
        let st = [];
        let re = [];
        for (let i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);
            st = [];
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
        const alert = notification.alert ? notification.alert : '';
        ios = this.calculateLength(JSON.stringify(JUtil.extend({
            'alert': alert
        }, notification.ios)));
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
            for (let i = 0; i < platform.length; i++) {
                if (platform[i] === 'ios') {
                    hasIOS = true;
                    break;
                }
            }
        }
        if (hasIOS) {
            ios = this.isIosExceedLength();
        }
        if (notification != null) {
            const alert = notification.alert ? notification.alert : '';
            winphone = this.calculateLength(JSON.stringify(JUtil.extend({
                'alert': alert
            }, notification.winphone)));
            android = this.calculateLength(JSON.stringify(JUtil.extend({
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
