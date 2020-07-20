import { VueConstructor } from 'vue/types/umd'
import { RouterOptions } from 'vue-router'

let GLOBAL_VUE: VueConstructor

export default class VueRouter {
  static installed: boolean
  static install(Vue: VueConstructor) {
    // 1. 判断当前插件是否已被安装
    if (VueRouter.installed) {
      return
    }
    VueRouter.installed = true

    // 2. 将Vue构造函数注册到全局变量
    GLOBAL_VUE = Vue

    // 3. 把创建Vue实例时传入的router对象注入到Vue实例上
    // 需要在能获取到vue实例的时候写入
    // 使用全局混入可以为每个之后创建的组件增加选项, 这里只是挂载router实例
    GLOBAL_VUE.mixin({
      beforeCreate() {
        // 只有vue实例中才有optoins.router, 组件中是没有的
        if (this.$options.router && GLOBAL_VUE) {
          const router = this.$options.router as any as VueRouter
          GLOBAL_VUE.prototype.$router = router
          router.init()
        }
      }
    })
  }

  private options: RouterOptions
  private data: any
  private routeMap: any

  constructor(options: RouterOptions) {
    this.options = options
    this.routeMap = {}
    this.data = GLOBAL_VUE.observable({
      current: '/'
    })
  }

  private init() {
    this.createRouteMap()
    this.initComponents(GLOBAL_VUE)
    this.initEvent()
  }

  private createRouteMap(): void {
    if (!this.options.routes) {
      return
    }
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = (route as any).component
    })
  }

  private initComponents(Vue: VueConstructor) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      name: 'router-link',
      // template: '<a :href="to"><slot></slot></a>'
      render(h) {
        return h('a', {
          attrs: {
            href: this.to as any
          },
          on: {
            click: (e: { preventDefault: () => void }) => {
              // history.pushState({}, '', this.to)
              window.location.hash = this.to;
              (this.$router as any).data.current = this.to
              e.preventDefault()
            }
          }
        }, [this.$slots.default])
      }
    })
    Vue.component('router-view', {
      name: 'router-view',
      render: (h) => {
        const comp = this.routeMap[this.data.current]
        return h(comp)
      }
    })
  }

  private initEvent() {
    window.addEventListener('hashchange', e => {
      this.data.current = window.location.hash.slice(1)
    })
  }
}
