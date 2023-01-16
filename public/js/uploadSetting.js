const $ = document.querySelector.bind(document);
var Initalflag = 0;
var liPosition = 0; //书写位置


window.onload = function Inital(){
	if(!Initalflag){
		window.uploadContainer = $('.upload-container')
		window.dropzone = $(".drop-zone")
		window.title = $(".drop-zone .title")
		window.browseBtn = $("#browseBtn")
		window.fileInput = $("#fileInput")
		window.progressBar = $('.progress-bar')
		window.progressPercent = $('#progressPercent')
		window.progressContainer = $('.progress-container')
		window.FooterToast = $('.FooterToast')
		window.NavUploadProcess = $('.NavUploadProcess')
		window.DisplaySetting = $('.DisplaySetting')
		window.setting = $('#setting')
		window.fileslist = $("#fileslist")
		window.NavUploadProcess = $('.NavUploadProcess');
		window.progressChecker = $('.progressChecker')
		window.Board = $('.Board')
		window.Mutlicheck = $('.Mutlicheck')

		/*
		如果直接用dragover触发频率太高
		就用requestAnimationFrame吧
		*/

		dropzone.addEventListener("dragover", (event)=>{
			event.preventDefault();
			window.requestAnimationFrame(
				()=>{dropzone.classList.add("dragging");}
				//手动给该标签打上dragging 使其能应用css
			)

		});


		dropzone.addEventListener("dragleave", (event)=>{
			event.preventDefault();
			window.requestAnimationFrame(
				()=>{dropzone.classList.remove("dragging");
			})
		});

		dropzone.addEventListener("drop", (event) => { //dropZone监听drop行为
			event.preventDefault(); //阻止默认事件执行——打开文件
	
			dropzone.classList.remove("dragging");

			 //清除idle状态
			Board.innerHTML = '';
			Board.classList.remove("idle");
			Board.classList.add("busy");

			var files = event.target.files || event.dataTransfer.files;

			fileInput.files = files; //子属性files代表input传入的文件

			console.log(`dragged ${files[0].name}`)
			// XHRformDataUpload();
			// FetchformDataUpload();
			

			if(files.length==1){
				AxiosformDataUpload(files);
			}
			

			else{
				AsyncAxiosUpload(files);
			}
			
		})

			

		browseBtn.addEventListener("click", () => {
			event.preventDefault();
			//隐藏了input那就代为执行input的click
			fileInput.click(); 
		});

		//browse 所指向的是让input的属性被监听的行动

		fileInput.addEventListener("input", () =>{
			event.preventDefault();
			AxiosformDataUpload(files);
		})

		DisplaySetting.addEventListener('click',()=>{
			requestAnimationFrame(()=>{
				DisplaySetting.classList.add("clicked");
				ShowOptions();
			})
			
		})

		DisplaySetting.addEventListener('mouseout',()=>{
			requestAnimationFrame(()=>{
				DisplaySetting.classList.remove("clicked")
			})
		})

		NavUploadProcess.addEventListener('click',()=>{
			requestAnimationFrame(()=>{
				NavUploadProcess.classList.add("clicked");
				
			})
		})

		NavUploadProcess.addEventListener('mouseout',()=>{
			requestAnimationFrame(()=>{
				NavUploadProcess.classList.remove("clicked")
			})
		})
		
	Initalflag = 1;
	console.log("inital complete.")
		
	}

}
//等待DOM元素加载完毕开始执行

var reqList = [];

async function AsyncAxiosUpload(files){
	let targetNode = $(".Board");

    let docfrag = document.createDocumentFragment();

   	for(let x = 0; x<files.length; x++){
        let newspan = document.createElement('span');
        newspan.innerText = `waitting...`
        docfrag.appendChild(newspan);
    }

    targetNode.appendChild(docfrag); //预注入

	postFunction(files);

	let posts = await axios.all(reqList).then(axios.spread((...resList)=>{return resList}));
	reqList = [];

	//解析req请求

	//经典的同步与异步问题 你无法在当时等待到message回应 所以无法直接return这个值出去 但至少你还能调用行为
	
	// console.log(posts);
	for(let i = 0; i<posts.length; i++) { //绕过textNode
        if (posts[i].code >= 200 && posts[i].code < 300) {
        	targetNode.children[i].innerHTML= `${i}: ${posts[i].filename} ${posts[i].message}`;
        }
    }

}


