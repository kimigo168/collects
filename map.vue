<template>
  <div id="hotelAroundMap">
    <transition name="fade">
      <div v-show="$route.name=='hotelAroundMap'" style="width:100%;height:100%"> 
        <div class="mainSide bgColor4">
          <!-- banner -->
          <div class="banner bannerMap">
            <div class="btnModel btnBack" @click="$router.go(-1)">返回</div>
            <!-- 页面头部 中间部分 -->
            <span class="title">{{destinationData?destinationData.address:''}}</span>
          </div>
          <!-- banner end -->
          <div class="content">
            <!-- 交通方式切换 -->
            <ul class="trafficMethodTab">
              <li class="btnItem" v-for="(item, index) in btnList" :key="index" @click="selectMethod(index)"><img :src="'/static/button/'+item.src" alt=""></li>
            </ul>
            <!-- 地图 -->
            <div class="mapWrapper">
              <div id="mapContainer"></div>
              <div id="panel" v-show="isShowPanel"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import AMap from 'AMap'; 
export default {
  name: 'hotelAroundMap', // 交通信息，酒店周边跳转的页面
  data() {
    return{
      hotelInfo: {}, // 酒店信息
      destinationData: {}, // 终点处对象
      btnList:[{// 交通方式切换
        src: 'map_icon_car02.png',
        active: true
      },{
        src: 'map_icon_car04.png',
        active: false
      },{
        src: 'map_icon_car08.png',
        active: false
      },{
        src:'map_icon_car06.png',
        active: false
      }],
      selectTypeIndex: 0, // 默认选中的交通方式
      startPos: '', // 起点
      endPos: '' ,// 终点
      start: [],
      end: [],
      isShowPanel: true // 是否显示结果面板
    }
  },
  methods:{
    // 选中的方式
    selectMethod(index) {
      this.selectTypeIndex = index;
      this.btnList.map((item,idx) => { // 取消所有选中
        this.btnList[idx].active = false;
      });
      this.btnList[0].src = 'map_icon_car02.png';
      this.btnList[1].src = 'map_icon_car04.png';
      this.btnList[2].src = 'map_icon_car08.png';
      this.btnList[3].src = 'map_icon_car06.png';
      this.btnList[index].active = true;
      if(index == 0) { // 驾车
        this.btnList[index].src = 'map_icon_car01.png'
      } else if(index == 1) { // 公交
        this.btnList[index].src = 'map_icon_car03.png'
      } else if(index == 2) { // 骑车
        this.btnList[index].src = 'map_icon_car07.png'
      }else { // 步行
        this.btnList[index].src = 'map_icon_car05.png'
      }
      this.queryMethodMap(this.selectTypeIndex); // 根据选取交通的方式来加载地图
    },
    queryMethodMap(type){
      let that = this;
      let map = new AMap.Map('mapContainer',{
        center: [parseFloat(that.startPos[0]),parseFloat(that.startPos[1])], // 地图中心点
        resizeEnable: true,
        zoom: 13 // 地图显示的缩放级别
      });
      //标注
      let marker = new AMap.Marker({
        position:[parseFloat(that.startPos[0]),parseFloat(that.startPos[1])], // 地图中心点
        title: 'hello',
        offset:new AMap.Pixel(-80,-160),
        content:`<div style="font-size:0.9rem;text-align:center;color:#fff;background-color:#318c75;border-radius:0.5rem;width:16.5rem;height:auto;padding:1rem;">
        <p style="font-size:1.2rem;font-weight:bold;line-height:1.8rem;">${that.hotelInfo.hotelName}</p>
        <p style="font-size:0.9rem;line-height:line-height1.8rem;">${that.hotelInfo.address}</div>`,
        map: map
      });
      marker.setMap(map);
      let marker1 = new AMap.Marker({
        position:[parseFloat(that.endPos[0]),parseFloat(that.endPos[1])], // 地图中心点
        title: 'hello',
        offset:new AMap.Pixel(-80,20),
        content:`<div style="font-size:0.9rem;text-align:center;color:#fff;background-color:#318c75;border-radius:0.5rem;width:16.5rem;height:auto;padding:1rem;">
        <p style="font-size:1.2rem;font-weight:bold;line-height:1.8rem;">${that.destinationData.name}</p>
        <p style="font-size:0.9rem;line-height:line-height1.8rem;">${that.destinationData.address}</div>`,
        map: map
      });
      marker1.setMap(map);
      //工具条
      AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
        var toolBar = new AMap.ToolBar();
        var scale = new AMap.Scale();
        map.addControl(toolBar);
        map.addControl(scale);
      });
      if(type == 0) { // 驾车
        AMap.service(['AMap.Driving'],function(){
          let driving = new AMap.Driving({
            'map': map,
            'panel':'panel'
          });
          driving.search([parseFloat(that.startPos[0]),parseFloat(that.startPos[1])],[parseFloat(that.endPos[0]),parseFloat(that.endPos[1])],function(status,result){
            //TODO 解析返回结果，自己生成操作界面和地图展示界面
            console.log('驾车查询结果')
            console.log('status',status)
            console.log('result',result);
            if(result.info == 'NO_DATA'){
                that.$message({'message':'没查询到数据','during':1000});
                that.isShowPanel = false;
              }else{
                that.isShowPanel = true;
              }
          });
        });
      }else if(type == 1) { // 公交
        AMap.service(['AMap.Transfer'],function(){
          let transOptions = {
            'map': map,
            'city': that.destinationData.cityname,
            'panel': 'result1', //公交城市
            'policy':AMap.TransferPolicy.LEAST_TIME //乘车策略
          };
          //构造公交换乘类
          let trans = new AMap.Transfer(transOptions);
          //传经纬度
          trans.search([parseFloat(that.startPos[0]),parseFloat(that.startPos[1])],[parseFloat(that.endPos[0]),parseFloat(that.endPos[1])], function(status, result) {
              //TODO 解析返回结果，自己生成操作界面和地图展示界面
              console.log('公交换乘查询结果')
              console.log('status',status)
              console.log('result',result);
              if(result.info == 'NO_DATA'){
                that.$message({'message':'没查询到数据','during':1000});
                that.isShowPanel = false;
              }else{
                that.isShowPanel = true;
              }
          });
        });
      }else if(type == 2) { // 骑车
        AMap.service(['AMap.Riding'],function(){
          let riding = new AMap.Riding({
            'map': map,
            'panel': 'panel'
          });
          riding.search([parseFloat(that.startPos[0]),parseFloat(that.startPos[1])], [parseFloat(that.endPos[0]),parseFloat(that.endPos[1])], function(status, result) {
              //TODO 解析返回结果，自己生成操作界面和地图展示界面
              console.log('骑车查询结果')
              console.log('status',status)
              console.log('result',result);
              if(result.info == 'NO_DATA'){
                that.$message({'message':'没查询到数据','during':1000});
                that.isShowPanel = false;
              }else{
                that.isShowPanel = true;
              }
          });
        });
      }else { // 步行
        AMap.service(['AMap.Walking'], function(){
          let MWalk = new AMap.Walking({
            map: map,
            panel: 'panel'
          });
          MWalk.search([parseFloat(that.startPos[0]),parseFloat(that.startPos[1])],[parseFloat(that.endPos[0]),parseFloat(that.endPos[1])],function(status,result){
            console.log('status',status)
            console.log('result',result)
            console.log('步行查询结果')
            if(result.info == 'NO_DATA'){
                that.$message({'message':'没查询到数据','during':1000});
                that.isShowPanel = false;
              }else{
                that.isShowPanel = true;
              }
          });
        });
      }
      
    },
    // 初始化
    init() {
      this.selectMethod(0); // 默认选中驾车
    }
  },
  mounted() {
    this.destinationData = this.$route.query.destinationData;
    this.hotelInfo = this.$route.query.hotelInfo;
    if(this.destinationData && typeof this.destinationData == 'object'){
      sessionStorage.destinationData = this.$qs.stringify(this.destinationData);
    }else{
      this.destinationData = this.$qs.parse(sessionStorage.destinationData);
    } 
    this.startPos = this.hotelInfo.position.replace('|',',').split(',');
    this.endPos = this.destinationData.location.split(',');
    // console.log('浏览器高度',document.body.clientHeight);
    let banner = document.querySelectorAll("#hotelAroundMap .bannerMap");
    let bannerHeight = banner[0].clientHeight;
    let browerHeight = document.body.clientHeight;
    let mapWrap = document.querySelectorAll('#hotelAroundMap .content');
    mapWrap[0].style.height = (browerHeight - bannerHeight)+'px'; 
    this.init(); // 初始化
  }
}
</script>
<style scoped>
#hotelAroundMap .content{
  width: 100%;
  /* height: 51rem; */
}
#hotelAroundMap .trafficMethodTab {
  position: absolute;
  right: 1.8rem;
  top: 2rem;
  z-index: 99;
}
#hotelAroundMap .trafficMethodTab li{
  width: 3.6rem;
  height: 3.6rem;
  margin-bottom: 1.3rem;
}
#hotelAroundMap .trafficMethodTab li img{
  width: 3.6rem;
  cursor: pointer;
}
#hotelAroundMap #panel {
  position: absolute;
  background-color: white;
  max-height: 80%;
  overflow-y: auto;
  top: 1.5rem;
  right: 6.5rem;
  width: 250px;
  border: solid 1px silver;
}
#hotelAroundMap #mapContainer {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}

#hotelAroundMap .button-group {
	position: absolute;
	bottom: 20px;
	right: 20px;
	font-size: 12px;
	padding: 10px;
}

#hotelAroundMap .button-group .button {
	height: 28px;
	line-height: 28px;
	background-color: #0D9BF2;
	color: #FFF;
	border: 0;
	outline: none;
	padding-left: 5px;
	padding-right: 5px;
	border-radius: 3px;
	margin-bottom: 4px;
	cursor: pointer;
}

#hotelAroundMap #tip {
	background-color: #fff;
	padding-left: 10px;
	padding-right: 10px;
	position: absolute;
	font-size: 12px;
	right: 10px;
	top: 20px;
	border-radius: 3px;
	border: 1px solid #ccc;
	line-height: 30px;
}

#hotelAroundMap .amap-info-content {
	font-size: 12px;
}
</style>

