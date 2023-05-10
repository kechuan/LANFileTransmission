import express from 'express'
import path from 'node:path'
import fs from "node:fs"
import os from "node:os"
import process from "node:process"

import nodeDiskInfo from 'node-disk-info'

import {profileWrite,profileScan,login,preferSetting} from '../public/js/data.js'

// var cookieParser = require('cookie-parser')

var router = express.Router();  //路由设置 开始

const port = 8888;
const reqIp = `${getIPAdress()}:${port}`;

process.traceDeprecation = true

//转变class构造存储 希望以后以账号偏好设置继承数据能够用得上 比如stat extend passport之类的操作

const disks = nodeDiskInfo.getDiskInfoSync()

class defaultConfig{
    constructor(){
        this.surfing_path='';
        this.view='listview';
        this.status='';
        this.description='';      
    }
}

class prefer extends defaultConfig{
    
}

var Now = new prefer()

router.post('/ping', (req, res) => {
let AccessIP = req.connection.remoteAddress;

let response = {
        ip: AccessIP,
        code: 200,
        message: "pong"
    }
    res.json(response)
})

router.get('/Lab', (req, res) => {
    res.render('Lab', {title: 'Lab'}); //测试页面
})

router.get('/',(req,res)=>{
//TODO：对传入url的文字加密 直接暴露明文在url是很危险的行为

var username = req.query.username
var password = req.query.password
var password_confirm = req.query.password_confirm


    if(username&&password&&password_confirm!=undefined){
        res.redirect(`/register?username=${username}&password=${password}`)
        return;
    }

    if(username&&password!=undefined){
        switch(login(username,password)){
            case 'not exist': {
                Now.description = `Account ${req.query.username} not exist!`
                res.redirect('/login/failed')
                return; //提前return抛出避免重复导向
                break;
                
            }

            case 'wrong': {
                Now.description = `The password or account is not correct!`
                res.redirect('/login/failed')
                return; //提前return抛出避免重复导向
                break;
                
            }; 

            case 'succ': {
                Now.view = preferSetting(username)
                console.log(`welcome ${req.query.username}! your view:${preferSetting(username)}`)
                res.redirect('/index')
                return; //提前return抛出避免重复导向
                break;
                
            };

            // default: console.log(login(username,password)); break;
        }
    }
    
    res.render('login',{
        title: 'Login',
        status: Now.status,
        description: Now.description
    })

})

router.get('/login/:status',(req,res)=>{
    Now.status = req.params.status
    res.redirect('/')
})

router.get('/register',(req,res)=>{
    let redirect_path = Now.surfing_path
    if(profileScan(req.query.username,req.query.password)){
        console.log('reg failed!')
        res.redirect('/login/failed')
        return;
    }

    else{
        res.redirect('/index')
        profileWrite(req.query.username,req.query.password)
        return;
        
    }
})

router.get('/index', function (req, res, next) {
    
    res.render('index', 
    {
        title: 'Express',
        dataip: reqIp,
    });
});


//file页面下 渲染indexdir
router.get('/file', function (req, res, next) {
    
    let diskList = [];

    for(let disk of disks){
        if(disk.filesystem!="本地固定磁盘"){
            continue;
        }

        else{
            diskList.push(disk.mounted);
        }
        
    }

    res.render('indexdir', {dataip: reqIp,diskList: diskList});

});

//文件列表 需求通过上层携带 ?path='' 以访问 直接访问无效 由file跳转以携带字样

//因主要功能都在这个页面实现 所以考虑直接在这个页面内添加传送标记节点 surfing_path
router.get('/fileslist', function (req, res, next) {
    Now.surfing_path = req.url;
    let filepath = req.query.path.slice(2); //截取盘符之后的目录信息
    let path = req.query["path"];
    if (path != null) {
        filepath = path + "\\"; //访问盘符后的目录有效时添加\ D: => D:\
    }
    

    var filedetail = informationList(filepath);
    //数据解构法赋值
    var [dirlist,fileslist,sizelist,extlist] = filedetail;
    
    //处理文件名显示问题
    var filenamelist = new Array();
    var dirnamelist = new Array();

    for (var i=0;i<fileslist.length;i++){
        var temp = fileslist[i]
        filenamelist[i] = temp.split('\\').slice(-1).toString();   
        //浅复制最后一位的slice 但是会变成数组的形式 需要手动转换一次变成字符串
    }

    for (var i=0;i<dirlist.length;i++){
        var temp = dirlist[i].split("\\");
        dirnamelist[i] = temp[temp.length - 1];
    }

    res.render('file', {
        dataip: reqIp,
        filepath: filepath,
        view: Now.view,
        fileslist: fileslist,
        dirlist: dirlist,
        dirnamelist: dirnamelist,
        filenamelist: filenamelist,
        sizelist: sizelist,
        extlist: extlist
        // 为什么在cjs的时候 即使它们不主动去传递 ejs也能接收到变量？
        //最搞笑的是转成ES导入之后就需要强制声明这些变量了
    });
    //将res的变量映射到ejs模板 以供调用
    
})

