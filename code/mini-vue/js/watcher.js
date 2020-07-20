class Watcher {
  constructor(vm, key, updater) {
    this.vm = vm
    this.key = key
    this.updater = updater

    // 将当前对象记录到Dep类的静态属性中
    Dep.target = this
    // 触发getter, 将当前wather添加到dep.sub中
    this.oldValue = vm[key]
    // 防止重复添加
    Dep.target = null
  }

  update() {
    const newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }

    this.updater(newValue, this.oldValue)
    this.oldValue = newValue
  }
}