/**
 * Created by Administrator on 2016/11/21.
 */
(function init() {

    updateServerList();
    initServerOperationEvent();
    $('#add-server').click(function(e) {
        var serverData = {
            location: $('#server-location').val(),
            server_ip: $('#server-ip').val(),
            ip_pool: $('#ip-pool').val(),
            remark: $('#server-remark').val()
        }
        addServer(serverData);
    })

})();

function updateServerList() {
    var getData = $.ajax({
        type: "GET",
        url: "/server/list",
        dataType: "json",
        success: function(data) {
            updateServerListDom(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
};

function addServer(serverData) {
    var postData = $.ajax({
        type: "POST",
        url: "/server/admin",
        dataType: "json",
        data: serverData,
        success: function(data) {
            alert(data.message);
            updateServerList();
            $('#addServiceModal').modal('hide');
            cleanAddServerModal();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
};

function deleteServer(serverData) {
    var postData = $.ajax({
        type: "POST",
        url: "/server/delete",
        dataType: "json",
        data: serverData,
        success: function(data) {
            alert(data.message);
            updateServerList();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
};

/*function connectServer(serverData) {
 *     window.open("http://10.150.140.96:12345?server_ip=" + serverData[2] + "&location=" + serverData[1]);
 *     };*/

function connectServer(serverData) {
    window.open("http://192.168.8.199:12345/");
};

function updateServerListDom(data) {
    var tr = [],
        td = [],
        trData = [];

    for (var i = 0, len = data.message.length; i < len; i++) {
        (function(trData) {
            td = [];

            for (var i = 0, len = trData.length; i < len; i++) {
                td.push('<td>' + trData[i] + '</td>');
            };

            td.push('<td>'
                + '<button class="server-operation btn btn-xs btn-primary"><i class="fa fa-gears"></i> 鎿嶄綔</button>'
                + '<button class="server-delete btn btn-xs btn-danger"><i class="fa fa-trash"></i> 鍒犻櫎</button>'
                + '</td>');
        })(data.message[i]);

        tr.push('<tr>' + td + '</tr>');
    };

    $('#server-list').html(tr);
};

function cleanAddServerModal() {
    $('#server-location').val('');
    $('#server-ip').val('');
    $('#ip-pool').val('');
    $('#server-remark').val('');
}

function initServerOperationEvent() {

    $('#server-list').click(function(e) {
        if ($(e.target).hasClass("server-delete") || $(e.target).parent().hasClass("server-delete")) {

            var serverData = getTrServerData($(e.target).closest("tr"));
            deleteServer(serverData);

        } else if ($(e.target).hasClass("server-operation") || $(e.target).parent().hasClass("server-operation")) {

            var serverData = getTrServerData($(e.target).closest("tr"));
            connectServer(serverData);

        }

    })

    function getTrServerData($tr) {
        return {
            id: $tr.find('td:eq(0)').html(),
            location: $tr.find('td:eq(1)').html(),
            server_ip: $tr.find('td:eq(2)').html(),
            ip_pool: $tr.find('td:eq(3)').html(),
            remark: $tr.find('td:eq(4)').html(),
        }
    }

}

//----根据行号修改信息-----
function updateRow(r){
    row = getRow(r); //把该行号赋值给全局变量
    showAddInput(); //显示修改表单
    //提交按钮替换
    document.getElementById('btn_add').style="display:none" ;
    document.getElementById('btn_update').style="display:block-inline" ;
    insertInputFromQuery(queryInfoByRow(row));

}
//----根据行号修改信息-----


//----根据行号查信息----
function queryInfoByRow(r){

    var arr = new Array();
    for(var m=0 ; m<7;m++){
        arr[m] = document.getElementById('table').rows[row].cells[m].innerText;
    }
    return arr ; //返回该行数据

}
//----根据行号查信息----

//----把查询到的信息放入修改的表单里----
function insertInputFromQuery(arr){
    document.getElementById('username').value = arr[0];
    document.getElementById('password').value = arr[1];
    document.getElementById('name').value = arr[2];
    document.getElementById('email').value = arr[3];
    document.getElementById('phone').value = arr[4];
    document.getElementById('qq').value = arr[5];
    document.getElementById('uid').value = arr[6];

}
//----把查询到的信息放入修改的表单里----


function updateInfo(){
    if(judge()==true){
        alert('修改成功');
        document.getElementById('table').deleteRow(row);//删除原来那行
        insertInfo(); //插入修改后的值
        hideAddInput(); //隐藏添加模块
    }else{
        alert('修改失败');
        hideAddInput();
    }
}