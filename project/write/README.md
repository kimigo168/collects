# ai-write

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### mode:history 配置注意事项：
(1) main.js 相关放开，hash模式则注释掉
(2) router/index.js  mode:history,hash则注释掉
(3) vue.config.js  publicePath的配置切换
(4) nginx配置增加一条代码

location / {
  root html;
  index index.html index.htm;
  ### 增加下面这行
  try_files $uri $uri/ /index.html; // 增加
}
