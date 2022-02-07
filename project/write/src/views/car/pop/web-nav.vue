<template>
    <div id="web-nav" v-loading="loading">
      <div class="input">
        <span>
          <img class="img1" src="./../../../images/car/fodder-input-1-1.png">
          <b>关键词</b>
        </span>
        <input v-model="keyword" type="text" @keyup.enter="getListData()" placeholder="请输入品牌关键词">
        <i class="el-icon-search" @click="getListData()"></i>
      </div>
      <div class="nav-list">
        <div class="item clearfix" v-for="item in list">
          <span>{{item.shouzimu}}</span>
          <p v-for="item2 in item.list">
            <a :href="item2.website" target="_blank">
              <img src="./../../../images/car/web-nav-icon_01.png"/>
              {{item2.cname}}
            </a>
          </p>
        </div>
        <p style="text-align: center;color: #666;" v-if="list.length==0">没有更多了</p>
      </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
              keyword:'',
              list:[],
              loading:false,

            }
        },
        created() {
          this.getListData();
        },
        methods: {
          getListData(){
            var self = this;
            self.loading = true;
            self.$http({
              url: self.$global.BASEURL + "/pinpai/search.do",
              type: 'GET',
              data: {
                keyword: self.keyword,
              },
              success: function (data) {
                self.loading = false;
                if (data.code == 0 && data.data && data.data.length > 0) {
                  self.list=data.data;
                }else {
                  self.list=[];
                }
              }
            })
          },
        }
    }
</script>

<style>
#web-nav .nav-list{
  padding:14px;
  background:rgba(238,244,254,1);
  border-radius:4px;
  margin-top: 18px;
}
#web-nav .nav-list .item{
  position: relative;
  padding:15px 0 5px 40px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  margin-bottom: 14px;
}
#web-nav .nav-list .item span{
  position: absolute;
  left: 14px;
  top:14px;
  font-size:16px;
  font-weight:600;
  color:rgba(51,51,51,1);
  line-height:22px;
}
#web-nav .nav-list .item p{
  display: block;
  float: left;
  margin:0 10px 10px 0;
  min-width: 110px;
  font-size:14px;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:20px;
}

</style>
