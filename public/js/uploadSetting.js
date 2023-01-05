const $ = document.querySelector.bind(document);
var Initalflag = 0;
var uploadOptions,dropzone,title,browseBtn,fileInput,fileUpload;
var uploadForm;

window.onload = function Inital(){
	if(!Initalflag){
		uploadOptions = $(".upload-container")
		dropzone = $(".drop-zone")
		title = $(".drop-zone .title")
		browseBtn = $("#browseBtn")
		fileInput = $("#fileInput")
		fileUpload = $("#fileUpload")
		dirsection = $('.dirsection')
		filesection = $('.filesection')
		

		/*
		如果直接用dragover触发频率太高
		就用requestAnimationFrame吧
		*/

		dropzone.addEventListener("dragover", (event)=>{
			event.preventDefault();
			window.requestAnimationFrame(
				()=>{dropzone.classList.add("dragging");console.log("dragging")}
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
			formDataUpload(files);
			// futch('/upload').then(console.log)
		})

			

		browseBtn.addEventListener("click", () => {
			event.preventDefault();
			fileInput.click(); //隐藏了input那就代为执行input的click
		});

		//无论是拖拽还是browse 所指向的都是让input的属性改变这个行为

		fileInput.addEventListener("input", () =>{
			event.preventDefault();
			console.log("something input in fileInput.")

			uploadForm = $('#uploadForm') //当前form的数据
			
			// fileInput.click();
		})

	Initalflag = 1;
	console.log("inital complete.")
		
	}

	
}
//等待DOM元素加载完毕开始执行

function futch(url, opts={}, onProgress) {
    return new Promise( (res, rej)=>{
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method || 'get', url);
        for (var k in opts.headers||{})
            xhr.setRequestHeader(k, opts.headers[k]);
        xhr.onload = e => res(e.target.responseText);
        xhr.onerror = rej;
        if (xhr.upload && onProgress)
            xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
        xhr.send(opts.body);
    });
}



function formDataUpload(files){
	uploadForm = $('#uploadForm') //当前form的数据
	let formData = new FormData(uploadForm);
   	// formData.append('Files',files[0]) //?文件测试 当然 你也可以即时添加一个input 冠以其他名字进行上传
   	console.log(files[0].length)
	
	fetch("/upload",{
		//options
	    method: "POST",
	    headers: {
		       // 'Content-Type': 'application/x-www-form-urlencoded' //解析表单数据formdata
	    },
	    body:formData,
	    dataType:"text"
	})
			
		//callback
		.then((res)=>{return res.json()})
		.then((res)=>{
			alert(res.message)
		})	
		//经典的同步与异步问题 你无法在当时等待到message回应 所以无法直接return这个值出去 但至少你还能调用行为
}



/*
这里原本应该按照上面的理念将css内容写进css内 然后js只负责修改dom的标签就行了
但是这样就没办法通过.style检测element元素了 .style无法检测css内的修改 只有浏览器本身才能感知得到 真是奇怪

如果要实现就得强行分离这一个函数为两个独立的开与关 还是先算了罢
*/

function visible(){
	if(uploadOptions.style['visibility']=="hidden"){
		uploadOptions.setAttribute("style","visibility:visible;background-color:rgba(33, 100, 134, 0.11)")
		dropzone.setAttribute("style","border: 2px dashed var(--border-color);") //js in css的实现会产生延迟..
		title.setAttribute("style","color:#7F7F7FAA;")
		browseBtn.setAttribute("style","color:#2196f3")
	}
	
	else{
		uploadOptions.setAttribute("style","visibility:hidden;background-color:rgba(0,0,0,0)")
		dropzone.setAttribute("style","border:none")
		title.setAttribute("style","color:rgba(0,0,0,0)")
		browseBtn.setAttribute("style","color:rgba(0,0,0,0)")
	}
}

//不要将获取DOM的行为写在DOM树加载完之前！ 浪费半小时时间的教训

