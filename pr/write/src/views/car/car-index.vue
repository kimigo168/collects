<template>
  <div id="car-index" class="scroll" v-loading="loading">
    <!-- 右下角联系方式 -->
    <contact></contact>
    <head-top-nav></head-top-nav>
    <div class="content-wrap">
        <div class="banner">
          <div class="inner">
            <div class="title">
              <h3>汽车写作</h3>
              <p>Car writing</p>
            </div>

            <div class="write-box">
              <div class="row">
                <span><i>1</i>选择题材</span>
                <div class="label">
                  <div class="input">
                    <el-select v-model="templateType" @change="getTemplateListData()">
                      <el-option v-for="item in templateTypeList" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>

              <div class="row">
                <span><i>2</i>选择车系</span>
                <div class="label">
                  <div class="input" v-show="templateType == 0">
                    <el-select v-model="carTypeCheck"
                               multiple
                               :multiple-limit="10"
                               filterable
                               remote
                               :reserve-keyword="false"
                               :remote-method="remoteMethod"
                               :selectLoading="selectLoading"
                               @change="carTypeCheckChange"
                               placeholder="请输入车系关键词检索（可添加多个车系）">
                      <el-option
                        v-for="item in carTypeList"
                        :key="item.idText"
                        :label="item.text"
                        :value="item.idText">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="input" v-show="templateType == 1">
                    <el-select v-model="templatechexingCheck"
                               @clear="templateChexingClear('templatechexingList')"
                               filterable
                               remote
                               clearable
                               :reserve-keyword="false"
                               :remote-method="templateChexingRemoteMethod"
                               :selectLoading="selectLoading"
                               placeholder="请输入车型关键词检索"
                               style="width: 45%;">
                      <el-option
                        v-for="item in templatechexingList"
                        :key="item.idText"
                        :label="item.text"
                        :value="item.idText">
                      </el-option>
                    </el-select>
                    <img class="vs" src="./../../images/car/login-banner-icon2-1.png"/>
                    <el-select v-model="templatechexingCheck2"
                               @clear="templateChexingClear('templatechexingList2')"
                               filterable
                               remote
                               clearable
                               :reserve-keyword="false"
                               :remote-method="templateChexingRemoteMethod2"
                               :selectLoading="selectLoading"
                               placeholder="请输入车型关键词检索"
                               style="width: 45%;">
                      <el-option
                        v-for="item in templatechexingList2"
                        :key="item.idText"
                        :label="item.text"
                        :value="item.idText">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>

              <div class="row" style="margin-bottom: 10px;">
                <span><i>3</i>选择模版</span>
                <div class="label">
                  <ul class="template-list" v-loading="templateLoading">
                    <li v-for="item in templateList" :class="{'active':templateCheckId == item.id}" @click="templateCheckId=item.id">
                      <img :src="item.coverImages"/>
                      <h3>{{item.title}}</h3>
                      <p>{{item.cdesc}}</p>
                    </li>
                  </ul>
                </div>
              </div>


              <div class="btns">
                <el-button type="primary" @click="clickWriteBtn()">智能写作</el-button>
              </div>
            </div>


          </div>
        </div>

        <div class="section">
          <div class="inner">
            <div class="text">
              <h2>01</h2>
              <p>专注汽车内容创作，预设组件和素材，一键快速成稿</p>
            </div>
            <img class="img" src="./../../images/car/login-img_01.png"/>
          </div>
        </div>
        <div class="section section2">
          <div class="inner">
            <div class="text">
              <h2>02</h2>
              <p>全网智能实时素材搜集、分类入库，素材获取只在分秒之间</p>
            </div>
            <img class="img" src="./../../images/car/login-img_02.png"/>
          </div>
        </div>
        <div class="section">
          <div class="inner">
            <div class="text">
              <h2>03</h2>
              <p>智能算法助力文章查重、词句纠错，把关内容质量</p>
            </div>
            <img class="img" src="./../../images/car/login-img_03.png"/>
          </div>
        </div>
        <div class="section section2">
          <div class="inner">
            <div class="text">
              <h2>04</h2>
              <p>中外文资讯、汽车图谱、海量图库、精准词句等多方位信息呈现，创作灵感泉涌不断</p>
            </div>
            <img class="img" src="./../../images/car/login-img_04.png"/>
          </div>
        </div>
    </div>
    <footer-bot></footer-bot>
    <loading-tips v-if="writeLoading" :loadText="'底稿生成中......'"></loading-tips>
  </div>
