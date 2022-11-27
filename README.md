# 尚品汇后台



## 2022.11.26

> ### 内容

1.下载后台模板vue-admin-template

2.修改相关配置及重写：

​	1.配置代理

​	2.api.js路径重写

​	3.vuex请求重写

​	4.删除无用文件





## 11.27

> ### 内容

1.增加商业管理路由及其子路由四个

2.修改app-main样式

3.品牌管理静态组件

​	按钮：el-button

​	表格：el-table

​	分页器：el-pagination

4.品牌管理动态展示

​	1.数据请求函数封装，挂载后请求

​		将数据写入data：分页器数据和展示数据

​	2.动态展示数据

​		序号：type="index"

​		品牌名称：prop="tmName"

​		图片：使用作用域插槽slot-scope="{row,$index}"  row传入data数组

​		按钮：作用域插槽，插入el-button			

​	3.编写分页器转页面方法handleCurrentChange(pager),pager为点击的页面

> ### 重点

新增配置代理，商品的请求地址与登录不一样。新增brand-request.js适配商品请求

​	1 .env.development 增加 VUE_APP_BRAND_API = '/brand-api'

​	2 vue.config proxy添加新的配置项，适配商品请求url

​	3 utils文件夹新增brand-request.js baseUrl改为 rocess.env.VUE_APP_BRAND_API