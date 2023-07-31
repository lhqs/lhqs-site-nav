## 乱红如雨的个人站点: 标签导航 + 聚合搜索

访问: http://info.lhqs.ink/

介绍: 一个个人访问站点的日常收集(现已收集二千多个精选网址, 还在持续更新中), 也是网上获取信息的一个起点

### 功能

1. 基于tag的站点导航, 为解决bookmark分类查找不便等问题
```
    {
        "tags": "高频访问 site tech github",
        "title": "Github trending",
        "url": "https://github.com/trending"
    }...
```

2. 聚合搜索, 聚合搜索渠道, 方便信息获取
```
    {
        "title": "Google",
        "url": "https://www.google.com/search?q=${query}"
    },
    {
        "title": "必应",
        "url": "http://bing.com/search?q=${query}"
    }...
```
### 设计
极简, 轻量, 无服务依赖, 数据视图分离

### 使用

1. 如果不修改默认样式, 直接修改描述及自定义域名列表即可(其中导航数据位于 src/data/website.json, 搜索数据位于 src/data/search.json)

2. 如需修改样式可以引入自定义的css文件, 或者了解下[tailwindcss](https://tailwindcss.com),遵循其使用方式

3. 为加快站点访问, 国内可以使用[七牛云](https://www.qiniu.com)❤️的免费服务, 这里需要自定义上传配置, 使用如下命令上传
```
qshell qupload qshell.conf
```







