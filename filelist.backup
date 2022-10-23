var path = require('path'),
    fs   = require('fs')

var pathname = 'D:\\All Local Downloads'

var filePath = pathname.replace(/\\/g,'/')


// filePath = decodeURI(filePath); //将url的ascii码信息转译回正常的编码





function getSizelist(filePath){
    var checkDir =  fs.existsSync(filePath)
    if(checkDir){
        var sizelist = []
        var dirlist = fs.readdirSync(filePath) //文件列表信息
            for(let x of dirlist){
                var fullname = pathname+'\\'+x;
                var checkFile = fs.lstatSync(fullname)

                if(checkFile){
                    if(checkFile.isDirectory()){}
                    else{
                        sizelist.push((fs.statSync(fullname).size))
                        //console.log(path.extname(fullname))
                    }
                  
                    if(x==dirlist.pop()){return sizelist}

                }
            }
    }
    
} 


console.log(getSizelist(filePath))

function getDirList(filePath) {
    var i = 0;
    var dirlist = new Array();
    var files = fs.readdirSync(filePath);
    files.forEach(function (file) {
        if (fs.existsSync(filePath + file)) {
            if (fs.lstatSync(filePath + file).isDirectory()) {
                // console.log("我是目录", filePath + file);
                dirlist[i++] = filePath + file;
            } else {
                // console.log("我是文件", filePath + file);
            }
        }
    });

    return dirlist
}





// getDirList(pathname)

//这样就能实现单个文件夹下的文件与文件夹列表获取