</template>
<script>
import contact from '@/components/contact'
import footerBot from '@/components/footer'
import headTopNav from '@/components/headTopNav'
import loadingTips from '@/components/loadingTips'

import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    contact,
    footerBot,
    headTopNav,
    loadingTips
  },
  data () {
    return {
      templateTypeList:[
        {
          name:'精选车系',
          code:0
        },{
          name:'两车对比',
          code:1
        }
      ],
      templateType: 0,

      carTypeCheck: [],
      carTypeList: [],
      templatechexingCheck: '',
      templatechexingList: [],
      templatechexingCheck2: '',
      templatechexingList2: [],
      selectLoading: false,

      templateList: [],
      templateCheckId:'',
      templateLoading: false,

      writeLoading: false, // 开始写作Loading
      loading: false,
    }
  },
  computed: {
    ...mapState(['userInfo', 'writeStatus']),
    templateCheckContent(){
      var str=''
      for(var i=0;i<this.templateList.length;i++){
        if(this.templateCheckId === this.templateList[i].id){
          str=this.templateList[i].content
        }
      }
      return str
    }
  },
  watch: {
    'writeStatus': function (val) {
      if (val && val === 3) {
        this.SET_WRITE_STATUS(0)
        this.clickWriteBtn()
      }
    },
  },
  created () {
    this.getTemplateListData();
    this.getCardTypeList('', ['carTypeList']);
    this.getCardTypeList('', ['templatechexingList', 'templatechexingList2'], 1);
  },
  methods: {
    ...mapMutations(['TOGGLE_LOGINPOP', 'SET_WRITE_STATUS']),

    //点击智能写作
    clickWriteBtn(){
      var self=this;
      var chexing = '';
      if(self.templateType === 1){
        if (!self.templatechexingCheck) {
          self.$alert('请选择第1个车型', '提示', {
            type: 'warning'
          });
          return;
        }else if (!self.templatechexingCheck2) {
          self.$alert('请选择第2个车型', '提示', {
            type: 'warning'
          });
          return;
        }
        chexing = self.GetId(self.templatechexingCheck)+';'+self.GetId(self.templatechexingCheck2);
      }else {
        if (!self.carTypeCheck || self.carTypeCheck.length === 0) {
          self.$alert('请选择车系', '提示', {
            type: 'warning'
          });
          return;
        }
        var arr=[];
        for(var i=0;i<self.carTypeCheck.length;i++){
          arr.push(self.GetId(self.carTypeCheck[i]))
        }
        chexing = arr.join(';');
      }
      if(!self.userInfo){
        self.TOGGLE_LOGINPOP(true)
        self.SET_WRITE_STATUS(1)
        return
      }
      if(!self.templateCheckContent){
        self.setStorage()
        window.localStorage.editerContent = ''
        if(self.templateType === 1){
          window.localStorage.editerTitle=self.GetText(self.templatechexingCheck) + ' VS ' + self.GetText(self.templatechexingCheck2)
        }else {
          window.localStorage.editerTitle=self.GetText(self.carTypeCheck[0])
        }
        self.$router.push({
          path: '/car-edit',
          query: { write: 1, vType: 3 }
        })
        return
      }
      self.writeLoading = true;
      self.$http({
        url: self.$global.BASEURL + "/template/article.do",
        data: {
          chexing: chexing,
          template_id: self.templateCheckId,
          size: 5
        },
        success: function (data) {
          self.writeLoading = false;
          if (data.code == 0 && data.data && data.data.length>0) {
            self.setStorage()
            window.sessionStorage.dataSource=JSON.stringify(data.data)
            if(self.templateType === 1){
              window.sessionStorage.keyword= JSON.stringify( self.GetText(self.templatechexingCheck) + ' VS ' + self.GetText(self.templatechexingCheck2) )
            }else {
              window.sessionStorage.keyword=JSON.stringify( self.GetText(self.carTypeCheck[0]) )
            }
            self.$router.push({
              path: '/layout/create',
              query: {
                vType: 3 // 汽车写作
              }
            })
          } else {
            self.$message({
              showClose: true,
              message: '未能写出有效文章，请更换车型或车系！',
              type: 'error'
            });
          }
        }
      })
    },
    setStorage(){
      var self=this;
      if(self.templateType === 1){
        window.sessionStorage.templateType=self.templateType;
        window.sessionStorage.removeItem('carTypeCheck');
        window.sessionStorage.templatechexingCheck=self.templatechexingCheck;
        window.sessionStorage.templatechexingCheck2=self.templatechexingCheck2;
        window.sessionStorage.keyword= JSON.stringify( self.GetText(self.templatechexingCheck) + ' VS ' + self.GetText(self.templatechexingCheck2) )
      }else {
        window.sessionStorage.templateType=self.templateType;
        window.sessionStorage.carTypeCheck=JSON.stringify(self.carTypeCheck);
        window.sessionStorage.removeItem('templatechexingCheck');
        window.sessionStorage.removeItem('templatechexingCheck2');
        window.sessionStorage.keyword=JSON.stringify( self.GetText(self.carTypeCheck[0]) )
      }
      window.sessionStorage.writeType= 3 // 1表示热点写作，2：提纲写作 3：汽车写作
    },

    //获取模板列表
    getTemplateListData: function () {
      var self = this;
      self.templateLoading = true;
      self.$http({
        url: self.$global.BASEURL + "/template/list.do",
        data: {
          template_type: self.templateType,
        },
        success: function (data) {
          self.templateLoading = false;
          if (data.code == 0 && data.data && data.data.data && data.data.data.length > 0) {
            self.templateList = data.data.data;
            self.templateCheckId = data.data.data[0].id
          } else {
            self.templateList = [];
          }
        }
      })
    },

    //车系远程搜索多选
    remoteMethod: function (query) {
      var self = this;
      if (query || (self.carTypeCheck.length == 0 && query == '')) {
        self.selectLoading = true;
        if (self.timer) clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.getCardTypeList(query, 'carTypeList');
        }, 200)
      } else {
        self.carTypeList = [];
      }
    },
    carTypeCheckChange: function (val) {
      console.log(val)
      this.carTypeList = [];
      if (val.length == 0) {
        this.getCardTypeList('', 'carTypeList');
      }
    },
    templateChexingRemoteMethod: function (query) {
      var self = this;
      self.selectLoading = true;
      if (self.timer) clearTimeout(self.timer);
      self.timer = setTimeout(function () {
        self.getCardTypeList(query, 'templatechexingList', 1);
      }, 200)
    },
    templateChexingRemoteMethod2: function (query) {
      var self = this;
      self.selectLoading = true;
      if (self.timer) clearTimeout(self.timer);
      self.timer = setTimeout(function () {
        self.getCardTypeList(query, 'templatechexingList2', 1);
      }, 200)
    },
    templateChexingClear: function (carTypeList) {
      this.getCardTypeList('', carTypeList, 1);
    },
    //搜索车系
    getCardTypeList: function (query, carTypeList, type) {
      var self = this;
      self.selectLoading = true;
      self.$.ajax({
        url: self.$global.BASEURL + "/media/complete/search.do",
        data: {
          q: query,
          type: type
        },
        success: function (data) {
          self.selectLoading = false;
          if (data.code == 0 && data.data) {
            for (var i = 0; i < data.data.length; i++) {
              data.data[i].idText = data.data[i].id + '&' + data.data[i].text
            }
            if (typeof (carTypeList) == 'object') {
              for (var i = 0; i < carTypeList.length; i++) {
                self[carTypeList[i]] = data.data;
              }
            } else {
              self[carTypeList] = data.data;
            }

          } else {
            if (typeof (carTypeList) == 'object') {
              self[carTypeList[i]] = [];
            } else {
              self[carTypeList] = [];
            }
          }
        }
      })
    },


  },

}
</script>
<style lang="scss">
#car-index {
  width: 100%;
  height: 100%;
  position: relative;
  .content-wrap{
    .banner {
      padding-top: 80px;
      .inner{
        background:#F8F9FF url("./../../images/car/car-index-bj.png") no-repeat top center;
        .title{
          padding:100px 0 92px;
          text-align: center;
          h3{
            font-size:42px;
            font-weight:600;
            color:rgba(255,255,255,1);
            line-height:59px;
            margin-bottom: 8px;
          }
          p{
            font-size:14px;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:20px;
            letter-spacing:3px;
            text-transform:uppercase
          }
        }
        .write-box{
          margin:0 auto 90px;
          width:1170px;
          padding:60px 100px 60px 70px;
          box-sizing: border-box;
          background:rgba(255,255,255,1);
          box-shadow:0px 4px 10px 0px rgba(0,0,0,0.08);
          border-radius:10px;
          .row{
            margin-bottom: 40px;
            min-height: 48px;
            &>span{
              float: left;
              line-height: 48px;
              font-size:16px;
              font-weight:600;
              color:rgba(51,51,51,1);
              i{
                display: inline-block;
                width:32px;
                height:32px;
                background:rgba(51,125,255,1);
                border-radius: 50%;
                text-align: center;
                font-size: 20px;
                line-height: 30px;
                color: #FFFFFF;
                font-style: normal;
                font-weight: normal;
                font-family: auto;
                margin-right: 11px;
                vertical-align: middle;
              }
            }
            .label{
              padding-left: 130px;
              .input {
                height:48px;
                padding:4px 7px;
                box-sizing: border-box;
                background:rgba(241,247,255,1);
                border-radius:24px;
                text-align: center;
                overflow: hidden;
                .el-select{
                  width: 100%;
                }
                .el-input__inner {
                  border: none;
                  background:rgba(241,247,255,1);
                }
                .vs {
                  width: 30px;
                  vertical-align: middle;
                }
              }
              .template-list{
                text-align: justify;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                min-height: 200px;
                li{
                  display: inline-block;
                  line-height: 1;
                  width:240px;
                  background:rgba(241,247,255,1);
                  border-radius:10px;
                  margin-bottom: 30px;
                  cursor: pointer;
                  transition: all 0.3s;
                  img{
                    display: block;
                    width: 100%;
                    margin-bottom: 12px;
                  }
                  h3{
                    font-size:16px;
                    font-weight:600;
                    color:rgba(51,51,51,1);
                    line-height:22px;
                    margin:0 20px 8px;
                    overflow: hidden;
                    white-space: nowrap;
                  }
                  p{
                    height:51px;
                    font-size:12px;
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color:rgba(141,141,141,1);
                    line-height:17px;
                    margin:0 20px 12px;
                    overflow: hidden;
                  }
                  &.active{
                    background:rgba(14,93,255,1);
                    h3,p{
                      color: #FFFFFF;
                    }
                  }
                  &:hover{
                    box-shadow:0px 3px 10px 0px rgba(168,200,255,1);
                  }
                }
              }
            }
          }
          .btns{
            text-align: center;
            .el-button{
              width:230px;
              height:50px;
              background:rgba(14,93,255,1);
              border-radius:27px;
              font-size:18px;
              font-weight:600;
            }
          }
        }
      }
    }
    .section {
      background: #ffffff;
      height: 540px;
    }

    .section .inner {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      position: relative;
    }

    .section .text {
      position: absolute;
      left: 115px;
      top: 90px;
      width: 370px;
    }

    .section .text h2 {
      font-family: Arial;
      font-weight: bolder;
      font-size: 60px;
      line-height: 70px;
      margin-bottom: 22px;
    }

    .section .text p {
      font-size: 24px;
      color: #333333;
      letter-spacing: 0;
      line-height: 40px;
    }

    .section .img {
      position: absolute;
      top: 50%;
      left: 640px;
      transform: translateY(-50%);
    }

    .section2 {
      background: #F8F9FF;
      height: 540px;
    }

    .section2 .text {
      left: 625px;
    }

    .section2 .img {
      left: 100px;
    }
  }
}
@media (max-width: 1200px) {
  #car-index .content-wrap .banner .inner .write-box{
    width: 1000px;
  }
  #car-index .content-wrap .banner .inner .write-box .row .label .template-list li{
    width: 215px;
  }
}
</style>
