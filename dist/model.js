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
Object.defineProperty(exports, "__esModule", { value: true });
exports.winphone = exports.ios = exports.android = exports.abtest = exports.segment = exports.registration_id = exports.tag_not = exports.tag_and = exports.tag = exports.alias = exports.buildAudience = void 0;
const JError = __importStar(require("./jpush-error"));
function buildAudience(args, title) {
    if (args.length < 1) {
        throw new JError.InvalidArgumentError('Should be set at least one ' + title);
    }
    let payload = [];
    let i;
    for (i = 0; i < args.length; i++) {
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
            throw new JError.InvalidArgumentError('Invalid ' + title + ' at index ' + i);
        }
    }
    return payload;
}
exports.buildAudience = buildAudience;
function alias() {
    return {
        'alias': buildAudience(arguments, 'alias')
    };
}
exports.alias = alias;
function tag() {
    return {
        'tag': buildAudience(arguments, 'tag')
    };
}
exports.tag = tag;
function tag_and() {
    return {
        'tag_and': buildAudience(arguments, 'tag_and')
    };
}
exports.tag_and = tag_and;
function tag_not() {
    return {
        'tag_not': buildAudience(arguments, 'tag_not')
    };
}
exports.tag_not = tag_not;
function registration_id() {
    return {
        'registration_id': buildAudience(arguments, 'registration_id')
    };
}
exports.registration_id = registration_id;
function segment() {
    return {
        'segment': buildAudience(arguments, 'segment')
    };
}
exports.segment = segment;
function abtest() {
    return {
        'abtest': buildAudience(arguments, 'abtest')
    };
}
exports.abtest = abtest;
function android(alert, title, builder_id, extras, priority, category, style, value, alertType, channel_id, uri_activity, uri_action, badge_class, badge_add_num) {
    if (alert != null) {
        if (typeof alert !== 'string') {
            throw new JError.InvalidArgumentError('android.alert is require and only can be set to the string');
        }
    }
    var android = {
        'alert': alert
    };
    if (title != null) {
        if (typeof title !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.title, it only can be set to the string');
        }
        android['title'] = title;
    }
    if (builder_id != null) {
        if (typeof builder_id !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.builder_id, it only can be set to the number');
        }
        android['builder_id'] = builder_id;
    }
    if (channel_id != null) {
        if (typeof channel_id !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.channel_id, it only can be set to the string');
        }
        android['channel_id'] = channel_id;
    }
    if (extras != null) {
        if (typeof extras !== 'object') {
            throw new JError.InvalidArgumentError('Invalid android.extras');
        }
        android['extras'] = extras;
    }
    if (priority != null) {
        if (typeof priority !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.priority, it only can be set to the number.');
        }
        android['priority'] = priority;
    }
    if (category != null) {
        if (typeof category !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.category, it only can be set to the number.');
        }
        android['category'] = category;
    }
    if (style != null) {
        if (typeof style !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.style, it only can be set to the number.');
        }
        if (style === 1) {
            android['big_text'] = value;
        }
        else if (style === 2) {
            android['inbox'] = value;
        }
        else if (style === 3) {
            android['big_pic_path'] = value;
        }
        android['style'] = style;
    }
    if (alertType != null) {
        if (typeof alertType !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.alertType, it only can be set to the number.');
        }
        android['alert_type'] = alertType;
    }
    if (uri_activity != null) {
        if (typeof uri_activity !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.uri_activity, it only can be set to the string.');
        }
        android['uri_activity'] = uri_activity;
    }
    if (uri_action != null) {
        if (typeof uri_action !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.uri_action, it only can be set to the string.');
        }
        android['uri_action'] = uri_action;
    }
    if (badge_class != null) {
        if (typeof badge_class !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.badge_class, it only can be set to the string.');
        }
        android['badge_class'] = badge_class;
    }
    if (badge_add_num != null) {
        if (typeof badge_add_num !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.badge_class, it only can be set to the number.');
        }
        android['badge_add_num'] = badge_add_num;
    }
    return {
        'android': android
    };
}
exports.android = android;
function ios(alert, sound, badge, contentAvailable, extras, category, mutableContent) {
    if (alert != null) {
        if (typeof alert !== 'string' && typeof alert !== 'object') {
            throw new JError.InvalidArgumentError('ios.alert is require and can only be set to the String or object');
        }
    }
    var ios = {
        'alert': alert
    };
    if (sound != null) {
        if (typeof sound !== 'string') {
            throw new JError.InvalidArgumentError('Invalid ios.sound, it can only be set to the String');
        }
        ios['sound'] = sound;
    }
    if (badge != null) {
        ios['badge'] = badge;
    }
    if (contentAvailable != null) {
        if (typeof contentAvailable !== 'boolean') {
            throw new JError.InvalidArgumentError('Invalid ios.contentAvailable, it can only be set to the Boolean');
        }
        ios['content-available'] = contentAvailable;
    }
    if (extras != null) {
        if (typeof extras !== 'object') {
            throw new JError.InvalidArgumentError('Invalid ios.extras');
        }
        ios['extras'] = extras;
    }
    if (category != null) {
        ios['category'] = category;
    }
    if (mutableContent != null) {
        if (typeof mutableContent !== 'boolean') {
            throw new JError.InvalidArgumentError('Invalid ios.mutable-content, it can only be set to the boolean.');
        }
        ios['mutable-content'] = mutableContent;
    }
    return {
        'ios': ios
    };
}
exports.ios = ios;
function winphone(alert, title, openPage, extras) {
    if (alert != null) {
        if (typeof alert !== 'string') {
            throw new JError.InvalidArgumentError('winphone.alert is require and can only be set to the String');
        }
    }
    var winphone = {
        'alert': alert
    };
    if (title != null) {
        if (typeof title !== 'string') {
            throw new JError.InvalidArgumentError('Invalid winphone.title, it can only be set to the String');
        }
        winphone['title'] = title;
    }
    if (openPage != null) {
        if (typeof openPage !== 'string') {
            throw new JError.InvalidArgumentError('Invalid winphone.openPage, it can only be set to the String');
        }
        winphone['_open_page'] = openPage;
    }
    if (extras != null) {
        if (typeof extras !== 'object') {
            throw new JError.InvalidArgumentError('Invalid winphone.extras');
        }
        winphone['extras'] = extras;
    }
    return {
        'winphone': winphone
    };
}
exports.winphone = winphone;
