var flag = 'login';
const $ = document.querySelector.bind(document)

const register_switch = function(){
	var title = $('#title') 
	//无法直接获取textNode赋值 因为在这个js里获取的不是那个dom
	// 而是。。文字 这个描述好奇怪 但就是如此 如果你在console则可以直接获取textNode修改 但是这里不行
	//也不是什么onLoad等DOM预先加载的问题 也许是因为控制台时的DOM变化更为"实时" 才做的到先获取 再更改
	//而js想做到这一点只能先获取主元素
	

	var submit = $('form input[type="submit"]')
	var storage = $("ready") //因为ready的位置会变更 所以需要重复定义？？？

	var footer = $('.footer')
	var now_channel = $('.footer span')

	var login = $("login")
	var register = $("register")

	var lg_channel = $("login>span")
	var rg_channel = $("register>span")

	var password_form = $('#input_form')
	var password_confirm_form = $('#register_password')
	

	if(flag=='login'){
		password_form.appendChild(password_confirm_form)
		title.textContent = 'Register' //每次定义的时候 因为赋值优先
		submit.value = 'Sign up'

		
		register.appendChild(footer.replaceChild(lg_channel,now_channel)) 
		//register标签接管替换回来的rg_channel
		
		flag = 'register'
		
	}

	else{
		storage.appendChild(password_confirm_form)
		title.textContent = 'Login' //每次定义的时候 因为赋值优先
		submit.value = 'Login in'
		
		login.appendChild(footer.replaceChild(rg_channel,now_channel))
		//login标签接管替换回来的lg_channel
		
		flag = 'login'
	}

}