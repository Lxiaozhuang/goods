

//个人DOM操作
var Dan=function(obj){					//Dan选择器
	return document.querySelectorAll(obj);
}
var findEle=function(obj,children){	//查找子元素
	return obj.querySelectorAll(children);
};
var delClass=function(obj,c){	    //删除class
	return obj.className=obj.className.replace(c,"");
};
var oneClass=function(obj,c){	    //添加class
	return obj.className=c;
};
var isClass=function(obj,c){	    //判断class
	return obj.className.match(c);
};
var hideEle=function(obj){	    //隐藏元素
	return obj.style.display="none";
};
var showEle=function(obj){	    //显示元素
	return obj.style.display="block";
};
var setCss=function(obj,css) {	//设置css json结构
	for(var attr in css){
		obj.style[attr] = css[attr];
	}
}



//弹窗提示
var alertDialog=function(tip,time){
	if(!tip){
		var alert_div=document.getElementsByClassName('alertDialog-box')[0];
		alert_div.parentNode.removeChild(alert_div);
		return false;	
	}
	if(isNaN(time)) var time=1500;
	var alert_div=document.createElement("div");
	alert_div.className="alertDialog-box";
	alert_div.style.cssText="position:absolute; left:50%; top:50%; z-index:888;transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,-50%,0);display:inline-block;padding:0.8rem;font-size:0.8rem; line-height:1rem; border-radius:0.25rem; color:#fff; background:rgba(255,102,102,0.9);transition:all 0.5s ease-out;-webkit-transition:all 0.5s ease-out;opacity:0;white-space:nowrap";
	alert_div.innerHTML=tip;
	document.body.appendChild(alert_div);
	setTimeout(function(){
		setCss(alert_div,{
			"opacity":1	
		});
	},10);
	setTimeout(function(){
		setCss(alert_div,{
			"opacity":0	
		});
	},time);
	setTimeout(function(){
		alert_div.parentNode.removeChild(alert_div);
	},time+500)
	
}
//alertDialog("好人好事");

//网址参数格式化
//var url="www.baidu.com?name=haha&sex=1";
//var url=window.location.href; 
var parseQueryString = function( url ){
    var reg_url =/^[^\?]+\?([\w\W]+)$/,
        reg_para=/([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
        arr_url = reg_url.exec( url ),
        ret        = {};
    if( arr_url && arr_url[1] ){
        var str_para = arr_url[1],result;
        while((result = reg_para.exec(str_para)) != null){
            ret[result[1]] = result[2];
        }
    }
    return ret;
}
//var obj=new parseQueryString(url); 
var paramControl=function(){
	var url=window.location.href;
	var param=new parseQueryString(url); 
	return param;	
}

//原生js ajax post ： url链接，data JSON数据，callback回调，type post或get，async是否异步
var ajaxPost=function(url,data,callback,type,async){
	
	var postData = data;		//上传的json
	
	var param=paramControl();
	var type2=param.type ? param.type:100;
	postData.type=type2
	
	var open2=1;
	var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger') open2=0;
	
	postData.open=open2; 
	 
	postData = (function(obj){ // 转成post需要的字符串.
		var str = "";
	 
		for(var prop in obj){
			str += prop + "=" + obj[prop] + "&"
		}
		return str;
	})(postData);
    
	
	var xhr = new XMLHttpRequest();
	type ? type="GET" : type="POST";
	async ? async=false : async=true;
	xhr.open(type, url,async);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(){
		var XMLHttpReq = xhr;
		if (XMLHttpReq.readyState == 4) {
			if (XMLHttpReq.status == 200) {
				var text = XMLHttpReq.responseText;
				if(typeof callback=="function") callback(text);        					//成功回调
			}
		}
	};
	xhr.send(postData);		//发送数据

}
//ajaxPost("post.php",{id:1,info:2});   测试提交


//分页切换
var page_switchover=function(obj1,obj2,ajaxParam){
	Dan("."+obj1)[0].dataset.fade=false;
	setTimeout(function(){
		Dan("."+obj2)[0].dataset.fade=true;	
	},300);
	
	if(ajaxParam) ajaxPost('./web/index.php?m=api&c=h5&a=log&loc='+ajaxParam,{},function(data){});	
}

//弹窗显示/隐藏
var pop_switchover=function(obj,ajaxParam){
	var obj=Dan("."+obj)[0];
	String(obj.dataset.show).match("true") ? delete obj.dataset.show:obj.dataset.show=true;
	
	if(ajaxParam) ajaxPost('./web/index.php?m=api&c=h5&a=log&loc='+ajaxParam,{},function(data){});	
}


/** 图片延迟加载 **/
//判断浏览器  
var Browser=new Object();  
Browser.userAgent=window.navigator.userAgent.toLowerCase();  
Browser.ie=/msie/.test(Browser.userAgent);  
Browser.Moz=/gecko/.test(Browser.userAgent);  
//判断是否加载完成  
var Imagess=function(url,imgid,callback){      
    var val=url;  
    var img=new Image();  
    if(Browser.ie){  
        img.onreadystatechange =function(){    
            if(img.readyState=="complete"||img.readyState=="loaded"){  
                callback(img,imgid);  
            }  
        }          
    }else if(Browser.Moz){  
        img.onload=function(){  
            if(img.complete==true){  
                callback(img,imgid);  
            }  
        }          
    }      
    img.src=val;  
}  
//显示图片  
var checkimg=function(obj,imgid){  
	document.getElementById(imgid).src=obj.src;  
}  
//初始化需要显示的图片，并且指定显示的位置  
var img_onload=function(n){  
	var imglist=Dan(".js_photoList")[n].getElementsByClassName("pic"); 
	for(i=0;i<imglist.length;i++){
		imglist[i].id="img"+(n*1000000)+""+i;  
		Imagess(imglist[i].dataset.original,imglist[i].id,checkimg);  
	}  
}  

