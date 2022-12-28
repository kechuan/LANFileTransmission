function visible(){
	const uploadOptions = document.querySelector("#uploadOptions")
	if(uploadOptions.style['visibility']=="hidden"){
		uploadOptions.setAttribute("style","visibility:visible")
		uploadOptions.setAttribute("style","background-color:rgba(33, 100, 134, 0.28)")
		

		console.log("visible trigger");
	}
	
	else{
		uploadOptions.setAttribute("style","background-color:rgba(0,0,0,0)")
		uploadOptions.setAttribute("style","visibility:hidden")
		

	}
}

//不要将获取DOM的行为写在触发事件之前！ 浪费半小时时间的教训