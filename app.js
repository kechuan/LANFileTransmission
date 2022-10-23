import express from 'express'
import path from 'node:path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import ejs from 'ejs'
// import cookieParser from 'cookie-parser'
import session from 'express-session'

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url)); //node-esm环境转换


import {router as routes} from './routes/index.js'

var app = express();

// var test = require('./routes/test');

// view engine:

//设置模板文件文件夹,__dirname为全局变量,同时也表示网站根目录都采用模板化
// app.set('views', __dirname + '/views');

app.set('views', path.join(__dirname, 'views'));
//将views值设置为:./views 意为模板目录=> ./views
//使得后续的模板相关资源目录都在这里执行


app.set('view engine', 'html');
//注册视图引擎为html
// app.set('view engine', 'ejs');

app.engine('.html', ejs.__express);
/*将html类型文件以ejs模板引擎进行渲染
注册ejs模板为html页。简单的讲，就是原来以.ejs为后缀的模板页，现在的后缀名可以是.html了
设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
 详情看md*/

app.use(logger('dev')); //显示用户访问行为 访问资源目录 状态码 以及拖取资源的时长 是很好用的debug监控

// app.use(cookieParser()) //解析cookie 将cookies信息写入req.cookies内

// app.use((req,res,next)=>{
//   res.cookie('userName', 'guest1',{})
//   res.cookie('view', 'listview',{})
//   next()
// })

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 800000 },
    name: 'kechuan',
}))


// console.log(await db.data.posts)

app.use('/',express.static(path.join(__dirname, 'public'))); 
/*设定资源文件载入目录 且预先载入 
如果不这样操作的话 即使你不引入任何文件 express的首页也会一直卡资源(主要是icons文件)
但是默认又会设置为目录下的stylesheet文件夹为固定的css资源文件夹 什么自相矛盾*/

//*express里约定俗成的资源文件目录被称作public

// uncomment after placing your favicon in /public
//调用另一个模块来帮助直接注入icons
app.use(favicon(path.join(__dirname, 'public/images', 'Icon.ico')));


//routes:
app.use('/', routes); //接管routes内的路由


// exports.app = app
export default app