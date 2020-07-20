class Vue {
  constructor(options) {
    // 1. 保存选项到属性上
    this.$options = options || {}
    this.$data = this.$options.data || {}
    this.$el = typeof this.$options.el === 'string' ? document.querySelector(this.$options.el) : this.$options.el

    // 2. 将data转换为vue上的getter/setter
    this._proxyData(this.$data)

    // 3. 调用Observer监听数据变化
    new Observer(this.$data)

    // 4. 调用compiler编译处理插值表达式和v-指令
    new Compiler(this)
  }

  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(value) {
          if (value === data[key]) {
            return
          }
          return data[key] = value
        }
      })
    })
  }
}
