<template>
  <div id="addHost">
    <el-dialog title="新增主播" width="30%" top="36vh" :visible.sync="dialogVisible" class="popBox" :before-close="handleClose" :modal="true">
      <div class="content">
        <div class="item" @keyup.enter="searchFun">
          主播账号： <input type="text" class="searchBorder" v-model="inputAcount"> <el-button class="searchBtn" type="primary" @click="searchFun">查找</el-button>
        </div>
        <div class="item">
          主播昵称： <span class="nickName" :class="{'hasResult': resultNickName!='昵称示例'}">{{resultNickName}}</span>
        </div>
        <div class="botBtns">
          <el-button @click="$emit('fCloseAdd')">取消</el-button>
          <el-button type="primary" class="btn" @click="confrimAdd">添加</el-button>
        </div>
      </div>
    </el-dialog>  
  </div>  
</template>
<script>
export default {
  name: 'addHost',
  props: ['isShowAdd'],
  data () {
    return {
      dialogVisible: false,
      inputAcount: '',
      resultNickName: '昵称示例',
      userInfo: null // 搜索的用户id
    }
  },
  methods: {
    handleClose () {
      this.$emit('fCloseAdd');
    },
    searchFun () {
      this.resultNickName = '昵称示例';
      this.userInfo = null;
      if (!this.inputAcount) return;
      this.$jqAjax({
        url: apiHost + '/live/user/searchUserByMobile',
        type: 'POST',
        data: {
          mobile: this.inputAcount
        },
        success: (res) => {
          if (res.code == 0) {
            if (res.data) {
              this.resultNickName = res.data.nikeName;
              this.userInfo = res.data;
            } else {
              this.$message({ type: 'error', message: '该账号未注册，请先在APP进行注册', showClose: true});
            }
          }
        },
        error: (err) => {
          this.$message({ type: 'error', message: '操作失败', showClose: true});
        }
      });
    },
    confrimAdd () {
      if (this.resultNickName && this.resultNickName != '昵称示例') {
        this.$jqAjax({
          url: apiHost + '/live/user/addLiveUser',
          type: 'POST',
          data: {
            id: this.userInfo.id,// 用户id
            nikeName: this.userInfo.nikeName
          },
          success: (res) => {
            if (res.code == 0) {
              this.$message({ type: 'success', message: '添加成功', showClose: true});
              this.$emit('fAddBack');
            } else {
              this.$message({ type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.$message({ type: 'error', message: '操作失败', showClose: true});
          }
        });
      }
    }
  },
  mounted () {
    this.dialogVisible = this.isShowAdd;
  }
}
</script>
<style lang="scss" scoped>
.content {
  padding: 10px 20px;
  .item {
    height: 50px;
    line-height: 50px;
    color: #000;
    .searchBorder{
      width: 230px;
      height: 26px;
      text-indent: 4px;
    }
    .searchBtn {
      margin-left: 10px;
    }
    .nickName{
      color:#999;
    }
    .hasResult {
      color: #000;
    }
  }
  .botBtns {
    height: 60px;
    line-height: 60px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn{
      margin-left: 30px;
    }
  }
}

</style>
