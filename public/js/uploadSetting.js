const $ = document.querySelector.bind(document);
var Initalflag = 0;
var uploadOptions,dropzone,title,browseBtn,fileInput,fileUpload,closeUploadButton;
var uploadForm;
var progressContainer,progressBar,progressPercent;
var uploadContainer;
var body,FotterToast;

window.onload = function Inital(){
	if(!Initalflag){
		uploadContainer = $('.upload-container')
		dropzone = $(".drop-zone")
		title = $(".drop-zone .title")
		browseBtn = $("#browseBtn")
		fileInput = $("#fileInput")
		fileUpload = $("#fileUpload")
		dirsection = $('.dirsection')
		filesection = $('.filesection')
		progressBar = $('.progress-bar')
		progressPercent = $('#progressPercent')
		progressContainer = $('.progress-container')
		closeUploadButton = $('#closeUploadButton')
		FotterToast = $('.FotterToast')

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
			var files = event.target.files || event.dataTransfer.files;
			fileInput.files = files; //子属性files代表input传入的文件

			console.log(`dragged ${files[0].name}`)
			// XHRformDataUpload();
			// FetchformDataUpload();
			AxiosformDataUpload();
			
		})

			

		browseBtn.addEventListener("click", () => {
			event.preventDefault();
			//隐藏了input那就代为执行input的click
			fileInput.click(); 
		});

		//browse 所指向的是让input的属性被监听的行动

		fileInput.addEventListener("input", () =>{
			event.preventDefault();
			AxiosformDataUpload();
		})

	Initalflag = 1;
	console.log("inital complete.")
		
	}

}
//等待DOM元素加载完毕开始执行

function AxiosformDataUpload(){
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
		.then((res)=>{return res})
		.then((res)=>{
			let end = Date.now()
			progressPercent.innerText = `Done.`;

			ShowToast(res.data.message);
			MoveToast();
			// alert(`${res.data.message},cost:${((end-begin)/1000).toFixed(3)}s`)
		})
		//经典的同步与异步问题 你无法在当时等待到message回应 所以无法直接return这个值出去 但至少你还能调用行为
}


/*
这里原本应该按照上面的理念将css内容写进css内 然后js只负责修改dom的标签就行了
但是这样就没办法通过.style检测element元素了 .style无法检测css内的修改 只有浏览器本身才能感知得到 真是奇怪

如果要实现就得强行分离这一个函数为两个独立的开与关 还是先算了罢
*/

function ShowToast(message){
	FotterToast.innerHTML = message;
	FotterToast.setAttribute('style',"visibility:visible;color:#fff");
	setTimeout(()=>{
		FotterToast.setAttribute('style',"visibility:hidden;background:none;color:rgba(0,0,0,0);box-shadow:none;");
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
		FotterToast.style.bottom = `${Math.min(20+0.1*latency, 50)}%`

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

function ProgressRest(){
	FotterToast.setAttribute('style',"bottom:20%")
	progressContainer.setAttribute('style',"visibility:visible")
	progressPercent.innerText = `0%`;
}

function visible(){
	if(uploadContainer.style['visibility']=="hidden"){
		uploadContainer.setAttribute("style","visibility:visible;background-color:rgba(33, 100, 134, 0.11);box-shadow: 0px 20px 20px 0px #00000017;")
		dropzone.setAttribute("style","border: 2px dashed var(--border-color);") //js in css的实现会产生延迟..
		title.setAttribute("style","color:#7F7F7FAA;")
		browseBtn.setAttribute("style","color:#2196f3")
		closeUploadButton.setAttribute('style','opacity: 1;')
	}
	
	else{
		uploadContainer.setAttribute("style","visibility:hidden;background-color:rgba(0,0,0,0);box-shadow:none;")
		dropzone.setAttribute("style","border:none")
		title.setAttribute("style","color:rgba(0,0,0,0)")
		browseBtn.setAttribute("style","color:rgba(0,0,0,0)")
		closeUploadButton.setAttribute('style','opacity: 0;')
	}
}



//不要将获取DOM的行为写在DOM树加载完之前！ 浪费半小时时间的教训


