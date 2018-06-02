/**
 * @authors ls
 * @date    2017-06-5 8:50
 * @version $Id$
 */
//检测是否登陆状态
var reCsid = getQueryString('hotelCode');
var csId = reCsid ? reCsid :JSON.parse(localStorage.getItem('hotelMsg')).csId;
var tokenId = localStorage.getItem('userMsg') ? JSON.parse(localStorage.getItem('userMsg')).token : '';    //获取tokenid值
var routeArr = [];
var isFromPayoutPage = false; // 是否从支付结果页面跳转过来，是的话返回按钮回到首页
var isOnekiloMeterInner = false; // 是否是1公里以内
var routeDistance = 0; // 距离几公里
if(sessionStorage.getItem("routeArr")) { // 存在
  routeArr = JSON.parse(sessionStorage.getItem("routeArr"));
  if(routeArr[routeArr.length - 1].indexOf("payout.html") > -1) {
    isFromPayoutPage = true;
  }
}
// 判断登录状态
if(localStorage.getItem("loginNum") && localStorage.getItem("loginPsw") && sessionStorage.loginState == null) { //自动登录
  $.ajaxSettings.async = false; 
	$.post(getUrl($.ajaxUrl.login), {
		"unm": localStorage.getItem("loginNum"),
		"pwd": localStorage.getItem("loginPsw"),
		"csId":csId,
		'applyfrom':'21'
	}, function(data) {
		if(data.retCode === 1) { //登录成功
			console.log("登陆成功");
			localStorage.setItem("userMsg", JSON.stringify(data.result));
			sessionStorage.loginState = true;
		} else {
			location.href = "/hotel-interface-zkt/wx-zkt/login.html"; //跳转登录页面
		}
	}, "json");
} else if(!localStorage.getItem("loginNum") || !localStorage.getItem("loginPsw")) {
	location.href = "/hotel-interface-zkt/wx-zkt/login.html"; //跳转登录页面
}
  // 微信接口权限验证配置
$.post(getUrl($.ajaxUrl.getWeConfig), {
	'token':tokenId,
	'url': location.href
}, function(data) {
	console.log(data);
  var d = data.result;
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: d.appId, // 必填，公众号的唯一标识
		timestamp: d.timestamp, // 必填，生成签名的时间戳
		nonceStr: d.nonceStr, // 必填，生成签名的随机串
		signature: d.signature, // 必填，签名，见附录1
		jsApiList: ['getLocation', 'onMenuShareQZone', 'onMenuShareQQ', 'onMenuShareAppMessage', 'chooseWXPay', 'closeWindow', 'chooseImage', 'previewImage', 'uploadImage', 'getLocalImgData', 'downloadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	wx.ready(function() {
		wx.getLocation({
			type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success: function(res) {
				var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				var speed = res.speed; // 速度，以米/每秒计
				var accuracy = res.accuracy; // 位置精度
				var userMsg = localStorage.getItem('userMsg')?JSON.parse(localStorage.getItem('userMsg')):'';
				console.log("微信返回纬经度：" + latitude + '|' + longitude);
        // lat纬度，lng精度
        var hotelMsg = localStorage.getItem('hotelMsg') ? JSON.parse(localStorage.getItem('hotelMsg')) : '';
        var posArr = hotelMsg.position.split('|'); // 第一个是经度，第二个是纬度。
        console.log('酒店所处位置经纬度', posArr);
        // 计算人所在当前位置离酒店的距离
        // routeDistance = parseFloat(getDistance(posArr[1], posArr[0], latitude, longitude)).toFixed(1); // 距离，km
        routeDistance = 0.2;
        isOnekiloMeterInner = routeDistance > 1 ? false : true;
        console.log('计算的routeDistance距离', routeDistance);
        $("#demo").find(".location p.locaRight span").text(routeDistance);

        /**
         * 获取两个经纬度之间的距离
         * @param lat1 第一点的纬度
         * @param lng1 第一点的经度
         * @param lat2 第二点的纬度
         * @param lng2 第二点的经度
         * @returns {Number}
        */
        function getDistance(lat1, lng1, lat2, lng2) {
          var radLat1 = lat1*Math.PI / 180.0;
          var radLat2 = lat2*Math.PI / 180.0;
          var a = radLat1 - radLat2;
          var b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
          var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
          Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
          s = s *6378.137 ; // EARTH_RADIUS;
          s = Math.round(s * 10000) / 10000;
          return s;
        }

			}
		});
  });
});

/***********此处开始代码************/
var imageURL = [], //缓存照片本地绝对路径
	userMsg = JSON.parse(localStorage.getItem('userMsg')),
	Lat, Lng, locCity, //当前经纬度和城市
	toDayOrder,
	orderDetail, //当前订单详情
	idInfo = {}, //办理入住人个人信息
	guestAppLiveType = 2, //自助入住规则
	HOST_URL = "http://wx.samsoft.com.cn:10123", //192.168.1.131:8888
  hotelMsg = JSON.parse(localStorage.getItem("hotelMsg")),
	csid = getQueryString("hotelCode") ? getQueryString("hotelCode") : hotelMsg.csId ;

//获取酒店对应的入住规则 
// $.post(getUrl($.ajaxUrl.getLiveType), {
// 	"token":tokenId,
// 	"csId": csid
// }, function(data) {
// 	console.log(data)
// 	if(data.retCode === 1 && data.result.guestAppLiveType) {
// 		console.log('获取酒店的入住规则',data.result)
// 		guestAppLiveType = data.result.guestAppLiveType; //2/自助入住,1/系统办理,0/无需认证
// 	} else {
// 		console.warn(data.msg)
// 	}
// }, 'json')