router.post('/upload', (req, res)=>{
    uploadPost(req,res);
})

//for external tool upload way
router.post('/upload/:FilePath',(req,res)=>{
    uploadPost(req,res);
})

router.post('/delete',(req,res)=>{
    let AccessIP = req.connection.remoteAddress;

    //Array数组判断
    if(Array.isArray(req.body.Postition)){
        for(let pos in req.body.Postition){
            let filepath = req.body.Postition[pos].split(/path=/g)[1].toString();
            console.log(`[${AccessIP}] Delete File:${decodeURIComponent(filepath)}`);
            
            filepath = filepath.replace(/%5C/g,"%2F%2F");
            filepath = decodeURIComponent(filepath);

            fs.exists(filepath,(exists, notExists)=>{
                if(exists){
                    if(fs.lstatSync(filepath).isDirectory()){
                        fs.rmdirSync(filepath);
                    }

                    else{
                        fs.rmSync(filepath);
                    }
                }

                if(notExists){
                    res.status = 404;
                }
            })

        }
    }

    else{
        let filepath = req.body.Postition.split(/path=/g)[1];
        console.log(`[${AccessIP}] Delete item:${decodeURIComponent(filepath)}`);

        filepath = filepath.replace(/%5C/g,"%2F");
        filepath = decodeURIComponent(filepath);

        fs.exists(filepath,(exists, notExists)=>{
            if(exists){
                if(fs.lstatSync(filepath).isDirectory()){
                    fs.rmdirSync(filepath);
                }

                else{
                    fs.rmSync(filepath);
                }
            }

            if(notExists){
                res.status = 404;
            }
        })
        
            
        
        

    }

    
    let response = {
        code: res.status,
        message: `${req.body.Postition.length}files delete Success`
    }

    return res.json(response)

})



//下载文件 当访问到/filedownload的时候express直接跳出下载
//比如:"http://192.168.1.144:8888/filedownload?path=E:\"
//顺带一提 如果直接filedownload访问文件夹/硬盘 是直接会没有响应的

//因此对于文件夹界面来说 才会接入fileslist来调用filedownload 实际上也是调用目录给filedownlad

router.get('/filedownload', function (req, res) {
    //EXP:/filedownload?path=D:\All%20Local%20Downloads\
    //[Airota&LoliHouse]%20Deaimon%20-%2008%20[WebRip%201080p%20HEVC-10bit%20AAC%20ASSx2].mkv
    //但是query本身的&%等特殊字符又会被解析 怎么办。。 那就先编码url再传输然后解压就完事

    let path = req.query.path; //req.query.path会将路径自动进行decode解码
    // console.log(path);
    
    downloadFile(path, res, req);
});

//透过传递并redirect修改视图 缺点则是无法分离 如果有多个会话接入的时候
//则会共享同一个状态 所以才需要迟早将这种功能迟早并入到账号db-偏好设置里
//或者独立成cookies设置 因为现在的session至少我现在做不到分离客户端的id

//这样 如果要精简json文件 那最好的做法自然就是先做一份deafult_options.json
//然后再让每个profile里写偏好设置(prefer)

router.get('/view/:view', (req,res)=>{
    let redirect_path = Now.surfing_path
    Now.view = req.params.view; //全局属性 不能用var 获取伪类选择的属性
    req.session.view = Now.view //session需求

    res.redirect(redirect_path)
})



//路径找到末尾了 那 就返回404罢
router.get('/*',(req, res)=>{
    console.log('404 Error and handle it');
    
    res.render('error',{
        dataip: reqIp
    })
})

/**
 * 文件列表详细信息获取
 * @param filepath
 */
