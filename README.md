# vue-qidian
使用vue，模仿搭建起点客户端和管理系统

>vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。
 如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。
 当你使用 history 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id，也好看！
 不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。
 所以一般情况下，将这个模式去掉
 
>移动端引入 lib-flexible时注意事项（important）: 由于flexible会动态给页面header中添加<meta name='viewport' >标签，所以务必请把目录 public/index.html 中的这个标签删除！！！

[追书神器api](https://github.com/amumu233/zhuishushenqi/wiki/API-%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3)

>vue引用本地图片时，用require获取，:src="require()“

>vue传输的值如果是boolean或number,则父组件传值方式是：v-bind:x=true
