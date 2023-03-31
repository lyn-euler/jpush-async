/* eslint-disable camelcase */

import { InvalidArgumentError } from '../jpush-error'
import { extend, isEmptyObject } from '../util'

export const ALL = 'all'
const VALID_DEVICE_TYPES = ['android', 'ios', 'winphone']
const MIN_SENDNO = 100000
const MAX_SENDNO = 2147483647

function generateSendno() {
  return (MIN_SENDNO + Math.round(Math.random() * (MAX_SENDNO - MIN_SENDNO)))
}

interface Payload {
  platform?: string | string[]
  audience?: object
  notification?: Record<string, any>
  message?: object
  sms_message?: object
  options?: object
  [propName: string]: any
}

interface Trigger {
  single?: object
  periodical?: object
  [propName: string]: any
}

export class PushPayload {
  client: any
  payload: Payload
  trigger: Trigger

  constructor(client: any) {
    this.client = client
    this.payload = {}
    this.trigger = {}
  }

  setPlatform(platform: string | string[] | 'all') {
    this.payload = extend(this.payload, {
      'platform': platform
    })
    return this
  }

  setAudience(audience: object) {
    if (audience == null) {
      throw new InvalidArgumentError('audience cannot be null')
    }
    this.payload = extend(this.payload, {
      'audience': audience
    })
    return this
  }

  android(alert: string, title?: string, builder_id?: number, channel_id?: string, extras?: object, priority?: number, category?: string, style?: number, alertType?: number) {
    if (alert != null) {
      if (typeof alert !== 'string') {
        throw new InvalidArgumentError('android.alert is require and only can be set to the string')
      }
    }
    const android: any = {
      'alert': alert
    }

    if (title != null) {
      if (typeof title !== 'string') {
        throw new InvalidArgumentError('Invalid android.title, it only can be set to the string')
      }
      android['title'] = title
    }

    if (builder_id != null) {
      if (typeof builder_id !== 'number') {
        throw new InvalidArgumentError('Invalid android.builder_id, it only can be set to the number')
      }
      android['builder_id'] = builder_id
    }

    if (channel_id != null) {
      if (typeof channel_id !== 'string') {
        throw new InvalidArgumentError('Invalid android.channel_id, it only can be set to the string')
      }
      android['channel_id'] = channel_id
    }

    if (extras != null) {
      if (typeof extras !== 'object') {
        throw new InvalidArgumentError('Invalid android.extras')
      }
      android['extras'] = extras
    }

    if (priority != null) {
      if (typeof priority !== 'number') {
        throw new InvalidArgumentError('Invalid android.priority, it only can be set to the number.')
      }
      android['priority'] = priority
    }

    if (category != null) {
      if (typeof category !== 'string') {
        throw new InvalidArgumentError('Invalid android.category, it only can be set to the number.')
      }
      android['category'] = category
    }

    if (style != null) {
      if (typeof style !== 'number') {
        throw new InvalidArgumentError('Invalid android.style, it only can be set to the number.')
      }
      if (style === 1) {
        android['big_text'] = alert
      } else if (style === 2) {
        android['inbox'] = alert
      } else if (style === 3) {
        android['big_pic_path'] = alert
      }
    }

    if (alertType != null) {
      if (typeof alertType !== 'number') {
        throw new InvalidArgumentError('Invalid android.alertType, it only can be set to the number.')
      }
      android['alert_type'] = alertType
    }

    return {
      'android': android
    }
  }

  ios(alert: string | object, sound?: string, badge?: number, contentAvailable?: boolean, extras?: object, category?: string, mutableContent?: boolean) {
    if (alert != null) {
      if (typeof alert !== 'string' && typeof alert !== 'object') {
        throw new InvalidArgumentError('ios.alert is require and can only be set to the String or object')
      }
    }
    const ios: any = {
      'alert': alert
    }

    if (sound != null) {
      if (typeof sound !== 'string') {
        throw new InvalidArgumentError('Invalid ios.sound, it can only be set to the String')
      }
      ios['sound'] = sound
    }

    if (badge != null) {
      ios['badge'] = badge
    }

    if (contentAvailable != null) {
      if (typeof contentAvailable !== 'boolean') {
        throw new InvalidArgumentError('Invalid ios.contentAvailable, it can only be set to the Boolean')
      }
      ios['content-available'] = contentAvailable
    }

    if (extras != null) {
      if (typeof extras !== 'object') {
        throw new InvalidArgumentError('Invalid ios.extras')
      }
      ios['extras'] = extras
    }

    if (category != null) {
      ios['category'] = category
    }

    if (mutableContent != null) {
      if (typeof mutableContent !== 'boolean') {
        throw new InvalidArgumentError('Invalid ios.mutable-content, it can only be set to the boolean.')
      }
      ios['mutable-content'] = mutableContent
    }
    return {
      'ios': ios
    }
  }

