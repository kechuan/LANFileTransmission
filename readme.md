node服务器 基础express框架 以及轻量化lowdb json存储作为轻量化数据库



TODO:

(CSS)

~~重写listview列表的布局~~

<u>实现图片未加载时的替代效果</u>

~~实现上传界面实现~~



2.滚动条 可以尝试使用scroll.js

*尝试使用其他CSS框架来获得更好的动画效果

****

(功能性)

1.~~实现基础的上传功能~~

~~可拖拽 可多选~~
<u>~~最好能显示进度条/上传速度 xhr/axios->http/ws request 回应进度条和速度~~</u>

<u>所选的文件大小</u> (考虑到因为极大部分文件浏览器在操作form表单时都会选择

系统自带的文件浏览器(简洁) 因其优先级降低)

以及对应的ext图标(这个好办)



+~~上传界面应做到可拖拽文件~~

~~+上传完毕的反馈(css动画反馈) 至少不要变成导向一个页面然后干巴巴的一句话~~

~~直接显示在页面内都好点~~

~~关闭上传界面之后应要在其他地方查看到上传进度~~（上传进度应像下载管理器一样看到名字）



~~*异步上传 且每份文件都能有对应的上传进度条~~

+new bug:

疑似因为在reqList里某一个请求完成之后 未能及时剔除掉 导致即使这个队列的任务已经完成

而被触发的reqList队列长度依旧**保持不变** 

导致页面元素已完成的任务:

会被其他未完成任务所占领并不断抛出进度条



这与一条道路上只显示自己的队列观念相悖

但是在之前实现只显示自己的时候用的方法是静态的数组...



估计要麻烦了

第一种 是直接重写书写的位置 改为动态的数组

在此分任务完成之后(触发then) 重新更新动态数组的长度



困难1:延时

原本想着直接靠NodeLength(children/ChidNodes)的长度传入就完事了 

然后下游直接执行remove就够了

然后就发现毕竟是不同线程执行的 总会有一个任务完成并开始删除时

其他线程就会试图往这个位置写入 然后触发[].undefined的error



如果有什么方法 能在完成时 直接**阻塞**所有线程 **重排List然后再继续**

或者其实直接阻塞xhr方法里的onUploadProgress就好了



我想不好高妙的阻塞方法 但我想只要统一阻塞个0.xxxs 以撑过下一个then就足够了





第二种么 删除位置就好了 让其位置-i -i+1之类的 但是reqList本身 我想不到什么情况下才能在await的时候动态调整reqList



1.1 新建文件夹/改名



2.实现管理模式与其权限对应

Admin下全部功能 全盘访问 自由下载上传 允许编辑模式删除/rename

User下 仅允许访问特定的路径 允许上传

Guest下 仅允许访问特定的路径 禁止上传



-用户模式与开发模式的分离



3. ~~第三方免网页纯HTTP模式注入 依靠params(/upload/:externPath)的路由针对实现~~

****

bug

~~从登录页面跳转到首页之后 命令行会报无法设置响应头部的错误~~

重定向添加return提前抛出后就不会再度发生重复设置头部的问题



~~3.12~~

~~发现经典通病 & 转义成 `&amps;`导致后端无法识别的问题~~

(只要给Link加上encodeURIComponent()处理就行了) 后端的req.query.path会自动decode解码



Low Level:

1.~~获取下载文件时会报'ECONNABORTED'的错误~~ 

~~虽然描写是ABORTED取消下载~~



2.~~将views下的file页面进行压缩至一行 方便第三方HTML筛选工具处理~~


