###启动
```js
npm run serve 
```
同时需要部署本地mongodb
mongodb配置查看database/db.js

#### 笔记
>1、当需要通过ObjectId类型字段查询时，需要先str转成ObjectId,
mongoose.Types.ObjectId(bookId)
