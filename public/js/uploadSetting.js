const $ = document.querySelector.bind(document);
var initalflag = 0;
var uploadOptions,dropzone,title,browseBtn,fileInput,fileUpload;

window.onload = function inital(){
	if(!initalflag){
		uploadOptions = $(".upload-container")
		dropzone = $(".drop-zone")
		title = $(".drop-zone .title")
		browseBtn = $("#browseBtn")
		fileInput = $("#fileInput")
		fileUpload = $("#fileUpload")

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
			event.preventDefault(); //阻止默认事件执行
			dropzone.classList.remove("dragging");
			const files = event.dataTransfer.files;
			fileInput.files = files; //子属性files代表input传入的文件

			console.log(`dragged ${files[0].name}`)
			fileUpload.click();
			//同理 不过这里是移除掉dragged的classname
			
		})

		browseBtn.addEventListener("click", () => {
			event.preventDefault();
			fileInput.click(); //隐藏了input那就代为执行input的click
		});

		//无论是拖拽还是browse 所指向的都是让input的属性改变这个行为

		fileInput.addEventListener("change", () => {
			event.preventDefault();
  			fileUpload.click();
		});

		initalflag = 1;
		console.log("inital complete.")
	}
}//等待DOM元素加载完毕开始执行


// const uploadFile = () => {
//   console.log("file added uploading");

//   files = fileInput.files;
//   const formData = new FormData();
//   formData.append("myfile", files[0]);

//   //show the uploader
//   progressContainer.style.display = "block";

//   // upload file
//   const xhr = new XMLHttpRequest();

//   // listen for upload progress
//   xhr.upload.onprogress = function (event) {
//     // find the percentage of uploaded
//     let percent = Math.round((100 * event.loaded) / event.total);
//     progressPercent.innerText = percent;
//     const scaleX = `scaleX(${percent / 100})`;
//     bgProgress.style.transform = scaleX;
//     progressBar.style.transform = scaleX;
//   };

//   // handle error
//   xhr.upload.onerror = function () {
//     showToast(`Error in upload: ${xhr.status}.`);
//     fileInput.value = ""; // reset the input
//   };

//   // listen for response which will give the link
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState == XMLHttpRequest.DONE) {
//       onFileUploadSuccess(xhr.responseText);
//     }
//   };

//   xhr.open("POST", uploadURL);
//   xhr.send(formData);
// };


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

