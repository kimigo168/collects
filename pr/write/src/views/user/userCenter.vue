<template>
  <div id="user-center">
    <header class="head-top">
      <div class="container">
        <div class="user-info">
          <img :style="{borderColor:memberType==1?'#EDC566':'#D3D7DF'}" :src="userInfo&&userInfo.headimgurl?userInfo.headimgurl:defaultAvatar" alt="" class="avatar">
          <span v-if="memberType==1" class="vip-logo"><i></i></span>
          <p class="phone">{{userInfo&&userInfo.nickname?userInfo.nickname:''}}</p>
          <div class="join-tips">
            <p>我们诚挚的邀请您加入VIP用户体验更多的服务</p>
            <div class="question" @click="viewQuestion"><i class="ques-icon"></i>常见问题</div>
          </div>
          <div class="vip-tip">
            <button class="join-vip" @click="joinVip" :class="{'vip-user':memberType==1}"><i></i>{{memberType==0?'加入':'续费'}}VIP</button><span v-if="memberType==1 && vipEndTime" class="validate">有效期至：{{vipEndTime}}</span>
          </div>
        </div>
        <button title="返回首页" class="back-home" @click="$router.push({path: '/'})"></button>
      </div>
    </header>
    <div class="content-wrap">
      <el-tabs v-model="tabIndex" @tab-click="handleClick">
        <el-tab-pane label="我的稿件" name="0"></el-tab-pane>
        <el-tab-pane label="查重结果" name="1"></el-tab-pane>
        <el-tab-pane label="购买记录" name="2"></el-tab-pane>
        <el-tab-pane label="个人信息" name="3"></el-tab-pane>
      </el-tabs>
      <!-- 我的稿件、购买记录 -->
      <div class="content" v-if="tabIndex!=='3'">
        <div class="search-wrap clearfix">
          <div class="search-item">
            <span class="label">获取时间</span>
            <el-date-picker style="margin-right:20px;" v-model="searchForm.time"  value-format="yyyy-MM-dd"  type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </div>
          <div class="search-item" v-if="tabIndex==='0'||tabIndex==='1'" @keyup.enter="searchFun">
            <span class="label">标题</span><input type="text" class="search-title" v-model="searchForm.title" placeholder="请输入标题搜索">
          </div>
          <button class="search-btn" style="float:right;" @click="searchFun">搜索</button>
        </div>
        <div class="table scroll" v-loading="(myLoading && tabIndex === '0') || (dupLoading && tabIndex == '1') || (buyLoading && tabIndex === '2')">
          <el-table v-show="tabIndex == '0'" style="width: 100%" :data="myList" :row-class-name="tableRowClassName">
            <el-table-column align="center" type="index" width="100" label="序号"></el-table-column>
            <el-table-column align="center" prop="title" label="标题"></el-table-column>
            <el-table-column align="center" label="稿件类型">
              <template slot-scope="scope">
                <span v-if="scope.row.ctype == 0">热点稿件</span>
                <span v-if="scope.row.ctype == 1">提纲稿件</span>
                <span v-if="scope.row.ctype == 2">汽车稿件</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="更新时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editFun(scope.row.id,scope.row.ctype)">编辑</el-button>
                <a style="margin-left: 20px;" download="" :href="host+'/c/member/exportDoc.do?contextId='+scope.row.id">
                  <el-button type="text" size="small">下载</el-button>
                </a>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-show="tabIndex == '1'" style="width: 100%" :data="duplicateList" :row-class-name="tableRowClassName">
            <el-table-column align="center" type="index" width="100" label="序号"></el-table-column>
            <el-table-column align="center" prop="title" label="标题"></el-table-column>
            <el-table-column align="center" label="稿件类型">
              <template slot-scope="scope">
                <span v-if="scope.row.ctype == 0">热点稿件</span>
                <span v-if="scope.row.ctype == 1">提纲稿件</span>
                <span v-if="scope.row.ctype == 2">汽车稿件</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="checkTime" label="提交时间"></el-table-column>
            <el-table-column align="center" prop="status" label="查重结果">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="viewDuplicateResult(scope.row)">{{scope.row.status==0?'查重中':scope.row.status==1?'查重完成':'查重失败'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-show="tabIndex == '2'" style="width: 100%" :data="buyList" :row-class-name="tableRowClassName">
            <el-table-column align="center" type="index" width="100" label="序号"></el-table-column>
            <el-table-column align="center"  prop="order_sn" label="订单编号"></el-table-column>
            <el-table-column align="center"  prop="goods_name" label="套餐类型">
              <!-- <template  slot-scope="scope">
                {{scope.row.payId==1?'VIP月卡':scope.row.payId==2?'VIP半年卡':scope.row.payId==3?'VIP年卡':''}}
              </template> -->
            </el-table-column>
            <el-table-column prop="pay_price" label="实付金额"></el-table-column>
            <el-table-column prop="pay_time" label="购买时间"></el-table-column>
          </el-table>
        </div>
        <div class="page">
          <el-pagination v-show="tabIndex=='0'" @current-change="pageNumChange" :current-page.sync="myPageNum" :page-size="myPageSize" layout="total, prev, pager, next, jumper" :total="myTotal"></el-pagination>
          <el-pagination v-show="tabIndex=='1'" @current-change="pageNumChange" :current-page.sync="dupPageNum" :page-size="dupPageSize" layout="total, prev, pager, next, jumper" :total="dupTotal"></el-pagination>
          <el-pagination v-show="tabIndex=='2'" @current-change="pageNumChange" :current-page.sync="buyPageNum" :page-size="buyPageSize" layout="total, prev, pager, next, jumper" :total="buyTotal"></el-pagination>
        </div>
      </div>
      <!-- 个人信息 -->
      <div class="content" v-if="tabIndex==='3'">
        <div class="change-wrap">
          <ul>
            <li class="li-item">
              <span class="label">昵称</span><span class="color2">{{userInfo&&userInfo.nickname?userInfo.nickname:'写作机器人用户'}}</span>
            </li>
            <li class="li-item">
              <span class="label">手机号</span>
              <span @click="bindPhoneFun" :class="{'color2': userInfo&&userInfo.phone, 'color1': !userInfo.phone}">{{userInfo&&userInfo.phone?userInfo.phone:'绑定'}}</span>
            </li>
            <li class="li-item">
              <span class="label">密码</span>
              <span :class="{'color1':userInfo&&userInfo.phone, 'color2': !userInfo.phone}" @click="editPwdFun">{{userInfo&&userInfo.phone?'修改密码':'绑定手机时设置密码'}}</span>
            </li>
            <li class="li-item">
              <span class="label">微信</span>
              <span :class="{'color2':userInfo&&userInfo.wxOpenid, 'color1': !userInfo.wxOpenid}" @click="bindWxFun">{{userInfo&&userInfo.wxOpenid?'已绑定':'绑定'}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <contact></contact>
    <!-- 查看查重结果 弹窗 -->
    <check-result v-if="isShowCheck" :viewCheckId="viewCheckId" :contextId="contextId" :contextType="contextType" @fClosePop="isShowCheck=false"></check-result>
    <!-- 绑定微信 弹窗-->
    <bind-wechat v-if="isShowBindWechat" @bindSuccess="bindWxSuccess" @fClose="isShowBindWechat=false"></bind-wechat>
    <!-- 修改密码 弹窗-->
    <edit-pwd-pop v-if="isShowEditPwd" @fClose="isShowEditPwd=false"></edit-pwd-pop>
    <!-- 绑定手机 弹窗 -->
    <bind-phone v-if="isShowBindPhone" @bindSuccess="bindPhoneSuccess" @fClose="isShowBindPhone=false"></bind-phone>
    <!-- 加载中提示 弹窗 -->
    <loading-tips v-if="isShowEditLoading" :loadText="'稿件获取中...'"></loading-tips>

  </div>
</template>
<script>
import checkResult from './checkResult'
import contact from '@/components/contact' // 联系方式
import bindWechat from './bindWechatPop' // 绑定微信
import editPwdPop from './editPwdPop' // 修改密码
import bindPhone from './bindPhonePop' // 绑定手机
import loadingTips from '@/components/loadingTips'
import MD5 from 'md5'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'userCenter',
  data () {
    return {
      roleType: '',
      memberType: '0',
      host: '',
      defaultAvatar: require('../../images/avatar1.png'),
      tabIndex: '0',
      searchForm: {
        title: '',
        time: []
      },
      myList: [], // 我的稿件
      buyList: [], // 购买订单列表
      duplicateList: [], // 查重结果列表
      editForm: {
        oldPassword: '',
        newPassword: '',
        confirmNewPwd: '',
        oldPwdVerify: true,
        newPwdVerify: true,
        confirmNewPwdVerify: true
      },
      isShowCheck: false,
      viewCheckId: '', // 查重文件id
      contextId: '', // 查重稿件的稿件id
      contextType: '', // 查重稿件的稿件类型
      myPageNum: 1,
      myPageSize: 10,
      myTotal: 0,
      buyPageNum: 1,
      buyPageSize: 10,
      buyTotal: 0,
      dupPageNum: 1,
      dupPageSize: 10,
      dupTotal: 0,
      dupLoading: false,
      myLoading: false,
      buyLoading: false,
      vipEndTime: '',
      isShowBindWechat: false, // 是否显示绑定微信弹窗
      isShowEditPwd: false,
      isShowBindPhone: false,
      isShowEditLoading: false
    }
  },
  components: {
    checkResult,
    contact,
    bindWechat,
    editPwdPop,
    bindPhone,
    loadingTips
  },
  computed: {
    ...mapState(['userInfo', 'refreshBuyHistory'])
  },
  watch: {
    refreshBuyHistory (val, oldVal) {
      if (val) {
        this.tabIndex = '2'
        this.getUserInfo()
        this.handleClick()
      }
    }
    // ,
    // userInfo (val, oldVal) {
    //   if (val) {
    //     this.getUserInfo()
    //     this.handleClick()
    //   }
    // }
  },
  methods: {
    ...mapMutations(['TOGGLE_BUYVIP', 'RECORD_USERINFO', 'CLEAR_USERINFO', 'TOGGLE_LOGINPOP']),
    pageNumChange (val) {
      if (this.tabIndex === '0') {
        this.myPageNum = val
        this.getMyList()
      } else if (this.tabIndex === '1') {
        this.dupPageNum = val
        this.getDuplicateList()
      } else if (this.tabIndex === '2') {
        this.buyPageNum = val
        this.getBuyList()
      }
    },
    handleClick () {
      this.searchForm.time = []
      this.searchForm.title = ''
      if (this.tabIndex === '0') {
        this.myPageNum = 1
        this.getMyList()
      } else if (this.tabIndex === '1') { // 查重结果
        this.dupPageNum = 1
        this.getDuplicateList()
      } else if (this.tabIndex === '2') {
        this.buyPageNum = 1
        this.getBuyList()
      } else {

      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    joinVip () { // 加入或购买VIP
      this.TOGGLE_BUYVIP(true)
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '个人中心', '点击VIP充值或续费'])
    },
    searchFun () {
      if (this.tabIndex === '0') {
        this.myPageNum = 1
        this.getMyList()
      } else if (this.tabIndex === '1') {
        this.dupPageNum = 1
        this.getDuplicateList()
      } else if (this.tabIndex === '2') {
        this.buyPageNum = 1
        this.getBuyList()
      }
    },
    pwdInput (no, e) {
      let value = e.target.value
      if (no === 0) {
        this.editForm.oldPwdVerify = value.length > 0
      } else if (no === 1) {
        this.editForm.newPwdVerify = value.length > 0
      } else {
        this.editForm.confirmNewPwdVerify = value.length > 0
      }
    },
    resetPwd () {
      if (this.editForm.oldPassword.length === 0) {
        this.editForm.oldPwdVerify = false
        return
      }
      if (this.editForm.newPassword.length === 0) {
        this.editForm.newPwdVerify = false
        return
      }
      if (this.editForm.confirmNewPwd.length === 0) {
        this.editForm.confirmNewPwdVerify = false
        return
      } else {
        if (this.editForm.newPassword !== this.editForm.confirmNewPwd) {
          this.editForm.confirmNewPwdVerify = false
          return
        }
      }
      this.$axios.post(this.$global.API.resetPassword,
        this.$qs.stringify({
          oldPassword: MD5(this.editForm.oldPassword),
          newPassword: MD5(this.editForm.newPassword)
        })
      ).then((res) => {
        if (res.code === '0') {
          this.$message({ type: 'success', message: '保存成功', showClose: true })
        }
      })
    },
    viewDuplicateResult (row) {
      this.viewCheckId = row.id
      this.contextId = row.contextId
      this.contextType = row.ctype
      if (row.status === 1) {
        this.isShowCheck = true
      }
    },
    getMyList () {
      this.myLoading = true
      this.$axios.post(this.$global.API.memberContextList,
        this.$qs.stringify({
          startTime: this.searchForm.time && this.searchForm.time[0] ? this.searchForm.time[0] + ' 00:00:00' : '',
          endTime: this.searchForm.time && this.searchForm.time[1] ? this.searchForm.time[1] + ' 23:59:59' : '',
          title: this.searchForm.title,
          pageNum: this.myPageNum,
          pageSize: this.myPageSize
        })
      ).then((res) => {
        this.myLoading = false
        if (res.code === '0') {
          this.myList = res.data.list
          this.myTotal = res.data.count
        }
      })
    },
    getDuplicateList () {
      this.dupLoading = true
      this.$axios.post(this.$global.API.duplicateList,
        this.$qs.stringify({
          startTime: this.searchForm.time && this.searchForm.time[0] ? this.searchForm.time[0] + ' 00:00:00' : '',
          endTime: this.searchForm.time && this.searchForm.time[1] ? this.searchForm.time[1] + ' 23:59:59' : '',
          title: this.searchForm.title,
          pageNum: this.dupPageNum,
          pageSize: this.dupPageSize,
          ctype: '' // 稿件类型，0热点，1提纲，2汽车 默认''为全部
        })
      ).then((res) => {
        this.dupLoading = false
        if (res.code === '0') {
          this.duplicateList = res.data.data
          this.dupTotal = res.data.totalRecord
        }
      }).catch((err) => {
        console.log(err)
        this.dupLoading = false
      })
    },
    editFun (id, ctype) {
      this.isShowEditLoading = true
      this.$axios.post(this.$global.API.editMemberContext,
        this.$qs.stringify({
          contextId: id
        })
      ).then((res) => {
        this.isShowEditLoading = false
        if (res.code === '0' && res.data) {
          let data = res.data
          localStorage.editerContent = data.content
          localStorage.editerTitle = data.title
          localStorage.articleId = data.id

          if (ctype === 2) { // 汽车写作
            this.$router.push({
              path: '/car-edit',
              query: {
                write: 2, // 2表示编辑
                vType:3
              }
            })
          } else { // 热点写作 || 提纲写作
            this.$router.push({
              path: '/edit',
              query: {
                write: 2, // 2表示编辑
                vType: ctype === 0 ? 1 : 2 // 1热点，2提纲
              }
            })
          }
        }
      }).catch((err) => {
        console.log(err)
        this.isShowEditLoading = false
      })
    },
    getBuyList () {
      this.buyLoading = true
      this.$axios.post(this.$global.API.buyOrderList,
        this.$qs.stringify({
          pageNum: this.buyPageNum,
          pageSize: this.buyPageSize,
          startTime: this.searchForm.time && this.searchForm.time[0] ? this.searchForm.time[0] + ' 00:00:00' : '',
          endTime: this.searchForm.time && this.searchForm.time[1] ? this.searchForm.time[1] + ' 23:59:59' : ''
        })
      ).then((res) => {
        this.buyLoading = false
        if (res.code === '0') {
          this.buyList = res.data.data
          this.buyTotal = res.data.totalRecord
        } else {
          this.buyList = []
        }
      })
    },
    getUserInfo () {
      this.$axios.post(this.$global.API.userInfo).then((res) => {
        if (res.code === '0' && res.data) {
          // this.roleType = res.data.roleName
          this.memberType = res.data.user.memberType
          this.vipEndTime = res.data.user.vipEndTime
          this.RECORD_USERINFO(res.data.user ? res.data.user : '')
        } else if (res.code === '9001') {
          this.CLEAR_USERINFO()
          this.TOGGLE_LOGINPOP(true)
        }
      })
    },
    viewQuestion () {
      const { href } = this.$router.resolve({ path: '/question' })
      if (this.$route.name === 'userCenter') {
        window.open(href, '_blank')
      }
    },
    editPwdFun () {
      if (this.userInfo && this.userInfo.phone) {
        this.isShowEditPwd = true
      }
    },
    bindWxFun () {
      if (this.userInfo && !this.userInfo.wxOpenid) {
        this.isShowBindWechat = true
      }
    },
    bindPhoneFun () {
      if (this.userInfo && !this.userInfo.phone) {
        this.isShowBindPhone = true
      }
    },
    bindPhoneSuccess () {
      this.isShowBindPhone = false
      this.getUserInfo() // 刷新用户信息
    },
    bindWxSuccess () {
      this.isShowBindWechat = false
      this.getUserInfo() // 刷新用户信息
    }
  },
  created () {
    this.host = this.$global.BASEURL
    this.getMyList()
    if (this.$route.query.reCharge === 1) { // 限制提示弹窗跳过来，提示要充值
      this.tabIndex = '2'
      this.getBuyList()
      this.TOGGLE_BUYVIP(true)
    }
    if (this.$route.query.duplicate === 1) { // 编辑查重跳转过来
      this.tabIndex = '1'
      this.getDuplicateList()
    }
    this.getUserInfo()
  }
}
</script>
<style lang="scss" scoped>
#user-center {
  width: 100%;
  background-color: #F4F4F4;
  .head-top {
    height: 120px;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.14);
    margin-bottom: 30px;
    .container {
      width: 1200px;
      height: 120px;
      position: relative;
      margin:0 auto;
      .user-info {
        height: 120px;
        padding-left: 115px;
        padding-top: 24px;
        position: relative;
        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 4px solid #D3D7DF;
          overflow: hidden;
          position: absolute;
          left: 15px;
          top: 50%;
          margin-top: -35px;
        }
        .vip-logo {
          width:43px;
          height:19px;
          background:linear-gradient(180deg,rgba(239,210,127,1) 0%,rgba(230,172,62,1) 100%);
          border-radius:10px;
          display: inline-block;
          text-align: center;
          position: absolute;
          left: 66px;
          top:78px;
          i {
            width: 14px;
            height: 14px;
            display: inline-block;
            background-image: url('../../images/icons/icon_vip.png');
            background-size: 14px 14px;
            background-position: center center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .phone {
          font-size: 24px;
          height:31px;
          font-family: PingFangSC-Semibold;
        }
        .join-tips {
          margin-top: 10px;
          font-size: 14px;
          color: #333;
          position: relative;
          p {
            width: 300px;
            border-right: 1px solid #E5E5E5;
          }
          .question {
            position: absolute;
            top: 0;
            left: 314px;
            padding-left: 24px;
            background-image: url('../../images/icons/question_icon.png');
            background-size: 18px 18px;
            background-position: left center;
            background-repeat: no-repeat;
            cursor: pointer;
            z-index: 10;
          }
        }
        .vip-tip {
          width: 300px;
          height: 54px;
          display: inline-block;
          position: absolute;
          left: 290px;
          top: 24px;
          padding-left: 24px;
          // border-left: 1px solid #E5E5E5;
          .join-vip {
            width: 113px;
            height: 30px;
            line-height: 30px;
            border-radius: 15px;
            font-family: PingFangSC-Semibold;
            font-size: 16px;
            color: #FFFFFF;
            background-image: linear-gradient(180deg, #57697F 0%, #3B4862 100%);
            position: relative;
            padding-left: 12px;
            i {
              width: 14px;
              height: 14px;
              display: inline-block;
              background-image: url('../../images/icons/icon_vip.png');
              background-size: 14px 14px;
              background-position: left center;
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .vip-user {
            background-image: linear-gradient(180deg, #EFD27F 0%, #E6AC3E 100%);
          }
          .validate {
            font-size: 12px;
            color: #B2B2B2;
            margin-left: 20px;
            // margin-top: 6px;
          }
        }
      }
      .back-home {
        height: 34px;
        width: 215px;
        line-height: 34px;
        // font-family: PingFangSC-Regular;
        // background-image: url('../../images/icons/jishu_icon.png');
        background-image: url('../../images/write_robbot.png');
        background-size: contain;
        // background-size: 27px 34px;
        background-position: left center;
        background-repeat: no-repeat;
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        padding-left: 220px;
      }
    }
  }
  .content-wrap {
    width: 1200px;
    height: 784px;
    background: #FFFFFF;
    box-shadow: 0 4px 6px 0 rgba(0,0,0,0.10);
    position: relative;
    left: 50%;
    margin-left: -600px;
    padding: 0 28px;
    .search-wrap {
      height: 120px;
      line-height: 40px;
      padding: 40px 0;
      .search-item {
        display: inline-block;
      }
      .label {
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        margin-right: 20px;
      }
      .search-title {
        width: 480px;
        height: 40px;
        border: 1px solid #DEDEDE;
        border-radius: 20px;
        margin-right: 30px;
        text-indent: 20px;
        font-size: 16px;
      }
      .search-btn {
        width: 120px;
        height: 40px;
        border-radius: 20px;
        font-size: 16px;
        background-color: #0E5DFF;
        color: #fff;
        text-align: center;
        line-height: 40px;
      }
    }
    .change-wrap {
      width: 480px;
      margin: 0 auto;
      ul {
        padding-top: 90px;
        .li-item {
          margin-bottom: 38px;
          .label {
            width: 124px;
            height: 22px;
            color: #8D8D8D;
            font-size: 16px;
            display: inline-block;
          }
          .color2 {
            color: #333333;
            font-size: 16px;
          }
          .color1 {
            color: #0E5DFF;
            font-size: 16px;
            cursor: pointer;
          }
        }
        // li {
        //   height: 114px;
        //   width: 100%;
        //   padding-top: 52px;
        //   .input-wrap {
        //     height: 62px;
        //     position: relative;
        //     padding-left: 120px;
        //     .label {
        //       color: #8D8D8D;
        //       font-size: 16px;
        //       position: absolute;
        //       left: 0;
        //       bottom: 28px;
        //     }
        //     input {
        //       width: 100%;
        //       height: 36px;
        //       line-height: 36px;
        //       border-bottom: 1px solid #EEE;
        //     }
        //     .error{
        //       border-color: #FF2323;
        //     }
        //     .error-tip {
        //       color: #FF2323;
        //       position: absolute;
        //       right: 0;
        //       bottom: 4px;
        //     }
        //   }
        // }
      }
      .btn-wrap {
        text-align: right;
        margin-top: 20px;
        .save-btn {
          width: 350px;
          height: 50px;
          line-height: 50px;
          border-radius: 25px;
          background-color: #0E5DFF;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
        }
      }

    }
  }
  .table {
    max-height: 528px;
  }
}
</style>
<style lang="scss">
#user-center {
  .content-wrap {
    .el-tabs__nav-wrap::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: #E5E5E5;
      z-index: 1;
    }
    .el-tabs__item.is-active {
      color: #115CF6;
      font-family: PingFangSC-Semibold;
      // font-weight: bold;
    }
    .el-tabs__active-bar {
      background-color: #0E5DFF;
      height: 3px;
    }
    .el-tabs__item {
      height: 70px;
      line-height: 70px;
      font-size: 18px;
      color: #999;
      // font-weight: bold;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-table .warning-row {
      background: #fff;
    }
    .el-table .success-row {
      background: #f6f6f6;
    }
  }
}
</style>