function postFunction(files){
	
	for(let file of files){
		
		//你以为是li被循环 实际上其实是req被读入之后 它里面的值就被固定了
		//这个我能理解 但为什么outer var会被连续触发3次1呢? 该放断点了家人们

		uploadForm = $('#uploadForm') //当前form的数据
		let formData = new FormData();
		
		formData.append('Files',file,file.name)

		let req = axios.post("/upload",formData,{
		    headers: {
			       'Content-Type': 'multipart/form-data;charset=UTF-8'
			},

	        onUploadProgress: progressEvent => {
	        	//progressEvent事件调用 是XHR自带的接口
	        	let UploadProgress = (progressEvent.loaded / progressEvent.total * 100 | 0);

	        	//上传进度百分比
	        	outsiderTrigger(files.length); //因为内部的值无法自循环 从外界函数获取值
	        	Board.children[liPosition].innerHTML = `${file.name}:${UploadProgress}%`;
	        	
	      	},

	      	validateStatus: status => {
				return status >= 200 && status < 300;
			}

		})
		.then((res)=>{
			ShowToast(`${files.length} ${res.data.message}`);
			MoveToast();
			return res.data; //最后记得抛出
		})

		reqList.push(req); //循环将请求放入

	}
	
}

function outsiderTrigger(length){
	if(liPosition==length-1){
		liPosition = 0; //clear
	}

	else{
		liPosition+=1;	
	}
	
	return liPosition;
}

function AxiosformDataUpload(files){
	uploadForm = $('#uploadForm') //当前form的数据
	let formData = new FormData(uploadForm);
	
   	ProgressRest();
	axios.post("/upload",formData,{
	    headers: {
		       'Content-Type': 'multipart/form-data;charset=UTF-8' //解析表单数据formdata
		},

        onUploadProgress: progressEvent => {
        	let UploadProgress = (progressEvent.loaded / progressEvent.total * 100 | 0);		//上传进度百分比
        	progressPercent.innerText = `${UploadProgress}%`;
        	progressBar.setAttribute('style',`transform:scaleX(${UploadProgress/100})`);
        	
      	},

      	validateStatus: status => {
			return status >= 200 && status < 300;
		},
        
	})
		//callback
		.then((res)=>{return res.data})
		.then((res)=>{
			let end = Date.now()
			progressPercent.innerText = `Done.`;
			ShowToast(res.message);
			MoveToast();

			for(let file of files){
				// console.log("fileDetail:",file);

				let fullLocation = `${res.location}\\${file.name}`
				let ext = authext(files[0].name.split('.').slice(-1).toString());
				let filename = `${file.name}`;
				let Size = authSize(file.size);
		
				feedback(fullLocation,ext,filename,Size)

			}
			
		})
		//经典的同步与异步问题 你无法在当时等待到message回应 所以无法直接return这个值出去 但至少你还能调用行为
}


/*
这里原本应该按照上面的理念将css内容写进css内 然后js只负责修改dom的标签就行了
但是这样就没办法通过.style检测element元素了 .style无法检测css内的修改 只有浏览器本身才能感知得到 真是奇怪

如果要实现就得强行分离这一个函数为两个独立的开与关 还是先算了罢
*/



//同理
function ShowOptions(){
	if(setting.style['visibility']=="hidden"){
		setting.setAttribute('style',"visibility:visible;bottom: 5%;opacity:1")
	}

	else{
		setting.setAttribute('style',"visibility:hidden;bottom: 0%;opacity:0")
	}
}

function ShowProgressList(){
	if(progressChecker.style['visibility']=="hidden"){
		progressChecker.setAttribute('style',"visibility:visible;top:5%;opacity:1")
	}

	else{
		progressChecker.setAttribute('style',"visibility:hidden;top:-20%;opacity:0")
	}
}