function informationList(filepath){

let [informationlist,dirlist,fileslist,sizelist,extlist] = [[],[],[],[],[]];

//不过神奇的是 无法使用这种解构的方法来快速定义多个空变量,只能用这种方法来快速定义多个空数组

    let files = fs.readdirSync(filepath);
    files.forEach((file)=>{
        if (fs.existsSync(filepath + file)) {
            let fullname = filepath + file;

            if (fs.lstatSync(fullname).isDirectory()) {
                dirlist.push(fullname);
            }

            else{
                fileslist.push(fullname);
                sizelist.push(`${fs.statSync(fullname).size}`);
                extlist.push(path.extname(fullname).toLowerCase());
            }
        }

    });
    
    informationlist.push(dirlist, fileslist, sizelist, extlist)
    return informationlist
}

/**
 * 文件下载
 * @param filepath
 * @param res
 */
function downloadFile(filepath, res, req) {

    // let files = fs.readdirSync(filepath);

    var filename = filepath.split("\\").slice(-1).toString(); //截取目录的尾部(文件名)信息
    res.download(filepath, filename, (err)=>{
        if (err) {
            // console.log(err.code);
            switch(err.code){
                case 'ECONNABORTED': {console.log("waitting user start download...");break;}
            }
        } 
        else {
            console.log(`Send ${filename} Format:${path.extname(filepath).split("\.").slice(-1).toString()} To:${req.ip} Success`);

        }
    });
}

/**
 * 获取本机ip地址
 * @returns {*}
 */
function getIPAdress(){
    /*
    一旦遇到virtualBox等虚拟网卡 就会被优先返回虚拟的ipv4地址 这就相当于一个另一个localhost
    以后看看能不能用少量的代码解决掉吧 它们特征都是192.168.*.*的 难道只能用关键字排除?
    TODO:ipv6支持
    */
    var interfaces = os.networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

/**
 * 上传接收功能
 * @returns {message}
 */
function uploadPost(req,res){
    let AccessIP = req.connection.remoteAddress;
    let targetFile; //目标文件
    let uploadPath = req.params.FilePath||Now.surfing_path;

    if(req.params.FilePath==undefined){
        uploadPath = decodeURIComponent(uploadPath.split(/\?path=/g).slice(-1).toString())
    }

    console.log(`TargetPath:${uploadPath}`);

  //无文件传入时处理
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No files were uploaded.")
        return res.status(400).send('No files were uploaded.');
    }

    targetFile = req.files.Files; //此处的Files是对应着input表格当中的name属性 同样可以从req.files里看到

    // console.log('req.files >>>', req.files); // debug用 查看这个文件的详细信息便于开发

    //执行单多文件流程处理
    //处理的方式也很粗暴 直接执行for循环拆分开来一个个上传就是
    if(targetFile.length!=undefined){
        console.log("本次传入的文件数目:",targetFile.length)
        for(let index of targetFile){
            let FullNameUpload = uploadPath+"\\"+index.name;
            console.log("SplitPath2:"+FullNameUpload);

            index.mv(FullNameUpload, function(err) {
                if (err) {
                  return res.status(500).send(err);
                }

                console.log(`<<<[${AccessIP}] File: ${index.name} Size: ${(index.size/Math.pow(1024, 2)).toFixed(2)}MB uploaded to ${uploadPath}`)
                FullNameUpload = uploadPath; //重置
            });
        }

        let response = {
            location: uploadPath,
            Filenumber: targetFile.length,
            code: 200,
            message: `${targetFile.length} files uplpoad Success`
        }

        return res.json(response)
        // return res.status(400).send('No files were uploaded.');
    }

    else{
        let FullNameUpload = uploadPath+"\\"+targetFile.name;
        console.log("SplitPath2:"+FullNameUpload);

        targetFile.mv(FullNameUpload, function(err) {
            if (err) {
              return res.status(500).send(err);
            }
        });

        console.log(`<<<[${AccessIP}] File: ${targetFile.name} Size: ${(targetFile.size/Math.pow(1024, 2)).toFixed(2)}MB uploaded to ${uploadPath}`)

        let response = {
            filename:targetFile.name,
            location: uploadPath,
            code: 200,
            message: "file uplpoad Success"
        }

        return res.json(response)
    }
}

// function deletePost(req,res){
//     let AccessIP = req.connection.remoteAddress;
//     let targetFile; //目标文件

//     let FileList = req.query.deleteFileList;

//     if(!FileList){
//         fs.rmSync() //根据目标名字查找对应的根目录 并删除
//         //删除成功后 return 200
//     }

// }

export {getIPAdress, router}
