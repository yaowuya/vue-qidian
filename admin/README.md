### 启动
```js
npm run dev  //启动开发环境
npm run prod //生产环境打包
```
### 记录
>dynamic-import-node是为了解析动态加载组件，路由的懒加载用到"=>"

>svg处理时要注意，(src/icons中的svg文件用svg-sprite-loader载入, 
其他文件夹中的svg用url-loader载入

>render(h, context){} render函数里面的时jsx语法，
需要babel-plugin-syntax-jsx和babel-plugin-transform-vue-jsx

>async函数返回一个 Promise 对象，可以使用then方法添加回调函数。

>什么是Vue.nextTick():在下次 DOM 更新循环结束之后执行延迟回调。
在修改数据之后立即使用这个方法，获取更新后的 DOM。在使用dialog弹出框时，
需要this.$nextTick(() => {
            this.$refs['ruleForm'].clearValidate();
          });
如果没有这样设置，弹框数据不会更新
