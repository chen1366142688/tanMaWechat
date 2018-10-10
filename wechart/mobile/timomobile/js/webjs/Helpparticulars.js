
// var appurl = 'http://192.168.3.4:8081';  //这个删除
var helpDetailId;		
$(function () {
  helpDetailId = GetQueryString('helpDetailId');
  helpnotice(this, helpDetailId);
})
  
 /*
  * 获取URL的参数值
  */
 function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}



/*帮助子标题
通过帮助详情ID查询详情信息
*/
/*helpDetailId 帮助详情的id */
function helpnotice(that, helpDetailId) {
  
          $.ajax({
            type: 'GET',
            url: appurl+"/v1/help/get/helpDetailInfoByHelpDetailId",
            data: {
               'helpDetailId': helpDetailId
				},
			dataType: "json",
			async: false,	
            success: function(res){
                // console.log(res);
                if(res.code == '10000')
                {
                  var result = res.response;
                  var article = result.content;
                   // console.log(article);
				   //$('.particular-headline').append();
                    // $('#diyige02').append(res.response.content);
			       //<!--$('#diyige02').html(res.response.content.replace("<p>","<p><span style='color:red;'>这是新增加得HTML内容文字</span>"));-->
				   $('#diyige02').html(res.response.content);
				   diyige02.innerHTML;		   
				  // var temp = $('#list-templete').html();
				   $.each(res, function (key, item) {
				   //item = "成功"
				   // var a01 = item;
				   // console.log(a01);
				   $('#diyige01').append(item.title);

				});
				
                }
            },
            error:function(data){
                console.log("请求失败，服务器错误")
            }
        })
		  
}

