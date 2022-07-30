# humming
**极简轻量级图片预览插件**  
- [开箱即用](#开箱即用)
- 支持放大、缩小、拖拽、旋转  
- 支持上一个下一个
- [支持键盘快捷键](#键盘快捷键)
- 支持移动端  
- [支持自定义预览](#自定义预览)

[在线预览](https://itlangzi.com/gallery.html)  

# 使用

## 浏览器
```html
<script src="<path>/lib/umd/index.js" ></script>
<script>
    new Humming()
</script>
```
## require/import

```js
import Humming from 'humming-preview'
// const humming = require('humming-preview')
new Humming()
```

# API
```js
new Humming([selector, mount])
```

# 参数

## `selector` 
`[可选]` 待预览的图片选择器  
类型: `string | HTMLElement | Array<HTMLElement>`  
默认: `document.querySelectorAll("img")`  

## `mount`
`[可选]` 挂载的点  
类型: `HTMLElement`  
默认：`document.body`

# 开箱即用
- 设置 `data-humming` 属性
> 将会自动读取所有的图片 `document.querySelectorAll("[data-humming] img")`
- 设置 `data-humming-img` 属性
> 将会自动读取所有的图片  `document.querySelectorAll("[data-humming-img]")`  

***注意*** 
1. 若两种方式出现交叉将会自动去重
2. `开箱即用` 为可选方案

# 键盘快捷键
- 上一个：↑
- 下一个：↓
- 放大：+
- 缩小：-
- 鼠标滚轮：放大缩小

# 自定义预览
在待预览的元素上使用属性 `data-preview` 指定预览的图片连接即可，此时待预览的元素可以为非`img`标签

# License
MIT license