  winphone(alert: string, title?: string, openPage?: string, extras?: object) {
    if (alert != null) {
      if (typeof alert !== 'string') {
        throw new InvalidArgumentError('winphone.alert is require and can only be set to the String')
      }
    }

    const winphone: any = {
      'alert': alert
    }

    if (title != null) {
      if (typeof title !== 'string') {
        throw new InvalidArgumentError('Invalid winphone.title, it can only be set to the String')
      }
      winphone['title'] = title
    }

    if (openPage != null) {
      if (typeof openPage !== 'string') {
        throw new InvalidArgumentError('Invalid winphone.openPage, it can only be set to the String')
      }
      winphone['_open_page'] = openPage
    }

    if (extras != null) {
      if (typeof extras !== 'object') {
        throw new InvalidArgumentError('Invalid winphone.extras')
      }
      winphone['extras'] = extras
    }

    return {
      'winphone': winphone
    }
  }

  setNotification(alert: string, ...payloads: Record<string, unknown>[]) {
    let notification: any = { alert }

    for (const payload of payloads) {
      notification = extend(notification, payload)
    }

    this.payload = extend(this.payload, {
      'notification': notification
    })
    return this
  }

  setMessage(msg_content: string, title?: string, content_type?: string, extras?: object) {
    if (msg_content == null || typeof msg_content !== 'string') {
      throw new InvalidArgumentError('message.msg_content is require and can only be set to the String')
    }
    const message: any = {
      'msg_content': msg_content
    }

    if (title != null) {
      if (typeof title !== 'string') {
        throw new InvalidArgumentError('Invalid message.title, it can only be set to the String')
      }
      message['title'] = title
    }

    if (content_type != null) {
      if (typeof content_type !== 'string') {
        throw new InvalidArgumentError('Invalid message.content_type, it can only be set to the String')
      }
      message['content_type'] = content_type
    }

    if (extras != null) {
      if (typeof extras !== 'object') {
        throw new InvalidArgumentError('Invalid message.extras')
      }
      message['extras'] = extras
    }

    this.payload = extend(this.payload, {
      'message': message
    })
    return this
  }

  setSmsMessage(content: string, delay_time?: number) {
    if (content == null || typeof content !== 'string') {
      throw new InvalidArgumentError('sms_message.content is require and can only be set to the String')
    }
    const sms_message: any = {
      'content': content
    }

    if (delay_time != null) {
      if (typeof delay_time !== 'number') {
        throw new InvalidArgumentError('Invalid sms_message.delay_time, it can only be set to the Number')
      }
      sms_message['delay_time'] = delay_time
    }

    this.payload = extend(this.payload, {
      'sms_message': sms_message
    })
    return this
  }

  setOptions(sendno?: number, time_to_live?: number, override_msg_id?: number, apns_production?: boolean, big_push_duration?: number, apns_collapse_id?: string, third_party_channel?: object) {
    const options: any = {}

    if (sendno != null) {
      if (typeof sendno !== 'number') {
        throw new InvalidArgumentError('Invalid options.sendno, it can only be set to the Number')
      }
      options['sendno'] = sendno
    } else {
      options['sendno'] = generateSendno()
    }

    if (time_to_live != null) {
      if (typeof time_to_live !== 'number') {
        throw new InvalidArgumentError('Invalid options.time_to_live, it can only be set to the Number')
      }
      options['time_to_live'] = time_to_live
    }

    if (override_msg_id != null) {
      if (typeof override_msg_id !== 'number') {
        throw new InvalidArgumentError('Invalid options.override_msg_id, it can only be set to the Number')
      }
      options['override_msg_id'] = override_msg_id
    }

    if (apns_production != null) {
      if (typeof apns_production !== 'boolean') {
        throw new InvalidArgumentError('Invalid options.apns_production, it can only be set to the Boolean')
      }
      options['apns_production'] = apns_production
    } else {
      options['apns_production'] = true
    }

    if (big_push_duration != null) {
      if (typeof big_push_duration !== 'number') {
        throw new InvalidArgumentError('Invalid options.big_push_duration, it can only be set to the Number')
      }

      if (big_push_duration > 1400 || big_push_duration <= 0) {
        throw new InvalidArgumentError('Invalid options.big_push_duration, it should bigger than 0 and less than 1400')
      }
      options['big_push_duration'] = big_push_duration
    }

    if (apns_collapse_id != null) {
      options['apns_collapse_id'] = apns_collapse_id
    }

    if (third_party_channel != null) {
      if (typeof third_party_channel !== 'object') {
        throw new InvalidArgumentError('Invalid options.third_party_channel, it can only be set to JSON Object')
      }
      options['third_party_channel'] = third_party_channel
    }

    this.payload = extend(this.payload, {
      'options': options
    })
    return this
  }

