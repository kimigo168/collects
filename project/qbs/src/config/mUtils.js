/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return JSON.parse(window.localStorage.getItem(name))
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 深拷贝
 */
export const deepClone = data => {
  if (data === null || typeof data !== 'object') {
    return data
  }
  const obj = Array.isArray(data) ? [] : {}
  if (Array.isArray(data)) {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else {
    for (let key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

/**
 * 函数节流
 *  @param Function fn 延时调用函数
 *  @param Number delay 延时时间
 *  @param Number atleast 至少多少次数触发一次
 *  @ return Function 延迟执行方法
 */
export const throttle = (fn, delay, atleast) => {
  let timer = null
  let previous = null
  return function () {
    var now = new Date()
    if (!previous) previous = now
    if (atleast && now - previous > atleast) {
      fn()
      previous = now // 重置上一次开始时间为本次结束时间
      clearTimeout(timer)
    } else {
      clearInterval(timer)
      timer = setTimeout(() => {
        fn()
        previous = null
      }, delay)
    }
  }
}
