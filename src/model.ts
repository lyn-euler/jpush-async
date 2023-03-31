import * as JUtil from './util'
import * as JError from './jpush-error'

export function buildAudience(args: any, title: string): string[] {
    if (args.length < 1) {
        throw new JError.InvalidArgumentError('Should be set at least one ' + title)
    }
    let payload: string[] = []
    let i
    for (i = 0; i < args.length; i++) {
        if (typeof args[i] === 'string') {
            payload.push(args[i])
        } else if (typeof args[i] === 'number') {
            payload.push(args[i].toString())
        } else if (typeof args[i] === 'object' && args[i].length != null) {
            payload = payload.concat(args[i])
        } else {
            throw new JError.InvalidArgumentError('Invalid ' + title + ' at index ' + i)
        }
    }
    return payload
}
type AudienceType = string | number | (string | number)[]
export function alias(...args: AudienceType[]) {
    return {
        'alias': buildAudience(args, 'alias')
    }
}

export function tag(...args: AudienceType[]) {
    return {
        'tag': buildAudience(args, 'tag')
    }
}

export function tag_and(...args: AudienceType[]) {
    return {
        'tag_and': buildAudience(args, 'tag_and')
    }
}

export function tag_not(...args: AudienceType[]) {
    return {
        'tag_not': buildAudience(args, 'tag_not')
    }
}

export function registration_id(...args: AudienceType[]) {
    return {
        'registration_id': buildAudience(args, 'registration_id')
    }
}

export function segment(...args: AudienceType[]) {
    return {
        'segment': buildAudience(args, 'segment')
    }
}

export function abtest(...args: AudienceType[]) {
    return {
        'abtest': buildAudience(args, 'abtest')
    }
}



export function android(alert: string | null, title: string | null, builder_id: number | null, extras: object | null,
    priority: number | null, category: string | null, style: number | null, value: string | null,
    alertType: number | null, channel_id: string | null, uri_activity: string | null,
    uri_action: string | null, badge_class: string | null, badge_add_num: number | null) {
    if (alert != null) {
        if (typeof alert !== 'string') {
            throw new JError.InvalidArgumentError('android.alert is require and only can be set to the string')
        }
    }
    var android: Record<string, any> = {
        'alert': alert
    }

    if (title != null) {
        if (typeof title !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.title, it only can be set to the string')
        }
        android['title'] = title
    }

    if (builder_id != null) {
        if (typeof builder_id !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.builder_id, it only can be set to the number')
        }
        android['builder_id'] = builder_id
    }

    if (channel_id != null) {
        if (typeof channel_id !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.channel_id, it only can be set to the string')
        }
        android['channel_id'] = channel_id
    }

    if (extras != null) {
        if (typeof extras !== 'object') {
            throw new JError.InvalidArgumentError('Invalid android.extras')
        }
        android['extras'] = extras
    }

    if (priority != null) {
        if (typeof priority !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.priority, it only can be set to the number.')
        }
        android['priority'] = priority
    }

    if (category != null) {
        if (typeof category !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.category, it only can be set to the number.')
        }
        android['category'] = category
    }

    if (style != null) {
        if (typeof style !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.style, it only can be set to the number.')
        }
        if (style === 1) {
            android['big_text'] = value
        } else if (style === 2) {
            android['inbox'] = value
        } else if (style === 3) {
            android['big_pic_path'] = value
        }
        android['style'] = style
    }

    if (alertType != null) {
        if (typeof alertType !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.alertType, it only can be set to the number.')
        }
        android['alert_type'] = alertType
    }

    if (uri_activity != null) {
        if (typeof uri_activity !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.uri_activity, it only can be set to the string.')
        }
        android['uri_activity'] = uri_activity
    }

    if (uri_action != null) {
        if (typeof uri_action !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.uri_action, it only can be set to the string.')
        }
        android['uri_action'] = uri_action
    }

    if (badge_class != null) {
        if (typeof badge_class !== 'string') {
            throw new JError.InvalidArgumentError('Invalid android.badge_class, it only can be set to the string.')
        }
        android['badge_class'] = badge_class
    }

    if (badge_add_num != null) {
        if (typeof badge_add_num !== 'number') {
            throw new JError.InvalidArgumentError('Invalid android.badge_class, it only can be set to the number.')
        }
        android['badge_add_num'] = badge_add_num
    }


    return {
        'android': android
    }
}

export function ios(alert: string | object | null, sound: string | null, badge: number | null, contentAvailable: boolean | null, extras: object | null, category: number | null, mutableContent: boolean | null) {
    if (alert != null) {
        if (typeof alert !== 'string' && typeof alert !== 'object') {
            throw new JError.InvalidArgumentError('ios.alert is require and can only be set to the String or object')
        }
    }
    var ios: Record<string, any> = {
        'alert': alert
    }

    if (sound != null) {
        if (typeof sound !== 'string') {
            throw new JError.InvalidArgumentError('Invalid ios.sound, it can only be set to the String')
        }
        ios['sound'] = sound
    }

    if (badge != null) {
        ios['badge'] = badge
    }

    if (contentAvailable != null) {
        if (typeof contentAvailable !== 'boolean') {
            throw new JError.InvalidArgumentError('Invalid ios.contentAvailable, it can only be set to the Boolean')
        }
        ios['content-available'] = contentAvailable
    }

    if (extras != null) {
        if (typeof extras !== 'object') {
            throw new JError.InvalidArgumentError('Invalid ios.extras')
        }
        ios['extras'] = extras
    }

    if (category != null) {
        ios['category'] = category
    }

    if (mutableContent != null) {
        if (typeof mutableContent !== 'boolean') {
            throw new JError.InvalidArgumentError('Invalid ios.mutable-content, it can only be set to the boolean.')
        }
        ios['mutable-content'] = mutableContent
    }
    return {
        'ios': ios
    }
}

export function winphone(alert: string, title: string, openPage: string | null, extras: object | null) {
    if (alert != null) {
        if (typeof alert !== 'string') {
            throw new JError.InvalidArgumentError('winphone.alert is require and can only be set to the String')
        }
    }

    var winphone: Record<string, any> = {
        'alert': alert
    }

    if (title != null) {
        if (typeof title !== 'string') {
            throw new JError.InvalidArgumentError('Invalid winphone.title, it can only be set to the String')
        }
        winphone['title'] = title
    }

    if (openPage != null) {
        if (typeof openPage !== 'string') {
            throw new JError.InvalidArgumentError('Invalid winphone.openPage, it can only be set to the String')
        }
        winphone['_open_page'] = openPage
    }

    if (extras != null) {
        if (typeof extras !== 'object') {
            throw new JError.InvalidArgumentError('Invalid winphone.extras')
        }
        winphone['extras'] = extras
    }

    return {
        'winphone': winphone
    }
}

