import app from './app.js'
import {getIPAdress, router as routes} from './routes/main.js' //因依赖获取IP地址引入
import http from 'http'
import open from 'open'
import world from './test.cjs'
var port = process.env.PORT || '8888';

var server = http.createServer(app); //server内容:app
server.listen(port,'0.0.0.0',()=>{
  console.log(`请输入连接地址:${getIPAdress()}:${port}/file`);
  console.log(world.world(), 'cjs & ejs import test')
  // open(`http://${getIPAdress()}:${port}/login`)
});