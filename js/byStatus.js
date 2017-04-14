function byStatus(pageNum,size,status){
        $.post('web/machine/searchByStatus?pageNum='+pageNum+'&size='+size+'&status='+status,null,function(result){
            var result = eval('('+result+')');
            console.log(result);
            if(result.errcode==0){
                console.log(result.content.length);
                var tableHtml=bt('t:table',result);
                /*for(var i=0;i<result.content.length;i++){
            	machineIds.push(result.content[i].theaterChain.iD);
            	}
            	commentIds=machineIds.join("_");*/
                $("#status tbody").html("");
                $("#status tbody").html(tableHtml);
            	var pagecode = getpagecode(result.totalCount,result.pageNum,result.size,status);
	            if(result.content.length==0){
	            	$("#footer").html("暂无数据！");
	            	$("#chk").attr("disabled","disabled");
	            	$("#vpn").attr("disabled","disabled");
	            }else{
	            	$("#footer").html("");
		            $("#footer").html(pagecode);
		            $("#count").text("总记录数："+result.totalCount);
	            }
			}else{
				alert('请求错误！');
			}
        });
    }
    //initdata(1,10);

    function getpagecode(totalNum,currentPage,pageSize,status){
        var totalPage=totalNum%pageSize==0?parseInt(totalNum/pageSize):parseInt(totalNum/pageSize)+1;
        //		    	alert("totalpage"+totalPage+"currentPage"+currentPage);
        var pageCode = "<ul class='pagination pagination-sm no-margin pull-right'>";
        pageCode = pageCode + "<li><a pageNum='1' onclick='byStatus(1,"+pageSize+","+status+")'>首页</a></li>";
        if(currentPage==1){
            pageCode = pageCode + "<li class='disabled'><a href='#'>上一页</a></li>";
        }else{
            pageCode = pageCode + "<li><a pageNum='"+(currentPage-1)+"' onclick='byStatus("+(currentPage-1)+","+pageSize+","+status+")'>上一页</a></li>";
        }
        for(var i=currentPage-2;i<=currentPage+2;i++){
            if(i<1||i>totalPage){
                continue;
            }
            if(i==currentPage){
                pageCode = pageCode + "<li class='active'><a href='#'>"+i+"</a></li>";
            }else{
                pageCode = pageCode + "<li><a pageNum='"+i+"' onclick='byStatus("+i+","+pageSize+","+status+")'>"+i+"</a></li>";
            }
        }
        if(currentPage==totalPage){
            pageCode = pageCode + "<li class='disabled'><a href='#'>下一页</a></li>";
        }else{
            pageCode = pageCode + "<li><a pageNum='"+(currentPage+1)+"' onclick='byStatus("+(currentPage+1)+","+pageSize+","+status+")'>下一页</a></li>";
        }
        pageCode = pageCode + "<li><a pageNum='"+totalPage+"' onclick='byStatus("+totalPage+","+pageSize+","+status+")'>尾页</a></li>";
        pageCode = pageCode + "</ul>";
        if(totalNum == 0)
            pageCode="";
        return pageCode
}
