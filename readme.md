node服务器 基础express框架 以及轻量化lowdb json存储作为轻量化数据库



TODO:

(CSS)

重写listview列表的布局

实现图片未加载时的替代效果



*尝试使用其他CSS框架来获得更好的动画效果

****

(功能性)

~~实现基础的上传功能~~

实现管理模式与其权限对应



用户模式与开发模式的分离

****

bug

~~从登录页面跳转到首页之后 命令行会报无法设置响应头部的错误~~

重定向添加return提前抛出后就不会再度发生重复设置头部的问题



获取下载文件时会报"ERROR REQUESTABORT"的错误 

这个错误本身没什么问题 但应该需要更温和的处理 只需要try catch console一下就好