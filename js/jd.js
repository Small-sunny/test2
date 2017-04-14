$('#header').load('header.html');
$('#footer').load('footer.html');
$('[type="button"]').click(function(){
	var result=$('#login-form').serialize();
	$.post('data/login.php',result,function(data){
		//console.log('开始处理响应数据...');
		//console.log(data);
		if(data.status<0){
			$('.modal-content p').html(data.msg);
			$('[name="uname"]').val('');
			$('[name="upwd"]').val('');
		}else{
			$('#login-msg').html(data.msg+",欢迎回来！");
			$('.modal').fadeOut();
			getMyOrder(data.msg,1);
		}
	})
});
$('[data-toggle="item"]').click(function(event){
	event.preventDefault();
	$(this).parent().addClass('active').siblings('.active').removeClass('active');

	var selector = $(this).attr('href');
	$(selector).addClass('active').siblings('.active').removeClass('active');
});

function getMyOrder(uname,pno){
	$.get('data/my-order.php',{'uname':uname,'pno':pno},function(pagerobj){
		console.log('开始处理我的订单...');
		console.log(pagerobj);

		var str='';
		$.each(pagerobj.data,function(i,order){
			str+='<tr>'
				+'<td colspan="6">订单编号:'+order.order_num+'<a href="'+order.shop_url
				+'">'+order.shop_name+'</a></td>'
				+'</tr>'
				+'<tr>'
				+'<td>'
				$.each(order.products,function(j,product){
					str+='<a href="'+product.product_url+'"><img src="'+product.product_img+'"></a>';
				})
			str+='</td>'
				+'<td>'+order.user_name+'</td>'
				+'<td><p>￥'+order.price+'</p><span>'+order.payment_mode+'</span></td>'
				+'<td><p>'+order.submit_time+'</p><span>'+order.order_state+'</span></td>'
				+'<td>等待收货</td>'
				+'<td><ul>'
				+'	<li><a href="#">查看</a>'
				+'  </li><li><a href="#">确认收货</a></li>'
				+'	<li><a href="#">取消订单</a></li>'
				+'	</ul>'
				+'</td>'	
				+'</tr>';
			$('#order-table tbody').html(str);	
		})
		
		
		//根据分页对象编写分页条
		var str='';
		if((pagerobj.cur_page-2)>0){
			str+='<li><a href="javascript:getMyOrder(\''+uname+'\','+(pagerobj.cur_page-2)+')">'+(pagerobj.cur_page-2)+'</a></li>';
		}
		if((pagerobj.cur_page-1)>0){
			str+='<li><a href="javascript:getMyOrder(\''+uname+'\','+(pagerobj.cur_page-1)+')">'+(pagerobj.cur_page-1)+'</a></li>';
		}
		
		str+='<li class="active"><a href="javascript:getMyOrder(\''+uname+'\','+(pagerobj.cur_page)+')">'+(pagerobj.cur_page)+'</a></li>';
		
		if((pagerobj.cur_page+1)<=5){
			str+='<li><a href="javascript:getMyOrder(\''+uname+'\','+(pagerobj.cur_page+1)+')">'+(pagerobj.cur_page+1)+'</a></li>';
		}
		if((pagerobj.cur_page+2)<6){
			str+='<li><a href="javascript:getMyOrder(\''+uname+'\','+(pagerobj.cur_page+2)+')">'+(pagerobj.cur_page+2)+'</a></li>';
		}
		$('.pager').html(str);
	});

}
/*异步请求消费统计数据，绘制消费统计图*/
$.get('data/buy-stat.php',function(data){ 
	console.log('开始处理统计数据...');
	drawBuyStat(data);
});
function drawBuyStat(data){
	var w=700;
	var h=400;
	var canvasBuystat=$('#canvas-buy-stat')[0];
	canvasBuystat.width=w;
	canvasBuystat.height=h;

	/*绘制图需要用到的变量*/
	var bgColor="#fff";
	var canvasWidth=canvasBuystat.width;
	var canvasHeight=canvasBuystat.height;
	var padding=60;
	var fontColor='#333';
	var fontSize=14;
	var exisEs=30;
	var origin={x:padding,y:canvasHeight-padding};//X坐标轴左下角坐标
	var XexisEnd={x:canvasWidth-padding,y:canvasHeight-padding};//X坐标轴右下角坐标
	var YexisEnd={x:padding,y:padding};
	var count=data.length;
	var xGridspace=(canvasWidth-2*padding-exisEs)/count;
	var yGridspace=(canvasHeight-2*padding-exisEs)/6;


	var ctx=canvasBuystat.getContext('2d');
	ctx.font=fontSize+'px SimHei';
	
		var maxValue=0;
		for(var i=0;i<count;i++){
			if(data[i].value>maxValue){
				maxValue=data[i].value;
			}
		}
		var avgValue=parseInt(maxValue/6);
		var linearGradient=ctx.createLinearGradient(0,0,0,500);//x1,y1,x2,y2
		linearGradient.addColorStop(0, rc());//position color
		//linearGradient.addColorStop(0.5, rc());//position color
		linearGradient.addColorStop(1, '#fff');//position color
		ctx.fillStyle=linearGradient;
	/*绘制X坐标轴*/
		ctx.beginPath();
		ctx.moveTo(origin.x,origin.y);
		ctx.lineTo(XexisEnd.x,XexisEnd.y);
		ctx.lineTo(XexisEnd.x-15,XexisEnd.y-15);
		ctx.moveTo(XexisEnd.x,XexisEnd.y);
		ctx.lineTo(XexisEnd.x-15,XexisEnd.y+15);
	//x轴标尺
		
		for(var i=0;i<count;i++){
			var x=(i+1)*xGridspace+origin.x;
			var y=origin.y;
			ctx.moveTo(x,y);
			ctx.lineTo(x,y-5);

			var txt=data[i].name;
			var	txtWidth=ctx.measureText(txt).width;
			ctx.fillText(txt,x-txtWidth,y+fontSize);
			var w=xGridspace/2;
			var h=data[i].value*(canvasHeight-2*padding-exisEs)/maxValue;
			//ctx.fillStyle=rc();
			ctx.fillRect(x-w,y-h,w,h);
		}
		ctx.stroke();
  	
	/*Y轴*/
		ctx.beginPath();
		ctx.moveTo(origin.x, origin.y);
		ctx.lineTo(YexisEnd.x,YexisEnd.y);
		//ctx.moveTo(YexisEnd.x,YexisEnd.y);
		ctx.lineTo(YexisEnd.x-15,YexisEnd.y+15);
		ctx.moveTo(YexisEnd.x,YexisEnd.y);
		ctx.lineTo(YexisEnd.x+15,YexisEnd.y+15);
		
		for(var i=0;i<6;i++){
			var x=origin.x;
			var y=origin.y-(i+1)*yGridspace;
			ctx.moveTo(x,y);
			ctx.lineTo(x+5,y);

			var txt=(i+1)*avgValue;
			var txtWidth=ctx.measureText(txt).width;
			ctx.fillText(txt,x-txtWidth-2,y+fontSize/2);
		}
		ctx.stroke();
		function rc(){
			var r=Math.floor(Math.random()*256);
			var g=Math.floor(Math.random()*256);
			var b=Math.floor(Math.random()*256);
			return 'rgb('+r+','+g+','+b+')';
		}
}

