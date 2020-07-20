class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    // 1. 判断data是否对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2. 遍历data属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(obj, key, val) {
    // 递归调用, 使得对象属性也能转换为响应书数据
    this.walk(obj[key])
    // 必须传入val而不是obj[key], 否则会无限递归调用getter
    const self = this
    // 新建该属性的Dep
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(value) {
        if (value === val) {
          return
        }
        val = value
        // 赋值时需要重新建立响应式数据
        self.walk(val)
        // 发送通知
        dep.notify()
      }
    })
  }
}