$("#wrapper").each(function() {
	var self = $(this),
		demo = $("#demo"),
		page = self.find("#page"),
		popMss = self.find("#cover #popMss"),
		cover = self.find("#cover"),
		lived = self.find("#lived"),
    addman = self.find("#addman"),
    charge = self.find("#charge"),
    paid = self.find("#paid"),
		identityed = self.find("#identityed"),
		identity = self.find("#identity"),
		identity2 = identity.next(),
		identity3 = identity2.next(),
		identity4 = identity3.next(),
		photo = identity4.next(),
		photo1 = photo.next(),
		identitySure = photo1.next(),
		identitySureed = identitySure.next(),
    addusername = addman.find(".main #addUserName"),
    addUserPhone = addman.find(".main #addUserPhone"),
		singleOrderGuid = getQueryString("guid"),
		addOrUp = true, //true为更新,flase为新增
		sendTextMsg, //发送往公众号聊天界面的信息
		userMsg = JSON.parse(localStorage.getItem('userMsg'));
    // 控制手机号码输入
    addUserPhone.keypress(function(event){
      var keyCode = event.which;
      if(keyCode >= 48 && keyCode <=57) {
        return true;
      }else{
        return false;
      }
    });
  //从已订订单回到上一页，刷新
  // 如果直接从微信自定义菜单进入，则隐藏返回箭头
  if(history.length == 1) {
    demo.find(".page-head .btn-back").hide();
  }
  page.find(".btn-back").onTouchEnd(function(){
    if(document.referrer.indexOf("payout.html") > -1 || isFromPayoutPage) { // 从支付结果过来，只能去到首页
      location.href = csId ? ("check-room.html?hotelCode=" + csId) : "check-room.html";
    }
    console.log('从已订回到上一页了')
    console.log('UIcontroler',UIcontroler.pageHistory)
    if(sessionStorage.isAddRZRSuccess == 1) {
      console.log('之前修改成功');
      console.log('UIcontroler',UIcontroler.pageHistory)
      getOrderList();
      sessionStorage.removeItem('isAddRZRSuccess');
      // 刷新页面
    }else{
      console.log('没有修改，不用刷新')
    }
  });
  // 跳转到地理位置
	page.find(".btn-map").onTouchEnd(function(){  
    console.log('点击地图按钮')
    window.location.href = "../map/hotel-map.html?type=1";
  });
  // 生成可办理入住的订单列表
  function getOrderList() {
    console.log('生成入住列表')
    $.post(getUrl($.ajaxUrl.getorderlistToday), { ///获取生成可办理入住的订单列表
      'token':tokenId,
      'csId': csid ? csid : '605588'
    }, function(data) {
      console.log(data);
      if(data.retCode == 1 || data.retCode == 5000) {
        var list = data.result;
        console.log('list',list);
        var canLiveNum = 0; // 可以办理自助入住的订单数
        demo.find("#order-list").empty();
        // 预订，已订的订单才能显示在自助入住页面
        for(var i = 0; i < list.length; i++) {
          if(list[i].orderstatus == 110 || list[i].orderstatus == 120) {
            canLiveNum += 1;
            // var checkDate = new Date(list[i].rzrq).format("MM月DD日")  + (list[i].orderType == 1?'':'-'+ new Date(list[i].tfrq).format("MM月DD日")) + '('+list[i].rzts + (list[i].orderType == 1 ? '小时':'晚')+')';
            var checkDate;
            console.log('list[i]',list[i])
            if(list[i].orderType == 1) { // 钟点房
              checkDate = list[i].rzrq.replace(/^.+-(..)-(..).*/, '$1' + '月' + '$2' + '日').substring(0,6) + ' ('+list[i].rzts + '小时)';
            }else { // 全日房
              checkDate = list[i].rzrq.replace(/^.+-(..)-(..).*/, '$1' + '月' + '$2' + '日').substring(0,6) + '-' + list[i].tfrq.replace(/^.+-(..)-(..).*/, '$1' + '月' + '$2' + '日').substring(0,6) + ' ('+list[i].rzts + '晚)';
            }
            demo.find("#order-list").append(`<li data-guid=${list[i].guid}>     
              <div class="ordertop">
                <div class="top-left">
                  <img ${list[i].orderType==1?'src="../images/icon-clock_3.png"':''}/>
                  <img ${Number(list[i].isBluetoothDoor) ? 'src="../images/win_icon/blue.png"' : ''}/>               						
                </div>
                <p>
                  <strong>${list[i].hotel_name}</strong>/
                  <em>${list[i].ptdh ? list[i].ptdh : ( list[i].sqdh ? list[i].sqdh : list[i].guid.substr(-11,10) )}</em>/
                  <span>${list[i].ptmc ? list[i].ptmc : '微信'}</span>
                </p>
              </div>
              <div class="order-main">
                <div class="order-left" style="background-image: url(${list[i].fangjianpic});">
                  ${list[i].teshe ? '<i class="feature"></i>' : ''}
                  <p>${list[i].avgScore?list[i].avgScore:5}分</p>
                </div>
                <div class="order-body">
                  <p><i ${list[i].orderstatus==310 ? 'style="display: none;"' : (list[i].orderstatus==120 ? 'class="user"' : 'class="warn"')}></i><em>${list[i].xm && list[i].xm!= undefined?list[i].xm:''}</em> <span>${list[i].lxdh?list[i].lxdh:''}</span><s>(${list[i].rzrs}人)</s></p>
                  <p><span class="room-con">${list[i].fjhStr}房</span> ${list[i].hymc}${list[i].louceng}楼</p>
                  <p>${checkDate}</p>
                  <s class="status" style="background-image: url(../images/order_state${(list[i].orderstatus).replace(/(100)|(910)|(930)/,920).replace(/(911)/,910).replace(/(413)/,411).replace(/(414)/,412).replace(/(431)/,430).replace(/(410)|(440)/,330).replace(/(320)/,310)}.png);"></s>
                </div>
                <div class="order-right">
                  <p>总额</p>
                  <p>¥
                    <span>${list[i].zje}</span></p>
                  <p>${ Number( list[i].yk ) > 0 ? '订单余额' : '应付款' }</p>
                  <p style="color: ${list[i].yk != 0 ? (list[i].yk > 0 ? '#308d75' :'#91650E') : '#888888'} ;">¥
                    <span class="order-pay" ${ Math.abs(list[i].yk) > 9999 ? (Math.abs(list[i].yk) > 99999 ? 'style="font-size: .7rem"' : 'style="font-size: .8rem"') : ''}>${ Math.abs(list[i].yk) }</span>
                  </p>
                </div>
              </div>
            </li>`);
          }
        }
        $("#demo").find(".location p:first-child").text(list[0].hotel_name + '(' + canLiveNum + ')');
        //弹框提示  ///注册订单点击事件 并 在事件中获取和渲染订单详情
        demo.find("#order-list li").onTouchEnd(function() {
          singleOrderGuid = this.dataset.guid;
          checkInOrder(singleOrderGuid); //点击单个订单办理入住
        });
  
      } else if(data.retCode == -1 || data.retCode == 3000) {
        //removeLoginSession();
        UIcontroler.tipsWin(data.msg, "10");
        location.href = "/hotel-interface-zkt/wx-zkt/login.html"; //跳转登录页面
      } else {
        UIcontroler.tipsWin(data.msg, "10")
      }
    }, "json");
  }
  getOrderList();
	if(singleOrderGuid) { //订单列表进入的直接跳转
		checkInOrder(singleOrderGuid); //点击单个订单办理入住
	}
	//点击单个订单办理入住
	function checkInOrder(singleOrderGuid) {
		$.post(getUrl($.ajaxUrl.getorderdetail), {
			"token": userMsg.token,
			"ddguid": singleOrderGuid
		}, function(data) {
			console.log(data);
			if(data.retCode == 1 || data.retCode == 5000) {
				var d = data.result,
					rzrguid;
        orderDetail = d;
        
        // 由result来获取orderType是否
				//根据订单状态,进入渲染的page或lived
				if(d.orderStatus == 310 || d.orderStatus == 320) {
					UIcontroler.toggle_page("lived");
					addman.find("footer .identity").hide();
				} else if(d.orderStatus == 110 || d.orderStatus == 120 || d.orderStatus == 210 || d.orderStatus == 220) {
					if(d.orderStatus == 120) $("#page .page-head h1").text("已订订单");
					UIcontroler.toggle_page("page");
				} else {
					UIcontroler.tipsWin("该订单状态：" + d.orderStatus + "不符合办理入住要求!", "10");
					return;
				}

				loadDetail("lived", d); //渲染已入住section
				loadDetail("page", d); //渲染已订房section

				//页面跳转  添加或修改联系人和联系号码

				self.find(".info").onTouchEnd(".main_info div", function() {
          rzrguid = this.dataset.rzrguid;
          console.log('rzrguid',rzrguid)
					idInfo.rzrguid = rzrguid ? rzrguid : '';
          // 隐藏你可以自助认证身份，办理入住
         
					if($(this).hasClass("namephone")) { //修改
            console.log('修改');
						//限定已 办理身份认证人 拒绝更改信息
						if($(this).find("s.yrz").length > 0) {
							return false;
						}

						var info = $(this).text().replace(/\s+/, "").replace(/\s+/g, " ").split(' ');
            addusername.val(info[0]).parent().next().find("#addUserPhone").val(info[1]);

					} else { //新增
            console.log('新增入住人')
						addusername.val('').parent().next().find("#addUserPhone").val('');
          }
          addman.find('footer').hide();
					UIcontroler.toggle_page("addman");
				})

				//添加或修改联系人和联系号码
				addman.find(".btn-btnSave").onTouchEnd(function() {

					var phoneNum = addusername.parent().next().find("#addUserPhone").val(),
						newName = addusername.val(),
						mainInfo = page.find(".info .main_info");

					var YDcheckout = /^((13[4-9])|(147)|(15[0-2,7-9])|(178)|(18[2-4,7-8]))\d{8}|(1705)\d{7}$/; //移动号码校验 正则
					var LTcheckout = /^((13[0-2])|(145)|(15[5-6])|(17[1|6])|(18[5,6]))\d{8}|(1709)\d{7}$/; //联通号码校验 正则
					var HMcheckout = /^((133)|(153)|(17[1|7])|(18[0,1,9]))\d{8}$/; //号码校验 正则	
          if(newName.length == 0) {
            UIcontroler.tipsWin("<p style='font-size:.75rem;'>请输入姓名</p>", "10");
            return;
          }else if(newName.length > 0 && phoneNum.length == 0 ) {
            UIcontroler.tipsWin("<p style='font-size:.75rem;'>请输入手机号码</p>", "10");
            return;
          } else if(newName.length > 0 && phoneNum.length != 0 && phoneNum.length != 11){
            UIcontroler.tipsWin("<p style='font-size:.75rem;'>请输入正确的手机号码</p>", "10");
            return;
          } else if(phoneNum.length == 11 && (YDcheckout.test(phoneNum) || LTcheckout.test(phoneNum) || HMcheckout.test(phoneNum))) {
            if(!checkRepeat(singleOrderGuid, phoneNum)) { // 号码不重复
              addRZR(newName, phoneNum, rzrguid); //调用封装方法，添加同房入住人 或 修改保存联系人，并刷新订单详情信息渲染
              UIcontroler.tipsWin("<p style='font-size:.75rem;'>保存成功</p>", "10");
            }else{
              UIcontroler.tipsWin("<p style='font-size:.75rem;'>手机号码重复</p>", "10");
              return;
            }
          }

        });
        // 监听输入框变化
        addman.on("input properchange", "#addUserPhone", function(){
          var thisVal = $(this).val();
          $(this).val(thisVal.replace(/[^\d]/g,''));
          if(thisVal.length > 11) {
            $(this).val(thisVal.subString(0,11))
          }
        });
				//已入住界面事件
				lived.find("footer .myroom").onTouchEnd(function() {

					if(Number(d.isBluetoothDoor)) {

						UIcontroler.toggle_cover("popBluetooth");
						sendTextMsg = "您已办理入住成功！您的房间蓝牙秘钥已绑定，可通过下方“自助入住”——>“手机开门”菜单项打开房间门哦";

						$.post(getUrl($.ajaxUrl.sendBluetooth), {
							"token":tokenId,
							"guid": d.guid
						}, function(data) {
							console.log('蓝牙发送成功' + data);
							UIcontroler.toggle_cover("popBluetooth");
						}, 'json')

					} else {

						UIcontroler.toggle_cover("popNoBluetooth");
						sendTextMsg = "您已办理入住成功！您的房间不支持蓝牙开门，您只需携带本人身份证, 前往前台领取门卡就可以入住房间啦！";
					}
				});
        // 查看已支付金额
        self.find(".tips_info .deposit").onTouchEnd(function(){
          console.log('点击查看已支付')
          var contentWrap = paid.find(".main .content-wrap")
          contentWrap.empty(); // 先清空
          paid.find("header h1").text(`${d.house.mph}房-已支付`);

          // 生成已支付项dom
          var list = d.fwddskList;
          var paidList = ``;
          var padTotal = 0;
          for(var i=0,len = list.length; i<len;i++) {
            paidList += `<div class="item" data-no="${i+1}">
                          <p class="pay-method">${list[i].sklx}${list[i].lsh?(' ('+list[i].lsh.replace(/(\w{8})\w{6,}(\w{4})/, '$1.......$2')+')'):''}</p>
                          <p class="pay-time">${list[i].sksj}${list[i].xm?' '+list[i].xm:''}</p>
                          <span class="arrow">￥<em>${parseFloat(list[i].skje).toFixed(2)}</em></span>
                        </div>`;
            padTotal += list[i].skje;
          }
          contentWrap.append(paidList);
          paid.find(".main .head-top em").text(parseFloat(padTotal).toFixed(2));
          // 给每一项绑定事件，点击打开弹窗
          paid.find(".content-wrap .item").onTouchEnd(function(){
            var no = $(this)[0].dataset.no - 1;
    
            console.log('要改变的值，第几条',list[no])
            // 渲染数据
            var popWindow = $("#paidPopCover").find(".popWindow");
            popWindow.empty();
            // 拼接数据
            var patent = /(.jpg|.png)$/;
            var popStr = `<h3>${list[no].sklx}</h3><a href="###" class="close-btn"></a>
                          <div class="itemWrap">
                            <div class="item">支付金额<span class="paid-amount">￥${parseFloat(list[no].skje).toFixed(2)}</span></div>
                            <div class="item">支付单号<span class="padi-no">${list[no].lsh}</span></div>
                            <div class="item">操作人<span class="handle-person">${list[no].xm}</span></div>
                            <div class="item">操作时间<span class="handle-time">${list[no].sksj}</span></div>
                            <div class="item">
                                <span class="label">备注</span><p class="beizhu">${list[no].bz}</p>
                            </div>
                            <div class="item"><img src="${list[no].fj}" class="${patent.test(list[no].fj)?'show':''}"></item>
                          </div>`;
       
            popWindow.append(popStr);
            $("#paidPopCover").show();
            $("#paidPopCover .popWindow").addClass("show");
            // 绑定事件
            $("#paidPopCover").find(".close-btn").onTouchEnd(function(){
              console.log('关闭弹窗')
              $("#paidPopCover").hide();
              $("#paidPopCover .popWindow").removeClass("show");
            });
            $("#paidPopCover").onTouchEnd('.pop-cover',function(e){
              console.log('点击遮罩关闭弹窗',e)
              $("#paidPopCover").hide();
              $("#paidPopCover .popWindow").removeClass("show");
            });
  

          });

          
          UIcontroler.toggle_page("paid");
        });
        // 查看房费
        self.find(".tips .tips_info .Amount").onTouchEnd(function(){
          charge.find('.main').empty();
          // 修改房费页面标题
          charge.find("header h1").text(`${d.house.mph}房-房费（${d.rzts+(d.orderType == 0 ?'晚':'小时')}）`);
          // 生成房费dom
          console.log('ddddddddd',d)
          var ddfjxxList = d.ddfjxxList;
          var chargeList = ``;
          for(var i=0,len = ddfjxxList.length; i<len; i++) {
            chargeList += `<div class="item">
                            <p>${ddfjxxList[i].rq}<i class="${ddfjxxList[i].ishuanfang != 0 ? 'label-h': (ddfjxxList[i].isxuzhu != 0 ? 'label-x': (d.orderType == 1 ? 'icon-clock':''))}"></i>&nbsp;${d.orderType == 1?ddfjxxList[i].ts+'小时':''}<span class=""><i class="money">￥</i>${ddfjxxList[i].qrxyj?ddfjxxList[i].qrxyj:ddfjxxList[i].qrfj}</span></p>
                            <p class="roomInfo">（${d.house.mph+'房 '+d.house.huayuan.hymc+d.house.louceng+'楼'}）<span>${ddfjxxList[i].xyzk?('（协议折扣'+ddfjxxList[i].xyzk*100+'%）'):ddfjxxList[i].djzk>0&&ddfjxxList[i].djzk<1?'（折扣'+ddfjxxList[i].djzk*100+'%）':''} <i class="money">￥</i>${ddfjxxList[i].yfj}</span></p>
                          </div>`
          }
          charge.find('.main').append(chargeList);
          UIcontroler.toggle_page("charge"); // 打开房费页面
        });

			} else {

				UIcontroler.tipsWin(data.msg, "10")
				//removeLoginSession();
				location.href = "/hotel-interface-zkt/wx-zkt/login.html"; //跳转登录页面
			}
		}, "json");
  }
  


  var isSelfAndNoVerify = false; // 是本人且未核实
  var hasOtherRzrNoverify = false; // 有其他未核实入住人或本人未认证
	//渲染单个订单详情 page和lived数据
	function loadDetail(mark, d) {
		console.log('ddddd',d)
		console.log(d.score?d.score:'无分数');
		var page = $("#wrapper #" + mark);
		page.find(".order-left").css('background-image', "url('" + d.house.houseImg ? d.house.houseImg : d.house.lcpmt + "')")
			.find("p").text(d.house.avgScore?house.avgScore+'分':'5分');

		page.find(".ordertop").empty().append(`
			<div class="top-left">
				${ Number(d.house.isBluetoothDoor) ? '<img src="../images/win_icon/blue.png" />' : ''}
			</div>
			<p>
				<strong>${d.hotelDetails.hotelName}</strong>/
				<em>${d.ptdh ? d.ptdh : d.sqdh}</em>/
				<span>${d.orderSource.ptmc ? d.orderSource.ptmc : '微信'}</span>
			</p>
    `);
    
    if(mark == 'page') {
      console.log('看登录的手机号和入住人手机号是否一致',userMsg);
      for(let item of d.ddrzrList) {
        console.log('item',item)
        if(item.lxdh == userMsg.userInfo.mobilephone) { // 是本人
          if(userMsg.userInfo.isIdentityChecked !=1 ) { // 本人未认证
            hasOtherRzrNoverify = true;
            // 显示下一步
          } else if(item.verifyStatus != 4) {
            isSelfAndNoVerify = true; // 本人已认证未核实
            // $("#page footer div").hide().parent().find(".identity").show().text('您可以自助认证身份，办理入住');
          } else {
            // 本人已核实
          }
        } else { // 不是本人
          if(item.verifyStatus != 4) { 
            hasOtherRzrNoverify = true; // 不是本人且未核实
            // 显示下一步 而非自助办理身份，办理认证
          }
        }
      }
    }
    var checkDate;
    if(d.orderType == 1) { // 钟点房
		  checkDate = d.rzrq.replace(/^.+-(..)-(..).*/, '$1' + '月' + '$2' + '日').substring(0,6) + ' ('+d.rzts + '小时)';
    }else { // 全日房
		  checkDate = d.rzrq.replace(/^.+-(..)-(..).*/, '$1' + '月' + '$2' + '日').substring(0,6) + '-' + d.tfrq.replace(/^.+-(..)-(..).*/, '$1' + '月' + '$2' + '日').substring(0,6) + ' ('+d.rzts + '晚)';
    }
		page.find(".order-body").empty().append(`
												<p><span class="room-con"><s>${d.house.mph}</s>房</span> ${d.house.huayuan.hymc + d.house.louceng+'楼 ' + d.house.fangxing}</p>
												<p class="time">${checkDate}</p>
												<p class="status"><i>${d.house.zaocan*1 ? '含早':'无早'}</i>${(d.house.fx?('/'+d.house.fx):'') + (d.house.chuangxing?('/'+d.house.chuangxing):'') + (d.house.rsxz?('/'+d.house.rsxz+'人') :'') + (d.house.fwmj?('/'+d.house.fwmj+'m<sup>2</sup>'):'')}</p>	
											`);

		page.find(".flx").css("background-image", "url(../images/order_state" + (d.orderStatus).replace(/(100)|(910)|(930)/,920).replace(/(911)/,910).replace(/(413)/,411).replace(/(414)/,412).replace(/(431)/,430).replace(/(410)|(440)/,330).replace(/(320)/,310) + ".png);");

		if(Number(d.house.teshe)==0) page.find(".order-left i").removeClass('feature');
		if(d.house.cleanStatus != 4) page.find(".order-left s").removeClass('clean'); //清洁状态(0洁房 1洁疵 2洁未查 3不合格 4脏房)
		if(d.ddrzrList[0] && d.ddrzrList[0].approveStatus == 4) $("#page .page-head .btn-map").css("background-image", "url(../images/btn_map_b.png)").find("s").text($("#demo .location p.locaRight span").text() + 'km');
    // 本人已认证，本人未认证，本人已认证未核实，非本人
		for(var i = 0, j = d.ddrzrList, k = page.find(".info .main_info").empty(); i < j.length; i++) { ///入住人列表名单渲染
      k.append(`<div class="namephone" data-rzrguid=${j[i].rzrGuid}>
						${j[i].lxdh == userMsg.userInfo.mobilephone && userMsg.userInfo.isIdentityChecked == 1 ? j[i].verifyStatus == 4 ? '<s class="yrz"></s>' : '<s></s>' : '' } ${j[i].xm + '  ' + j[i].lxdh}<i></i>
					</div>`);
		}
		if(d.ddrzrList.length < d.house.rsxz) page.find(".info .main_info").append(`<div class="add_name">添加入住人<i></i></div>`); //当前入住人列表小于人数限制,则有添加入住人选项卡

		if(mark == "page") page.find(".tips .tips_info").empty().append(`
												<div class="Amount">
													<span>（${d.rzts + (d.orderType == 1 ?'小时':'晚')}）</span><em>${d.ffyj ? ('¥'+d.ffyj) : ''}</em>${d.ffxj?('¥'+d.ffxj):''}<i></i>
												</div>
												<div class="deposit">
													${d.yj?('¥'+d.yj):''}<i></i>
												</div>
												<div class="addtips">
													<span>（加床、早餐）</span>¥${d.xpje}<i></i>
												</div>
											`);
		if(mark == "lived") page.find(".tips .tips_info").empty().append(`
												<div class="Amount">
													<span>（${d.rzts + (d.orderType == 1 ?'小时':'晚')}）</span><em>${d.ffyj ? ('¥'+d.ffyj) : ''}</em>${d.ffxj?('¥'+d.ffxj):''}<i></i>
												</div>
												<div class="Amount">
													<span>（${d.orderOtherPayList.length}项）</span>¥${d.xpje}<i></i>
												</div>
												<div class="Amount addpay">
													<span>（${d.orderPayList.length}项）</span>¥${d.qtfy}<i></i>
												</div>
												<div class="addtips addpay">
													¥${d.tfcf?d.tfcf.totalMoney:0}<i></i>
												</div>
											`);
		page.find(".sum .tips_info").empty().append(`
												<div class="Amount">
													${( mark == "page" ) ? ('<span>（含押金' + (d.yj?('¥'+d.yj):'') + ')</span>') : ''}${d.zje?('¥'+d.zje):''}<i></i>
												</div>
												<div class="deposit">
													${d.ysk?('¥'+d.ysk):''}<i></i>
												</div>
												<div class="addtips">
													${d.yk?('¥'+Math.abs(d.yk)):'0'}<i></i>
												</div>
											`);

		page.find("footer .left span").text(d.yk ? ('¥' + Math.abs(d.yk)) : '');
		page.find("#ykOryf").text(d.yk > 0 ? '订单余额' : '应付款');
		if(d.yk >= 0) { // 判断余款是否结清，结清才可以入住
			$("#page footer div").hide().parent().find(".identity").show();
		} else { // 未结清，下一步进行付款
			$("#page footer div.identity").hide().siblings().show();
      popMss.find(".poptop span i").text(Math.abs(d.yk));
      return; // 不能往下
    }
    // 首先判断是否是本人，看登录的手机号和入住人手机号是否一致
    if(mark == 'page') { // 未住
      console.log('看登录的手机号和入住人手机号是否一致',userMsg);
      if(isSelfAndNoVerify) { // 本人已认证,未核实
        $("#page footer div").hide().parent().find(".identity").show();
        console.log('本人已认证待核实')
      } else { // 本人未认证或其他人未认证
        $("#page footer div").hide().parent().find(".identity").show().text('下一步').css('text-align','center'); // 按钮居中
        console.log('本人未认证或其他人未认证')
      }
    }

    
	}

	//办理入住说明
	demo.find(".btn-iconTips").onTouchEnd(function() { //办理入住说明
		UIcontroler.toggle_page("iconTips");
	})
	$("#loading").onTouchEnd(function() { //过渡遮罩
		$(this).hide();
	})
	
  lived.find(".btn-back").onTouchEnd( function(){				//已入住返回
    console.log('点击fan')
		window.location.reload();
	})
  // 办理入住，点击下一步
	page.find("footer .identity").onTouchEnd(function() {
		addOrUp = true; //标记当前入住人修改
    // if(!checkRoomOrder()) return false; //检查订单和房间是否符合办理入住
    // 余款尚未结清，应该不显示identify按钮，应该显示下一步，所以这里无需再判断
    console.log('orderDetail', orderDetail);
    // 判断是否是本人
    identifyTips();
  });
  // 已支付完成，yk>=0,可以显示自助核实身份，办理入住的按钮，点击该按钮后续判别
  function identifyTips() {
    if(isSelfAndNoVerify) { // 本人未核实，可以核实
      if(routeDistance > 1) { // 大于1公里，提示
        console.log('可以核实，但大于1公里')
        // 打开提示弹窗
        window.UIcontroler.popUp({
          html: `<p style='color: #000; text-align: center;font-siez:0.8rem;'>目前酒店距您${routeDistance}公里<br>酒店周边1公里内可核实身份</p>`,
          icon: "../images/icon_win/icon_warn.png",
          btns: [{
              text: "取消",
          }, {
              text: "查看位置",
              active: true,
              callback: function(){ // 跳转到地图
                window.location.href = "../map/hotel-map.html?type=1";
              }
          }]
        });
        return; // 不能往下走
      } else { // 可以现在核实
        console.log('可以核实，在1公里内')
      }
    } else {
      if(hasOtherRzrNoverify) { // 本人未认证或还有其他未核实入住人
        // 目前酒店距您100公里，酒店大堂可自助扫描身份证
        console.log('要认证身份')
        window.UIcontroler.popUp({
          html: `<p style='color: #000; text-align: center;font-siez:0.8rem;'>目前酒店距您${routeDistance}公里<br>酒店大堂可自助扫描身份证</p>`,
          icon: "../images/icon_win/icon_warn.png",
          btns: [{
              text: "取消",
          }, {
              text: "查看位置",
              active: true,
              callback: function(){ // 跳转到地图
                window.location.href = "../map/hotel-map.html?type=1";
              }
          }]
        });
        return; // 不能往下走
      } else {
        //入住人已核实，办理入住
        console.log('已核实，可办理入住');
      }
    }
    // 如果手机号码是当前登录号码 

    for(let item of orderDetail.ddrzrList) {
      if(item.lxdh == userMsg.userInfo.mobilephone) {
        idInfo.rzrguid = item.guid; //当前订单人办理入住办理入住
        console.log('点击办理入住')
        ident(item.lxdh,item); //当前订单人办理入住
      }
    }
		
  }

	addman.find("footer .identity").onTouchEnd(function() { //新增的入住人办理
		addOrUp = false;
		var lxdh = $("#addUserPhone").val();

		if(!checkRoomOrder()) return false; //检查订单和房间是否符合办理入住
		ident(lxdh); //新增的入住人办理入住
	})

	//检查是否办理人已入住
	var checkRepeat = function(guid, lxdh, sfz) {
		var repeat = false;

		if(!idInfo.rzrguid) {
			for(var i = 0, j = orderDetail.ddrzrList; i < j.length; i++) {
				if(j[i].lxdh === lxdh) {
					UIcontroler.tipsWin("该电话号码已存在,请更换电话号码", "10");
					return false;
					break;
				}
			}
		}
    if(sfz) {
      $.ajax({
        url: getUrl($.ajaxUrl.checkRepeat),
        type: "POST",
        async: false,
        data: {
          'zbGuid': guid,
          'lxdh': lxdh,
          'sfz': sfz,
          'token': JSON.parse(localStorage.userMsg).token,
          'rzrguid':idInfo.rzrguid
        },
        success: function(res) {
          console.log(res)
          if(!Number(res.result.sfzRepeat) == 1) {
            UIcontroler.tipsWin("该身份证已办理入住，请更换入住人", "10");
            return false;
          }
          if(!Number(res.result.lxdhRepeat) == 1) {
            UIcontroler.tipsWin("该电话号码已办理入住，请更换联系电话", "10");
            return false;
          }
          repeat = true;
  
        }
      });
    }
	

		return repeat;
	}

	//办理入住
	function ident(lxdh,rzrItem) {
		$.post(getUrl($.ajaxUrl.getUserInfoByMobilephone), {
			'token':tokenId,
			'mp': lxdh
		}, function(data) {
			//if( orderDetail && d.approveStatus == 4 ){   // 该号码在系统中有身份信息
			console.log('根据手机号获取入住人身份信息信息',data);
			if(guestAppLiveType == 1 || guestAppLiveType == 0) { //***1根据入住规则 该酒店入住必须前往前台,0录入信息直接入住
				identity.find("nav").addClass("hotelType1").text("温馨提示:请确认所拍证件类型");
				identity.find("bottomtip").empty();
				identity.find(".photo_select").css("margin-bottom", "4rem");
			}

			if(data.retCode == 1 && data.result.approve == 4 && data.result.idcardImg) {
				var res = data.result;
				idInfo.realname = res.realname; //储存办理入住人的个人信息
				idInfo.mobilephone = res.mobilephone;
				idInfo.zhengjianhaoma = res.zhengjianhaoma; //储存办理入住人的个人信息

				//检查是否已办理入住，已办理的入住人拒绝办理
				if(!checkRepeat(singleOrderGuid, res.mobilephone, res.zhengjianhaoma)) return false;

				if(guestAppLiveType == 1 || guestAppLiveType == 0) { //***1根据入住规则 该酒店入住必须前往前台,0直接入住
					identityed.find("nav").remove();
					identityed.find(".tip-title").css("margin-top", "1rem");
				}

				//身份证个人照 照片长地址变成短地址，用于比对
				imageURL[5] = (res.idcardImg ? res.idcardImg : res.trueImg);

				if(!imageURL[5]) { //判断是否有身份证照片
					UIcontroler.tipsWin("该身份信息不全，请更换入住人", "10");
					return false;
        }
        var headPicUpload='';
        // 上传拍照的个人头像
        $.ajax({
          url: uploadUrl,
          type: 'post',
          data: formData,
          contentType: false,
          processData: false,
          success: function(res1){
            headPicUpload = res1.result.headPic;
            console.log('上传后请求回来的头像res1',res1.result.headPic)
          }
        });
				identityed.each(function() {
					var self = $(this);
					var y = res.birthday ? res.birthday.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1') : '  ';
					var m = res.birthday ? res.birthday.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2') : '  ';
					var d = res.birthday ? res.birthday.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3') : '  ';

					var value = `<i style="background-image:url(${res.idcardImg?res.idcardImg:res.trueImg})"></i><p>姓名<span>${res.realname}</span></p>
						<p>性别<span>${res.sex}</span><em>名族</em><span>${res.nationality}</span></p>
						<p>出生<span>${y}<s>年</s>${m}<s>月</s>${d}<s>日</s></span></p>
						<p class="address">住址<span >${res.address}</span></p>
						<p>身份证<span>${res.zhengjianhaoma}</span></p>`;

					self.find(".idOrMRZ").empty().append(value); //动态显示信息
					identitySureed.find(".idOrMRZ").empty().append(value);
					self.find(".midddle").html("入住人手机 <span>" + res.mobilephone + "</span>");
					identitySureed.find(".midddle").html("入住人手机 <span>" + res.mobilephone + "</span>");

					self.find("button.next-skip").onTouchEnd(function() {
						UIcontroler.toggle_page("identity3");
						identity3.find("nav").remove();
						identity3.find(".sec-id-tip span").html(idInfo.realname);

						if(guestAppLiveType == 1 || guestAppLiveType == 0) { //***根据入住规则 该酒店入住必须前往前台

							$.post(getUrl($.ajaxUrl.saveOrUpdate), {
								'token': userMsg.token, //String 前端 登录用户身份令牌
								'guid': idInfo.rzrguid, //String 前端 入住人主键(若为空则认为是新入住人)
								'zbGuid': singleOrderGuid, //String 前端 订单id
								'xm': idInfo.realname, //String 前端 姓名
								'lxdh': idInfo.mobilephone, // String 前端 联系电话
								'sfzxp': imageURL[5] ? imageURL[5] : imageURL[2],
								'approveStatus': '4', // String 前端 1， 已发送认证邀请， 2， 待审核， 3， 审核失败 4， 审核成功  
								'verifyStatus': guestAppLiveType == 0 ? '4' : '2', // String 前端 2， 待核实， 3， 核实失败 4， 核实成功
								'approveType': 'verify' // String 前端 Approve: 认证 verify: 审核
							}, function(data) { //绑定更新个人信息
								if(data.retCode == 1 && guestAppLiveType == 0) { //0已有身份信息 酒店直接入住//1已有身份信息 且 酒店必须前台入住
									UIcontroler.tipsWin("办理中...", "10");

									var tokGuid = data.result.guid;
									//判断对否余款为0，且办理入住完成：rzrs办理完成，或无同入住人,请求订单入住
									if(orderDetail.yk < 0) {
										UIcontroler.tipsWin("请先结清余款", "10")
										UIcontroler.toggle_page("page");
										return;
									}

									$.post(getUrl($.ajaxUrl.checkIn), { ///更改订单状态
										'token':tokenId,
										'guid': singleOrderGuid
									}, function(data) {
										if(data.retCode == 1 && data.result.isAllVerify === '1' && data.result.isBalance === '1' && data.result.isRoomClean === '1') {
											console.log("更改订单状态成功", data);

											$.post(getUrl($.ajaxUrl.updateUserInfo), { ///updateUserInfo
												'token':tokenId,
												'guid': tokGuid,
												'checkPhoneFlag': '1'
											}, function(res) {
												console.log("更新系统会员信息", res);
											}, "json");

										} else {
											UIcontroler.tipsWin(data.msg, "10");
										}

									}, "json");

								}
								if(guestAppLiveType == 1) {
									identity3.find(".sec-id-tip").html("<span>" + idInfo.realname + " </span>身份信息已录入<br>您可前往前台办理入住");
								}

								identity3.find("button.btn-id-tip").onTouchEnd(function() {
									UIcontroler.toggle_page("addman");
								})

								identity3.find("button.btn-id-nexttip").onTouchEnd(function() {
									if(guestAppLiveType == 0) {
										if(singleOrderGuid) { //重新请求数据并渲染
											checkInOrder(singleOrderGuid); //重新请求数据并渲染
										}

										UIcontroler.toggle_page("lived");
										if(orderDetail.isBluetoothDoor == 1) {
											sendTextMsg = "您已办理入住成功！您的房间蓝牙秘钥已绑定，可通过下方“自助入住”——>“手机开门”菜单项打开房间门哦";

											//判断蓝牙是否发送成功
											UIcontroler.toggle_cover("popBluetooth");

											$.post(getUrl($.ajaxUrl.sendBluetooth), {
												'token':tokenId,
												'guid':singleOrderGuid
											}, function(data) {
												console.log('蓝牙发送成功' + data);
											}, 'json')
										} else {
											UIcontroler.toggle_cover("popNoBluetooth");
											sendTextMsg = "您已办理入住成功！您的房间不支持蓝牙开门，您只需携带本人身份证, 前往前台领取门卡就可以入住房间啦！";
										}
									} else if(guestAppLiveType == 1) {
										UIcontroler.toggle_page("page");
									}
								})

              }, 'json');
              // saveOrUpdate 传参更新
              $.post(getUrl($.ajaxUrl.saveOrUpdate), {
                'token': userMsg.token, // String 前端 登录用户身份令牌
                'ddrzr': JSON.stringify({
                  'checkinImg': headPicUpload, // 入住照片
                  'country': res.guoji, 
                  'csId': csId,
                  'csrq': res.birthday, // 身份证出生日期
                  'dz': res.address, // 身份证地址
                  'email': res.email,
                  'firstName': res.firstName,
                  'guid': idInfo.rzrguid, // String 前端 入住人主键(若为空则认为是新入住人)
                  'isnewSj': rzrItem.isnewSj,
                  'lxdh': res.mobilephone,
                  'mz': res.nationality,
                  'operateName': rzrItem.operateName,
                  'operateTime': rzrItem.operateTime,
                  'putStatus': rzrItem.putStatus,
                  'repeatStatus': rzrItem.repeatStatus,
                  'rzrGuid': rzrItem.rzrGuid, // 入住人guid
                  'secondName': res.secondName,
                  'self': true, // 是否本人？
                  'sfmrrzr': rzrItem.sfmrrzr, // 是否默认入住人
                  'sfz': res.zhengjianhaoma,
                  'sfzxp': imageURL[5] ? imageURL[5] : imageURL[2], // 身份证相片
                  'source': '', // 信息来源(0:手动输入,1:手机拍照,2:手机蓝牙扫描,3:PC端系统扫描,4:已认证) 
                  'syncStatus': rzrItem.syncStatus,
                  'type': rzrItem.type,
                  'xb': res.sex,
                  'xm': res.realname,
                  'zbGuid': rzrItem.zbGuid,
                  'zjlx': res.zhengjianleixing
                }) 
              }, function(data){
                if(data.retCode == 1) {
                  UIcontroler.tipsWin("办理中...", "10");
                  console.log('核实的结果,,,', data);
                  var tokGuid = data.result.guid;
                  //判断对否余款为0，且办理入住完成：rzrs办理完成，或无同入住人,请求订单入住
									if(orderDetail.yk < 0) {
										UIcontroler.tipsWin("请先结清余款", "10")
										UIcontroler.toggle_page("page");
										return;
									}

                }
              }, 'json');

						} else {
							UIcontroler.toggle_page("identity2"); //正常流程,已进行身份认证的,跳过上传身份证照片
						}

					});

					self.find("button.prev-skip").onTouchEnd(function() {
						//orderDetail.ddrzrList[0].approveStatus = '2';
						imageURL[5] = ''; //重新认证身份信息的标识，清空身份证头像
						UIcontroler.toggle_page("identity"); //已进行身份认证的,重新认证修改信息
					})
				})

				UIcontroler.toggle_page("identityed");
			} else {
				//检查是否已办理入住，已办理的入住人拒绝办理
				if(!checkRepeat(singleOrderGuid, lxdh)) return false;

				UIcontroler.toggle_page("identity");
			}

		}, 'json')
	}

	//检查订单和房间是否符合办理入住
	function checkRoomOrder() {
		if(!orderDetail || !(orderDetail.orderStatus === '120' || orderDetail.orderStatus === '110')) { //判断订单是否符合要求
			UIcontroler.tipsWin("该订单状态不满足办理入住要求", "10");
			return false;
		}
		if(orderDetail.house.cleanStatus == '4') { //判断房间是否符合要求 判断余款是否结清
			UIcontroler.tipsWin("该房间为脏房，请更换房间", "10");
			return false;
		}
		if(orderDetail.yk < 0) { // 判断余款是否结清
			UIcontroler.tipsWin("余款尚未结清", "10");
			return false;
		}

		return true;

	}

	//新增入住人，入住人列表更新
	function addRZR(name, phoneNum, rzrguid) {
		$.post(getUrl($.ajaxUrl.saveOrUpdate), {
			// 'token': userMsg.token, //String 前端 登录用户身份令牌
			// 'guid': rzrguid ? rzrguid : '', //String 前端 入住人主键(若为空则认为是新入住人)
			// 'zbGuid': singleOrderGuid, //String 前端 订单id
			// 'xm': name,
			// 'type': 1, //int 前端 1 境内2境外
			// 'lxdh': phoneNum,
      // 'source': '4', // String 前端 来源
      // 'csId': orderDetail.csId // 新增csId用于保存
      'token': userMsg.token, //String 前端 登录用户身份令牌
      'ddrzr': JSON.stringify({
        'lxdh': phoneNum, 
        'self': false,
        'source': 0, // 0,手动输入，1手机拍照，2：手机蓝牙扫描，3：PC系统扫描，4已认证
        'xm': name,
        'zbGuid': singleOrderGuid, //String 前端 订单id
        'guid': rzrguid ? rzrguid : '', //String 前端 入住人主键(若为空则认为是新入住人)
        'csId': orderDetail.csId
      })
    }, function(data) { //绑定更新个人信息
      console.log('data',data)
      console.log('修改成功')
      var data1 = JSON.parse(data)
      console.log('data.retCode',data1)
			if(data1.retCode == 1) {
        console.log('是否进来更新数据')
				$.post(getUrl($.ajaxUrl.getorderdetail), {
					"token": userMsg.token,
					"ddguid": singleOrderGuid
				}, function(data) {
          // 返回上一页
					console.log('新增成功后更新数据', data);
					var d = data.result;
					orderDetail = d;
					loadDetail("lived", d); //渲染已入住section
          loadDetail("page", d); //渲染已订房section
          UIcontroler.toggle_page();
          sessionStorage.setItem('isAddRZRSuccess', 1) // 添加入住人成功,回到demo刷新数据
				}, 'json');

			}
		})
	}

	identity.find("button.next").onTouchEnd(function() { //身份证件拍照入口
		myPhoto('photo', 'fileId'); //传入下一页面pageID和fileID;
	})

	//证件照
	self.find("button.photo_select").onTouchEnd(function() { //证件照类型选择确认
		UIcontroler.toggle_cover("id_type");
		cover.find('#id_type ul.id_type_main li').onTouchEnd(function() {
			$(this).addClass('on').siblings().removeClass('on')
		});
		cover.find('#id_type .id_type_bottom button').onTouchEnd(function() {
			if($(this).hasClass('subIdType')) {
				var val = cover.find('#id_type ul.id_type_main li.on').text();
				photo.find("nav button.photo_select").text(val);
				identity.find("button.photo_select").text(val);
			}
			UIcontroler.toggle_cover("");
		})
	})

	photo.find("button.makesure").onTouchEnd(function() { //证件照拍照确认
		var typeCard = photo.find("nav button.photo_select").text();
		var base64 = photo.find(".photo-selfie img.selfie").attr("src").replace("data:image/jpeg;base64,", '');

		$("#loading").show(); //loading 打开,
		//证件上传安卓平板解析提取数据
		$.post(HOST_URL + "/passport/filebase64", {
			"key": getCardType(typeCard), //传选择证件对应的编码
			"file": base64
		}, function(data) {
			if(data.retCode == 1) {

				console.log(data);
				var icardInfo = data;

				//请求识别的证件ORC信息
				$.post(HOST_URL + "/passport/string", {
					"fileName": icardInfo.result
				}, function(res) {
					if(res.retCode == 1) {

						var info = res.result.split(','),
							infoObj = {};
						for(var i = 0; i < info.length; i++) {
							info[i] = info[i].split(':');
							infoObj[info[i][0]] = info[i][1]
						}

						if(typeCard === '二代身份证') {
							identitySure.find("table tbody").empty().append(`
														<tr><td>持证人手机</td><td><img src="" alt="" /></td></tr>
														<tr><td class="four"><input class="guest_phone" type="text" name="guest_phone" maxlength="11" placeholder="请输入您的手机号码"
															value=${addOrUp ? orderDetail.ddrzrList[0].lxdh : addusername.parent().next().find("#addUserPhone").val()} /><i></i></td></tr>
														<tr><td class="one">姓名</td><td class="two">名族</td></tr>
														<tr>
															<td class="one"><input type="text" name="guest_name" id="" placeholder="请输入您的姓名" value=${infoObj["姓名"]} /></td>
															<td class="two" style="border-left: 0 none;"><input type="text" name="guest_nation" placeholder="请输入名族" id="" value=${infoObj["民族"]} /></td>
														</tr>
														<tr>
															<td class="one"><pre>出生年     月       日</pre></td>
															<td class="two">性别</td>
														</tr>
														<tr>
															<td class="one"><input type="text" name="guest_birth" id=""placeholder="请输入您的出生日期 用-隔开" value="${infoObj["出生"]}" /></td>
															<td class="two guest_sex" style="border-left: 0 none; border-right: 0 none;">
																	<label>
																		<span class="opt-text">男</span>
																		<s class="man ${infoObj["性别"]=="男"?"active":""}"></s>
																	</label>
															</td>
															<td class="two guest_sex" style="border-left: 0 none;">
																	<label>
																		<span class="opt-text">女</span>
																		<s class="${infoObj["性别"]=="男"?"":"active"}"></s>
																	</label>
															</td>
														</tr>
														<tr><td>公民身份证号码</td></tr>
														<tr>
															<td class="the idcard"><input type="text" name="guest_idcard" id="" value=${infoObj["公民身份号码"]?infoObj["公民身份号码"]:""} placeholder="请输入您的身份证号码" maxlength="18"/></td>
														</tr>
														<tr><td>地址</td></tr>
														<tr>
															<td class="the"><input type="text" name="guest_address" id="" value=${infoObj["住址"]?infoObj["住址"]:""} placeholder="请输入您的户籍地址"/></td>
														</tr>
													`);

						} else if(getCardType(typeCard) == "13") {
							$("#identitySure input[name^='guest_phone']").val(addOrUp ? orderDetail.ddrzrList[0].lxdh : addusername.parent().next().find("#addUserPhone").val());
							identitySure.each(function() {
								var self = $(this);
								self.find("input[name^='guest_name']").val(infoObj["本国姓名"]);
								self.find("input[name^='guest_idcard']").val(infoObj["护照号码"]);
								self.find("input[name^='guest_enName']").val(infoObj["英文姓名"]);
								self.find("input[name^='guest_ensex']").val(infoObj["性别"]);
								self.find("input[name^='guest_birth']").val(infoObj["出生日期"]);

							});
						}

						UIcontroler.toggle_page("identitySure"); //跳审核身份

						typeIdentitySure(); //identitySure给身份提交页面注册事件

						//请求识别的证件头像信息
						$.post(HOST_URL + "/passport/download", {
							"path": icardInfo.headerUrl
						}, function(para) {
							if(para.retCode == 1) {
								console.warn(para.msg);

								var baseJpeg = para.result;
								identitySure.find("td img").attr("src", "data:image/jpeg;base64," + para.result);
								baseJpeg = baseJpeg.replace(/%2B/g, "+");

								//提交证件上的一寸图片 表单提交
								$.post($.ajaxUrl.getFileUploadUrl, {}, function(res) {
									if(res.retCode == 1) {
										var formData = new FormData();
										//convertBase64UrlToBlob函数是将base64编码转换为Blob  
										formData.append("headPic", convertBase64UrlToBlob(baseJpeg), new Date().getMilliseconds() + String(Math.random()).substr(5, 9) + '.jpg');
										formData.append("csId", csid);
										formData.append("subPath", 'idcard-images');
										formData.append("idCard", infoObj["公民身份号码"]);

										$.ajax({
											url: res.result.fileUploadUrl,
											type: "POST",
											data: formData,
											processData: false, // 告诉jQuery不要去处理发送的数据  
											contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
											beforeSend: function() {
												console.log("正在进行，请稍候");
											},
											success: function(data) {
												alert("上传成功");
												imageURL[0] = "data:image/jpeg;base64," + baseJpeg;
												imageURL[2] = data.result[0].headPic;
												$("#loading").hide(); //loading 关闭,
												UIcontroler.tipsWin(data.msg, "10");
											},
											error: function(responseStr) {
												console.log("error");
											}
										});
									} else {
										$("#loading").hide(); //loading 关闭,
										UIcontroler.tipsWin(res.msg, "10");
									}
								})

							}
						}, 'json');

					} else {
						UIcontroler.tipsWin(res.msg, "10");
						$("#loading").hide(); //loading 关闭,
					}
				}, 'json');

				//	等待期间渲染个人信息数据
				identitySure.find("img.ident").attr("src", "data:image/jpeg;base64," + base64);
				$("#identitySure input[name^='guest_name']").val(addOrUp ? orderDetail.ddrzrList[0].xm : addusername.val());

			}

		}, 'json');

	})

	//身份确认页面：无身份信息
	function typeIdentitySure() {

		identitySure.each(function() {

			var typeCard = photo.find("nav button.photo_select").text() === "二代身份证";
			var self = $(this),
				guest_phone = self.find("input[name^='guest_phone']"),
				guest_name = self.find("input[name^='guest_name']"),
				guest_birth = self.find("input[name^='guest_birth']"),
				guest_idcard = self.find("input[name^='guest_idcard']"),
				guest_address = self.find("input[name^='guest_address']");
			if(typeCard) {
				var guest_nation = self.find("input[name^='guest_nation']"),
					guest_sex = self.find("td.guest_sex label s.active").hasClass('man') ? '男' : '女';

				self.find("td.guest_sex").onTouchEnd(function() { //二代身份证性别
					$(this).parent().find("label s").removeClass("active");
					$(this).find("label s").addClass("active");
				});
			} else {
				guest_sex = self.find("input[name^='guest_sex']");

			}

			self.find("table td.four i").onTouchEnd(function() {
				guest_phone.val('');
			});

			self.find("td.num_type_ph").onTouchEnd(function() {
				$(this).addClass('on').siblings().removeClass('on');
				if(this.dataset.in == 1) {
					self.find('#guest_phone_type').html('<td class="four"><input class="guest_phone" type="text" name="guest_phone" maxlength="11" value="13800138138" placeholder="请输入您的手机号码"/><i></i></td>')
				} else {
					self.find('#guest_phone_type').html('<td class="two"><input class="guest_phone" type="text" name="guest_phone_1" maxlength="11" value="" placeholder="区号"/><i></i></td><td class="one" style="border-left: 0 none;"><input type="text" name="guest_phone_2" placeholder="输入手机号码"/></td>')
					setTimeout(function() {
						self.find("table td.four i").onTouchEnd(function() {
							guest_phone.val('');
						});
					}, 200)
				}
			})

			self.find("header .btn-reset").onTouchEnd(function() {
				//直接重拍
				UIcontroler.toggle_page();
				UIcontroler.toggle_page();
				myPhoto('photo', 'fileId');
			});

			self.find("button.next").onTouchEnd(function() {

				idInfo.realname = guest_name.val(); //储存办理入住人的个人信息
				idInfo.mobilephone = guest_phone.val();
				idInfo.zhengjianhaoma = guest_idcard.val(); //储存办理入住人的个人信息

				var param = {
					'token': userMsg.token, //String 前端 登录用户身份令牌
					'guid': idInfo.rzrguid, //String 前端 入住人主键(若为空则认为是新入住人)
					'zbGuid': singleOrderGuid, //String 前端 订单id
					'rzrGuid': userMsg.userInfo.id, // 前端 会员id
					'xm': guest_name.val(), //String 前端 姓名
					'lxdh': guest_phone.val(), // String 前端 联系电话
					'sfz': guest_idcard.val(), // String 前端 身份证
					'zjlx': typeCard ? '11' : '', // String 前端 证件类型
					'xb': typeCard ? self.find("td.guest_sex label s.active").hasClass('man') ? '男' : '女' : guest_sex.val(), // String 前端 性别
					'csrq': guest_birth.val(), // Date 前端 出生日期
					'sfzxp': imageURL[2], // String 前端 身份证相片
					'dz': guest_address.val(), // String 前端 地址
					'mz': typeCard ? guest_nation.val() : '', // String 前端 民族
					'csId': csid, // String 前端 酒店id
					'type': 1, // int 前端 1 境内2境外
					'country': 'CHN', // String 国家
					'email': userMsg.userInfo.email, // String 前端 邮箱
					'source': 4, //userMsg.userInfo.source,    // String 前端 来源
					/*'checkinImg' : imageURL[3],							 // int 前端 入住照片
					'verifyImg' : imageURL[3],	   		  					 // String 前端 核实相片imageURL[2]*/
					'approveStatus': '4', // String 前端 1， 已发送认证邀请， 2， 待审核， 3， 审核失败 4， 审核成功  
					'verifyStatus': guestAppLiveType == 0 ? '4' : '2', // String 前端 2， 待核实， 3， 核实失败 4， 核实成功
					'approveType': 'Approve' // String 前端 Approve: 认证 verify: 审核
				};
				console.log(param);
				$.post(getUrl($.ajaxUrl.saveOrUpdate), param, function(data) { //绑定更新个人信息
					console.log(data);

					if(data.retCode == 1) {
						UIcontroler.tipsWin("身份信息提交成功", "10")
						idInfo.rzrguid = data.result.guid;
						var tokGuid = data.result.guid;

						if(guestAppLiveType == 0) { //***根据入住规则 该酒店入住无需自拍比对

							//判断对否余款为0，且办理入住完成：rzrs办理完成，或无同入住人,请求订单入住
							if(orderDetail.yk < 0) {
								UIcontroler.tipsWin("请先结清余款", "10")
								UIcontroler.toggle_page("page");
								return;
							}
							$.post(getUrl($.ajaxUrl.checkIn), { ///更改订单状态
								'token':tokenId,
								'guid': singleOrderGuid
							}, function(data) {

								if(data.retCode == 1 && data.result.isAllVerify === '1' && data.result.isBalance === '1' && data.result.isRoomClean === '1') {
									console.log("更改订单状态成功", data);

									UIcontroler.toggle_page("identity3");
									identity3.find(".sec-id-tip span").html(guest_name.val());
									$.post(getUrl($.ajaxUrl.updateUserInfo), { ///updateUserInfo
										'token':tokenId,
										'guid': tokGuid,
										'checkPhoneFlag': '1'
									}, function(res) {

										console.log("更新系统会员信息", res);

										identity3.find("button.btn-id-nexttip").onTouchEnd(function() {

											if(singleOrderGuid) { //重新请求数据并渲染
												checkInOrder(singleOrderGuid); //重新请求数据并渲染
											}

											UIcontroler.toggle_page("lived");
											if(orderDetail.isBluetoothDoor == 1) {
												sendTextMsg = "您已办理入住成功！您的房间蓝牙秘钥已绑定，可通过下方“自助入住”——>“手机开门”菜单项打开房间门哦";

												//判断蓝牙是否发送成功
												UIcontroler.toggle_cover("popBluetooth");

												$.post(getUrl($.ajaxUrl.sendBluetooth), {
													'token':tokenId,
													'guid':singleOrderGuid
												}, function(data) {
													console.log('蓝牙发送成功' + data);
												}, 'json')
											} else {
												UIcontroler.toggle_cover("popNoBluetooth");
												sendTextMsg = "您已办理入住成功！您的房间不支持蓝牙开门，您只需携带本人身份证, 前往前台领取门卡就可以入住房间啦！";
											}
										});

									}, "json");

								} else {

									UIcontroler.tipsWin(data.msg, "10");
								}

							}, "json");
						}
						if(guestAppLiveType == 1 || guestAppLiveType == 0) { //***根据入住规则 该酒店入住必须前往前台
							identity3.find("nav").remove();

							if(guestAppLiveType == 1) {
								identity3.find(".sec-id-tip").html("<span>" + guest_name.val() + " </span>身份信息已录入<br>您可前往前台办理入住");
								UIcontroler.toggle_page("identity3");

								identity3.find("button.btn-id-nexttip").onTouchEnd(function() {
									UIcontroler.toggle_page("page");
								});
							}
							identity3.find("button.btn-id-tip").onTouchEnd(function() {
								UIcontroler.toggle_page("addman");
							})
						} else {
							UIcontroler.toggle_page("identity2"); //已通过身份认证的,跳转自拍头像
						}

					} else {
						UIcontroler.tipsWin(data.msg, "10")
					}
				}, 'json');

			});

		})
	}

	//入住人身份认证成功identity3 渲染;
	function identity3Ready() {
		var selfRea = identity3.find(".foot-id-btn");
		var maintip = identity3.find(".maintip");
		var rzrName = maintip.find(".sec-id-tip span");

		if(orderDetail) var d = orderDetail.ddrzrList[0];
		if(addOrUp && orderDetail && d.approveStatus == 4) {
			rzrName.text(d.xm);
			if(idInfo) rzrName.text(idInfo.name);
		} else {
			rzrName.text($("#identitySure input[name^='guest_name']").val());
		}

		maintip.find(".last-id-tip s").text(orderDetail.house.rsxz);
		maintip.find(".last-id-tip i").text(orderDetail.house.rsxz - orderDetail.rzrs);

		if(!addOrUp) orderDetail.rzrs += 1;
		if(orderDetail.house.rsxz == orderDetail.rzrs) selfRea.find("button.btn-id-tip").hide();

		selfRea.find("button.btn-id-nexttip").onTouchEnd(function() { //无同房入住人

			if(singleOrderGuid) { //重新请求数据并渲染
				checkInOrder(singleOrderGuid); //重新请求数据并渲染
			}

			UIcontroler.toggle_page("lived");

			if(orderDetail.isBluetoothDoor == 1) {
				sendTextMsg = "您已办理入住成功！您的房间蓝牙秘钥已绑定，可通过下方“自助入住”——>“手机开门”菜单项打开房间门哦";

				//判断蓝牙是否发送成功
				UIcontroler.toggle_cover("popBluetooth");

				$.post(getUrl($.ajaxUrl.sendBluetooth), {
					'token':tokenId,
					'guid':singleOrderGuid
				}, function(data) {
					console.log('蓝牙发送成功' + data);
				}, 'json')
			} else {
				UIcontroler.toggle_cover("popNoBluetooth");
				sendTextMsg = "您已办理入住成功！您的房间不支持蓝牙开门，您只需携带本人身份证, 前往前台领取门卡就可以入住房间啦！";
			}

		})
		selfRea.find("button.btn-id-tip").onTouchEnd(function() {
			UIcontroler.toggle_page("addman");
		})
	}

	//支付弹窗显示
	page.find("footer .right").onTouchEnd(function() {
		UIcontroler.toggle_cover("popMss");
  });
  // 前台支付
  popMss.find(".nowpay").onTouchEnd(function(){
    // 流程往下走
    console.log('点击前台支付')
    // page.find("footer div").hide().parent().find(".identity").show();
    UIcontroler.toggle_cover();
    // 执行身份验证提示
    setTimeout(function(){
      identifyTips();
    },300);

  });
  //暂不支付
	popMss.find(".btn-cancel").onTouchEnd(function() {
		UIcontroler.toggle_cover();
	});
  //点击微信支付
	popMss.find(".wxpay").onTouchEnd(function() {
		wx.chooseWXPay({
			timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			nonceStr: '', // 支付签名随机串，不长于 32 位
			package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			signType: 'SHA1', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			paySign: '', // 支付签名
			success: function(res) {
				// 支付成功后的回调函数
			}
		});
	});

	cover.find(".close").onTouchEnd(function() {
		UIcontroler.toggle_cover();
	});

	//发送办理成功信息，同时关闭网页，回到公众号
	cover.find(".wxClose").onTouchEnd(function() {
		UIcontroler.tipsWin(sendTextMsg, 10);
		//location.href = "/hotel-interface-zkt/msg/wechat/sendTextMsg?msg=" + sendTextMsg;
		setTimeout(function() {
			wx.closeWindow();
		}, 2000);
	})

	//已认证的客人核实对比照片
	identitySureed.find("button.next").onTouchEnd(function() {
		identitySureed.find(".poplet").show();

		$.post($.ajaxUrl.saveOrUpdate, {
			'token': userMsg.token, //String 前端 登录用户身份令牌
			'guid': idInfo.rzrguid, //String 前端 入住人主键(若为空则认为是新入住人)
			'zbGuid': singleOrderGuid, //String 前端 订单id
			'xm': idInfo.realname, //String 前端 姓名
			'lxdh': idInfo.mobilephone, // String 前端 联系电话
			'sfzxp': imageURL[5] ? imageURL[5] : imageURL[2],
			'checkinImg': imageURL[3], // int 前端 入住照片
			'verifyImg': imageURL[3], // String 前端 核实相片imageURL[2]
			'approveStatus': '4', // String 前端 1， 已发送认证邀请， 2， 待审核， 3， 审核失败 4， 审核成功  
			'verifyStatus': '2', // String 前端 2， 待核实， 3， 核实失败 4， 核实成功
			'approveType': 'verify' // String 前端 Approve: 认证 verify: 审核
		}, function(data) { //绑定更新个人信息
			console.log(data);

			if(data.retCode == 1) {

				var tokGuid = data.result.guid;
				$.post(getUrl($.ajaxUrl.compareTwoPhotobyGuid), {
					'token':tokenId,
					'guid': tokGuid
				}, function(res) { //照片核对
					var score = res.result.score;
					if(res.result.isPass) { //身份核对成功

						identitySureed.find(".poplet").hide();
						//判断对否余款为0，且办理入住完成：rzrs办理完成，或无同入住人,请求订单入住
						if(orderDetail.yk < 0) {
							UIcontroler.tipsWin("请先结清余款", "10")
							UIcontroler.toggle_page("page");
							return;
						}

						$.post(getUrl($.ajaxUrl.checkIn), { ///更改订单状态
							'token':tokenId,
							'guid': singleOrderGuid
						}, function(data) {

							if(data.retCode == 1 && data.result.isAllVerify === '1' && data.result.isBalance === '1' && data.result.isRoomClean === '1') {
								console.log("更改订单状态成功", data);

								identity3Ready();

								$.post(getUrl($.ajaxUrl.updateUserInfo), { ///updateUserInfo
									'token':tokenId,
									'guid': tokGuid,
									'checkPhoneFlag': '1'
								}, function(res) {

									console.log("更新系统会员信息", res);
									UIcontroler.toggle_page("identity3");
									UIcontroler.tipsWin("身份核对通过，分数为" + score, "10");

									UIcontroler.toggle_page("identity3");

								}, "json");

							} else {

								UIcontroler.tipsWin(data.msg, "10");
							}

						}, "json");

					} else {

						UIcontroler.tipsWin("比对未通过,分数为：" + score, "10");
						UIcontroler.toggle_page("identity4"); //身份核对失败
						identity4.find("button.btn-id-tip").onTouchEnd(function() {
							UIcontroler.toggle_page("identity2");
						})
						identity4.find("button.btn-id-nexttip").onTouchEnd(function() {
							window.location.reload();
						})
					}

					identitySureed.find(".poplet").hide();

				}, 'json');
			}

		}, 'json');
	})

	identity2.find("button.next").onTouchEnd(function() { //自拍头像拍照入口
		myPhoto('photo1', 'fileStyle');
	})

	photo1.find("button.makesure").onTouchEnd(function() { //自拍照确认
		identitySureed.find(".poplet").show();
		$.post($.ajaxUrl.saveOrUpdate, {
			'token': userMsg.token, //String 前端 登录用户身份令牌
			'guid': idInfo.rzrguid, //String 前端 入住人主键(若为空则认为是新入住人)
			'zbGuid': singleOrderGuid, //String 前端 订单id
			'xm': idInfo.realname, //String 前端 姓名
			'lxdh': idInfo.mobilephone, // String 前端 联系电话
			'sfzxp': imageURL[5] ? imageURL[5] : imageURL[2],
			'checkinImg': imageURL[3], // int 前端 入住照片
			'verifyImg': imageURL[3], // String 前端 核实相片imageURL[2]
			'approveStatus': '4', // String 前端 1， 已发送认证邀请， 2， 待审核， 3， 审核失败 4， 审核成功  
			'verifyStatus': '2', // String 前端 2， 待核实， 3， 核实失败 4， 核实成功
			'approveType': 'verify' // String 前端 Approve: 认证 verify: 审核
		}, function(data) { //绑定更新个人信息
			console.log(data);
			if(data.retCode == 1) {
				var tokGuid = data.result.guid;
				$.post(getUrl($.ajaxUrl.compareTwoPhotobyGuid), {
					'token':tokenId,
					'guid': tokGuid
				}, function(res) { //照片核对
					var score = res.result.score;
					if(res.result.isPass) { //身份核对成功

						identitySureed.find(".poplet").hide();
						//判断对否余款为0，且办理入住完成：rzrs办理完成，或无同入住人,请求订单入住
						if(orderDetail.yk < 0) {
							UIcontroler.tipsWin("请先结清余款", "10")
							UIcontroler.toggle_page("page");
							return;
						}

						$.post(getUrl($.ajaxUrl.checkIn), { ///更改订单状态
							'token':tokenId,
							'guid': singleOrderGuid
						}, function(data) {

							if(data.retCode == 1 && data.result.isAllVerify === '1' && data.result.isBalance === '1' && data.result.isRoomClean === '1') {
								console.log("更改订单状态成功", data);

								identity3Ready();

								$.post(getUrl($.ajaxUrl.updateUserInfo), { ///updateUserInfo
									'token':tokenId,
									'guid': tokGuid,
									'checkPhoneFlag': '1'
								}, function(res) {

									console.log("更新系统会员信息", res);
									UIcontroler.toggle_page("identity3");
									UIcontroler.tipsWin("身份核对通过，分数为" + score, "10");

									UIcontroler.toggle_page("identity3");

								}, "json");

							} else {

								UIcontroler.tipsWin(data.msg, "10");
							}

						}, "json");

					} else {

						UIcontroler.tipsWin("比对未通过,分数为：" + score, "10");
						UIcontroler.toggle_page("identity4"); //身份核对失败
						identity4.find("button.btn-id-tip").onTouchEnd(function() {
							UIcontroler.toggle_page("identity2");
						})
						identity4.find("button.btn-id-nexttip").onTouchEnd(function() {
							window.location.reload();
						})
					}

					identitySureed.find(".poplet").hide();
				}, 'json');
			} else {
				UIcontroler.tipsWin(data.msg, "10")
			}
		}, 'json');
	})

	//拍照处理封装
	function myPhoto(page, file) {
    console.log('身份证封装')
		var fileId = $("#" + file),
			url = '';
		var Orientation = null;
		$("#loading").show(); //loading 打开,

		fileId.val('').trigger('click');
		fileId.off("change").change(function() {

			var fileObj = $(this)[0],
				windowURL = window.URL || window.webkitURL,
				dataURL;

			if(fileObj && fileObj.files && fileObj.files[0]) {
				dataURL = windowURL.createObjectURL(fileObj.files[0]);
				url = dataURL;
			} else {
				url = $(this).val();
			}

			/****H5获取图片方向和旋转****/
			var fileImg = $(this)[0].files['0'];
			//获取照片方向角属性，用户旋转控制 

			EXIF.getData(fileImg, function() {       // alert(EXIF.pretty(this)); 
				      
				//EXIF.getAllTags(this);        //alert(EXIF.getTag(this, 'Orientation'));  
				      
				Orientation = EXIF.getTag(this, 'Orientation');       //return; 
				    
			});  

			if(!fileImg) {
				$("#loading").hide(); //loading 关闭,
				UIcontroler.tipsWin("未获取到图片信息", "10");
				return false;
			}

			if(fileImg.size > 5242880) {
				$("#loading").hide(); //loading 关闭,
				UIcontroler.tipsWin("上传图片应小于5M", "10");
				return false;
			}

			if(!/image\/jpeg/.test(fileImg.type)) {
				$("#loading").hide(); //loading 关闭,
				UIcontroler.tipsWin("文件必须为图片的jpg格式！", "10");
				return false;
			}

			/****H5获取二进制图片信息****/
			var reader = new FileReader();
			reader.onload = function(e) {
				createCanvas(this.result);
			}

			reader.readAsDataURL(fileImg);
		});

		/****canvas重画压缩****/
		function createCanvas(src) {
      console.log('canvas重画')
			var imageCxt = new Image();
			imageCxt.src = src;

			imageCxt.onload = function() {

				var imgWidth = this.width,
					imgHeight = this.height,
					w = file === 'fileId' ? 720 : 576,
					h = file === 'fileId' ? 480 : 640;
				// 控制上传图片的宽高
				if(imgWidth > imgHeight && imgWidth > w) {
					imgWidth = w;
					imgHeight = Math.ceil(w * this.height / this.width);
				} else if(imgWidth < imgHeight && imgHeight > h) {
					imgWidth = Math.ceil(h * this.width / this.height);
					imgHeight = h;
				}

				var canvas = document.createElement("canvas"),
					ctx = canvas.getContext('2d');
				canvas.width = imgWidth;
				canvas.height = imgHeight;

				if(Orientation && Orientation != 1) {

					switch(Orientation) {
						case 6: // 旋转90度
							if(file === 'fileId' && imgWidth > imgHeight) {
								ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
								break;
							}
							canvas.width = imgHeight;
							canvas.height = imgWidth;
							ctx.rotate(Math.PI / 2);
							ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight);
							break;
						case 3: // 旋转180度
							//alert( Orientation );   //当前拍摄角度
							ctx.rotate(Math.PI);
							ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight);
							break;
						case 8: // 旋转-90度
							//alert( Orientation );   //当前拍摄角度
							canvas.width = imgHeight;
							canvas.height = imgWidth;
							ctx.rotate(3 * Math.PI / 2);
							ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight);
							break;
					}
				} else {
					ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
				}

				var base64 = canvas.toDataURL("image/jpeg", 0.8).split(',')[1];
				$("#" + page + " .photo-selfie img.selfie").attr("src", "data:image/jpeg;base64," + base64);
        console.log('提交自拍照片')
				if(file !== 'fileId') { //提交自拍图片	
					//提交证件上的一寸图片 表单提交
					$.post($.ajaxUrl.getFileUploadUrl, {}, function(res) {
						if(res.retCode == 1) {
							var formData = new FormData();
							//convertBase64UrlToBlob函数是将base64编码转换为Blob  
							formData.append("headPic", convertBase64UrlToBlob(base64), new Date().getMilliseconds() + String(Math.random()).substr(5, 9) + '.jpg');
							formData.append("csId", csid);
							formData.append("subPath", 'personal-photos');
							//formData.append("idCard", infoObj["公民身份号码"]);

							$.ajax({
								url: res.result.fileUploadUrl,
								type: "POST",
								data: formData,
								processData: false, // 告诉jQuery不要去处理发送的数据  
								contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
								beforeSend: function() {
									console.log("正在进行，请稍候");
								},
								success: function(data) {
									if(data.retCode == 1) {
										alert("上传成功");
										photo1.find("button.makesure").show();
										imageURL[1] = "data:image/jpeg;base64," + base64;
										imageURL[3] = data.result[0].headPic;
									} else {
										UIcontroler.tipsWin(data.msg, "10");
									}
								},
								error: function(responseStr) {
									console.log("error");
								}
							});
						} else {
							$("#loading").hide(); //loading 关闭,
							UIcontroler.tipsWin(res.msg, "10");
						}
					})

				}

				$("#loading").hide(); //loading 关闭,
				UIcontroler.toggle_page(page);
			}
		}
  }

      //在当前页，点击微信返回按钮，应关闭当前页而不是去到之前去过的页面
      pushHistory();
      var bool = false;
      setTimeout(function(){
        bool = true;
      },1500);
      window.addEventListener('popstate', function(e){
        // if(bool) {
          var referrer = document.referrer;
          if(referrer.indexOf("payout.html") > -1 || isFromPayoutPage) { // 从支付结果跳转过来
            routeArr.push(window.location.href); // 传如当前url
            sessionStorage.setItem("routeArr",JSON.stringify(routeArr));
            location.href = csId ? ("check-room.html?hotelCode=" + csId) : "check-room.html";
          }
          // if(referrer.indexOf('payout.html') > -1) { // 上一个页面
          //   wx.closeWindow();
          // }
        // }
      });
      function pushHistory() {
        var state = {
          title: null,
          url: window.location.href

        };
        var referrer = document.referrer;
        if(referrer.indexOf('payout.html') > -1 || isFromPayoutPage) {
          console.log('state.url',state.url)
          window.history.pushState(state, state.title, state.url); // 返回到首页
        }
        
      }
})

function getCardType(v) {
	var listId = {
		"国内护照": "13",
		"国外护照": "13",
		"二代身份证": "2",
		"驾驶证": "5",
		"台胞证": "10",
		"新版台胞证": "25",
		"返乡证": "14",
		"港澳通行证": "9",
		"新版港澳通行证": "22",
		"香港身份证": "1001",
		"澳门身份证": "1005",
		"台湾身份证": "1031",
	};
	for(var key in listId) {
		if(key === v) {
			return listId[key]
		}
	}
}

//base64 转 blob
function convertBase64UrlToBlob(urlData) {

	var bytes = window.atob(urlData);

	//处理异常,将ascii码小于0的转换为大于0  
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for(var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}

	return new Blob([ab], {
		type: 'image/jpg'
  });
  
  // 

}