/*$.get('data/lottery-stat.php',function(data){
	if(data.left_count>0){
	
	}
})*/
drawLottery();


function drawLottery(){
	var ctx=$('#canvas-lottery')[0].getContext('2d');
	var canvasWidth=500;
	var canvasHeight=500;
	var pan=new Image();
	pan.src='img/as.png';
	var panLoaded=false;
	pan.onload=function(){
		console.log('圆盘加载完成');
		panLoaded=true;
		if(pinLoaded){
			startLottery();
		}
	}
	var pin=new Image();
	pin.src='img/pin.png';
	var pinLoaded=false;
	pin.onload=function(){
		console.log('指针加载完成');
		pinLoaded=true;
		if(panLoaded){
			startLottery();
		}
	}
	//console.log('代码结束');
	function startLottery(){
		console.log('开始抽奖');
		$('#bt-lottery').attr('disabled',false);
		ctx.drawImage(pan,0,0);
		ctx.drawImage(pin,canvasWidth/2-pin.width/2,canvasHeight/2-pin.height/2);
		ctx.translate(canvasWidth/2,canvasHeight/2);
		$('#bt-lottery').click(function(){
			$(this).attr('disabled',true);
			var deg=0;
			var duration=Math.random()*3000+5000;//转动持续时间
			var last=0;
			var timer=setInterval(function(){
				//ctx.clearRect(-250,-250,500,500);
				deg+=10;
				deg=deg%360;
				ctx.rotate(deg*Math.PI/180);
				ctx.drawImage(pan, -pan.width/2, -pan.height/2);
				ctx.rotate(-(deg*Math.PI/180));
				ctx.drawImage(pin,-pin.width/2,-pin.height/2);
				last+=20;
				if(last>=duration){
					clearInterval(timer);
					$('#bt-lottery').attr('disabled',false);
				}
			},50);
			//
		})
	}
}
