
### 功能
- 实现删除scss中冗余的css代码，目前解析的是scss文件

### 使用到的方法等
- 解析css
    - postcss-scss
    - postcss
- 解析wxml
    - himalaya-wxml
    - html

### 本地使用
- 在根目录下执行npm link 后bin中的命令就会被安装到本机的node的bin下，然后再在需要处理的项目目录下执行css-unuse即可帮你删除冗余css


### 待处理的事项

- wxml中动态变量生成的css如何避免被删除 如 wxml中这样写<view class="test_{{list.length}}"/>

- 支持解析wxss文件，纯css文件

- 支持处理jsx/tsx中引入的less或者scss

- 使用ts重构
