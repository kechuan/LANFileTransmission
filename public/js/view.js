const $ = document.querySelector.bind(document)

var list = $('#view')

function change(){
	var css = list.href.split('/')

	console.log(css)
	if(css.pop()=='listview.css'){	//直接截取 等待后续替换
		console.log('to grid');
		css.push('gridview.css')	//替换
	}
	

	else{
		console.log('to list')
		css.push('listview.css')	//替换
	}
	
	list.href=css.join('/')		//最终每个末尾添加'/'并转换成字符串
	
}
