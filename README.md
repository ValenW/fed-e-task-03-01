# 王文茏｜Part 3｜模块一

## 简答题

### 第一题

否.

需要使用`this.$set`或者`Vue.set`方法.

内部原理是使用`Object.defineProperty`将属性转化为`getter/setter`, 从而可以在读取/写入时做依赖收集/视图更新等操作. 而使用`obj.newProp = value`的方式无法监听, 也就无法将新属性转化为getter/setter.

### 第二题

diff算法在snabbdom中就是`patch`方法, 目的是比较新旧两个节点树, 并通过给旧节点打补丁, 更新为新节点. 出于性能考虑, 比较只会发生在同一层级的节点上.

1. 比较新旧两节点是否是同一节点, 即引用相同, 或`sel`和`key`都相同
   1. 如果是不同节点, 则使用新节点替换掉旧节点, 并重新渲染
2. 如果是相同节点, 则比较新旧节点内容, 分情况更新旧节点, 然后重新渲染旧节点
3. 新节点有text
   1. 旧节点有children, 则移除children节点, 然后更新text内容
   2. 旧节点text, 和新节点不同, 则直接更新text内容
4. 新节点有children, 旧节点没有
   1. 移除旧节点text
   2. 将新节点children全部加入到旧节点children中
5. 新节点没有children, 旧节点有
   1. 移除旧节点所有children
6. 新旧节点都有children, 且不相同
   1. 调用`updateChildren`对比子层级node并更新
7. 新节点没有text(且没有children), 且旧节点有text
   1. 移除掉旧节点的text

`updateChildren`

1. 只进行同一层级的子节点间比较, 即比较两个数组中的vnode
2. 为新旧两组vnode设置头尾指针(即数组下标, 索引), 并只比较指针指向的vnode
3. 不断循环对比新旧数组中的两个vnode, 若相同则更新newVnode到oldVnode, 然后更新这两个指针, 头指针则+1, 尾指针-1. 直到某一组头指针越过了尾指针
   1. oldStart/newStart
   2. oldEnd/newEnd
   3. oldStart/newEnd, 需要将oldStart指向的vnode移动到newEnd之后
   4. oldEnd/newStart, 需要将oldEnd指向的vnode移动到newStart之前
   5. 以上都不满足, 则遍历oldStart-oldEnd, 寻找与newStartNode相同key的节点
      1. 能找到
         1. sel不一样, 创建新节点并重新渲染插入
         2. sel一样, 更新节点并插入到newStart之前
      2. 不能找到, 直接创建新vnode并插入到newStart之前
4. 更新完毕后,
   1. 若新节点有剩余, 将所有多出的新节点插入到旧节点末尾
   2. 若旧节点有剩余, 将所有剩余的旧节点移除

## 编程题

### 第一题

### 第二题