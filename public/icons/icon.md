## 更换图标

```
window
如下方式可解决打包后窗口左上角图标不显示问题
1、将生成的 icon 粘贴到当前目录
2、修改 vue.config.js
"win": {
"icon": "build/icons/icon.ico" （为 256\*256 图片）
}
3、运行 yarn run electron:serve or yarn run electron:build

mac
图标格式 icns
推荐在线转换格式 https://cloudconvert.com/png-to-icns
```