  toJSON() {
    this.payload.options = extend({
      'sendno': generateSendno(),
      'apns_production': false
    }, this.payload.options)
    return this.payload
  }

  async send() {
    this.validate(this.payload)
    const body = this.toJSON()
    return this.client.sendPush(body)
  }

  async sendValidate() {
    this.validate(this.payload)
    const body = this.toJSON()
    return this.client.validate(body)
  }

  setSingleSchedule(date: string) {
    if (typeof date !== 'string') {
      throw new InvalidArgumentError('date must be set to the string.')
    }
    const single = {
      'time': date
    }
    this.trigger = extend(this.trigger, {
      'single': single
    })
    return this
  }

  setPeriodicalSchedule(start: string, end: string, time: string, timeUnit: string, frequency: number, point: string) {
    const periodical = {
      'start': start,
      'end': end,
      'time': time,
      'time_unit': timeUnit,
      'frequency': frequency,
      'point': point
    }
    this.trigger = extend(this.trigger, {
      'periodical': periodical
    })
    return this
  }

  async setSchedule(name: string, enabled: boolean) {
    if (typeof name !== 'string') {
      throw new InvalidArgumentError('name must be set to string.')
    }
    if (typeof enabled !== 'boolean') {
      throw new InvalidArgumentError('enabled must be set to boolean.')
    }
    this.validate(this.payload)
    this.payload.options = extend({
      'sendno': generateSendno(),
      'apns_production': false
    },
      this.payload.options)
    const body = {
      'name': name,
      'enabled': enabled,
      'trigger': this.trigger,
      'push': this.payload
    }
    return this.client.setSchedule(body)
  }

  async updateSchedule(scheduleId: string, name: string, enabled: boolean) {
    if (typeof scheduleId !== 'string') {
      throw new InvalidArgumentError('Schedule ID must be set to string.')
    }
    let body: any = {}
    if (name != null) {
      if (typeof name !== 'string') {
        throw new InvalidArgumentError('name must be set to string.')
      }
      body = extend(body, {
        'name': name
      })
    }
    if (enabled != null) {
      if (typeof enabled !== 'boolean') {
        throw new InvalidArgumentError('enabled must be set to boolean.')
      }
      body = extend(body, {
        'enabled': enabled
      })
    }
    if (!isEmptyObject(this.trigger)) {
      body = extend(body, {
        'trigger': this.trigger
      })
    }
    if (!isEmptyObject(this.payload)) {
      this.validate(this.payload)
      this.payload.options = extend({
        'sendno': generateSendno(),
        'apns_production': false
      },
        this.payload.options)
      body = extend(body, {
        'push': this.payload
      })
    }
    return this.client.updateSchedule(scheduleId, body)
  }

  validate(payload: any) {
    const notification = payload.notification
    const message = payload.message
    if (!notification && !message) {
      throw new InvalidArgumentError('Either or both notification and message must be set.')
    }
  }

  calculateLength(str: string) {
    let re: any[] = []
    for (let i = 0; i < str.length; i++) {
      let ch = str.charCodeAt(i)
      const st = []
      do {
        st.push(ch & 0xFF)
        ch = ch >> 8
      } while (ch)
      re = re.concat(st.reverse())
    }
    // return an array of bytes.
    return re.length
  }

  isIosExceedLength() {
    let ios: number
    const notification = this.payload.notification
    const message = this.payload.message
    const alert = notification?.alert ? notification.alert : ''
    ios = this.calculateLength(JSON.stringify(extend({
      'alert': alert
    }, notification?.ios)))
    if (message != null) {
      const msgLen = this.calculateLength(JSON.stringify(message))
      return msgLen >= 1000
    }
    return ios >= 2000
  }

  isGlobalExceedLength() {
    let android = 0
    let winphone = 0
    let ios = false
    const notification = this.payload.notification
    const message = this.payload.message
    const platform = this.payload.platform

    let hasIOS = true
    if (platform !== ALL) {
      hasIOS = false
      if (platform) {
        for (let i = 0; i < platform.length; i++) {
          if (platform[i] === 'ios') {
            hasIOS = true
            break
          }
        }
      }
    }

    if (hasIOS) {
      ios = this.isIosExceedLength()
    }

    if (notification != null) {
      const alert = notification.alert ? notification.alert : ''
      winphone = this.calculateLength(JSON.stringify(extend({
        'alert': alert
      }, notification.winphone)))
      android = this.calculateLength(JSON.stringify(extend({
        'alert': alert
      }, notification.android)))
    }
    if (message != null) {
      const msg_length = this.calculateLength(JSON.stringify(message))
      winphone += msg_length
      android += msg_length
    }
    return ios || winphone > 1000 || android > 1000
  }
}

