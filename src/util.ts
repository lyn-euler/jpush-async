/* extend start */

const _isObject = function (o: any) {
  return Object.prototype.toString.call(o) === '[object Object]'
}

const _extend = function self(destination: any, source: any) {
  let property
  for (property in destination) {
    if (destination.hasOwnProperty(property)) {
      // 若 destination[property] 和 source[property] 都是对象，则递归。
      if (_isObject(destination[property]) && _isObject(source[property])) {
        self(destination[property], source[property])
      }

      // 若 source[property] 已存在，则跳过。
      if (!source.hasOwnProperty(property)) {
        source[property] = destination[property]
      }
    }
  }
}

export const extend = function (payload: any, opts: any) {
  let arr = arguments
  let result = {}
  let i

  if (!arr.length) {
    return {}
  }

  for (i = arr.length - 1; i >= 0; i--) {
    if (_isObject(arr[i])) {
      _extend(arr[i], result)
    }
  }

  arr[0] = result
  return result
}


/* extend end */
export const isEmptyObject = function (obj: any) {
  for (let t in obj) {
    return false
  }
  return true
}
