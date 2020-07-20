class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.compile(this.el)
  }

  compile(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compileElement(node)
      }

      // 递归编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译元素节点, 处理指令
  compileElement(node) {
    // console.log(node.attributes)

    Array.from(node.attributes).forEach(attr => {
      if (this.isDirective(attr.name)) {
        const attrName = attr.name.substr(2)
        this.update(node, attr.value, attrName)
      }
    })
  }
  update(node, key, attrName) {
    const updater = this[attrName + 'Updater']
    updater && updater.call(this, node, this.vm[key], key)
  }
  textUpdater(node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, newValue => node.textContent = newValue)
  }
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, newValue => node.value = newValue)
    // 双向绑定
    node.addEventListener('input', () => this.vm[key] = node.value)
  }
  htmlUpdater(node, value, key) {
    
  }

  // 编译文本节点, 处理插值表达式
  compileText(node) {
    // dir强制使用对象打印, 不允许特殊处理
    // console.dir(node)

    const reg = /\{\{(.+?)\}\}/g
    const template = node.textContent
    const set = new Set()
    let match = reg.exec(node.textContent)
    while (match) {
      const key = match[1].trim()
      if (!set.has(key)) {
        set.add(key)
        new Watcher(this.vm, key, newValue => {
          node.textContent = this.compileTemplate(template, { [key]: newValue })
        })
      }
      match = reg.exec(node.textContent)
    }
    node.textContent = this.compileTemplate(template)
  }
  compileTemplate(tepl, additional = {}) {
    const reg = /\{\{(.+?)\}\}/
    let match = reg.exec(tepl)
    while (match) {
      const key = match[1].trim()
      tepl = tepl.replace(reg, additional[key] === undefined ? this.vm[key] : additional[key])
      match = reg.exec(tepl)
    }
    return tepl
  }

  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
  isTextNode(node) {
    return node.nodeType === 3
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
}