function showUploadContainer(){
	if(uploadContainer.style['visibility']=="hidden"){
		uploadContainer.setAttribute("style","visibility:visible;opacity:1;")
	}
	
	else{
		uploadContainer.setAttribute("style","visibility:hidden;opacity:0;")
		progressContainer.setAttribute('style',"visibility:hidden;opacity:0;")
	}
}


function ProgressRest(){
	
	progressPercent.innerText = `0%`;
	progressContainer.setAttribute('style',"visibility:visible")
}


function ShowToast(message){
	FooterToast.innerHTML = message;
	FooterToast.setAttribute('style',"visibility:visible;color:#fff");
	setTimeout(()=>{
		FooterToast.setAttribute('style',"visibility:hidden;background:none;color:rgba(0,0,0,0);box-shadow:none;opacity:0");
	},2000)
};

function MoveToast(){
	let x = Date.now();
	let start_timestamp;

	function increase(timestamp){
		if (start_timestamp === undefined){
			start_timestamp = timestamp;	//初始时间戳
		}

		latency = timestamp - start_timestamp	//因为真实时间戳不断更新 延迟会越来越大
		FooterToast.style.bottom = `${Math.min(20+0.1*latency, 50)}%`

		//如果你想控制动画的速率 因为你无法控制时间戳流速 
		//那你就只能拉长/缩短总延时大小限制 同时在变量的修改上也做相对应的拉长/缩短来控制动画速率
		if(latency<3000){ //3s
			window.requestAnimationFrame(increase);	
			/*
			本体实际上是callback函数 
			调用的时候会自动往里面传入一个它的值进去 
			一般都是当前网页打开时间
			*/
		}

	}

	window.requestAnimationFrame(increase);		//执行
}

function authext(filename){

const video_fliter = /\.mkv|mp4|flv|webv|m2ts|rmvb$/
const audio_fliter = /\.mp3|aac|flac|ogg|opus|aiff|alac|cue$/
const picture_fliter = /\.jpe?g|png|bmp|webp$/
const compress_fliter = /\.zip|rar|7z|\d{3}$/
const text_fliter = /\.txt|md|ini|json|cfg$/

if(video_fliter.test(filename)){
	return "#ext-video"
}
else if(audio_fliter.test(filename)){
	return "#ext-audio"
}
else if(picture_fliter.test(filename)){
	return "#ext-picture"
}
else if(text_fliter.test(filename)){
	return "#ext-txt"
}
else if(compress_fliter.test(filename)){
	return "#ext-compress"
}
else{
	return "#ext-unknown"
}

}

function authSize(Size){
	if(Size<1024){ 
    	return `${Size}B` 
    }
    else if(Size<Math.pow(1024, 2)){
    	return `${(Size/1024).toFixed(2)}KB`
    }
    else if(Size<Math.pow(1024, 3)){
    	return `${(Size/Math.pow(1024, 2)).toFixed(2)}MB`
    }
    else{
    	return `${(Size/Math.pow(1024, 3)).toFixed(2)}GB`
    }
}

function feedback(dir,ext,filename,Size){
	let baseNode = $(".filesection")
	let newNode = $(".filesection").cloneNode(true) //一般是第一个节点 拷贝行为:深拷贝
	 
	/*新节点主要需要修改:
	1.a href指向的内容
	2.svg use指向的格式	a href内层的icons
	3.文件大小/名字 a href内层的file内层的filename/filesize
	*/
	
	let newHref = baseNode.children[0];
	let newIcon = baseNode.children[0].children[0].children[0];
	let newName = baseNode.children[0].children[1].children[0];
	let newSize = baseNode.children[0].children[1].children[1];

	let fullPath = `/filedownload?path=${dir}`
	
	newHref.href = fullPath;
	newIcon.href.baseVal = ext //靠name.split()分辨
	newName.textContent = filename
	newSize.textContent = Size

	$('#fileslist').appendChild(newNode)
		
}

//不要将获取DOM的行为写在DOM树加载完之前！ 浪费半小时时间的教训
