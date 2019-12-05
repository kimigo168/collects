<template>
  <div id="webAudit" v-loading.lock="loading">
    <el-dialog title="送审" width="30%" top="30vh" :visible.sync="dialogVisible" class="popBox" :before-close="handleClose" :modal="true">
      <div class="content">
        <div class="item">
          <span class="label">父频道：</span> 
          <span class="classWrap">
            <el-select v-model="channelPid" @change="selectChange">
              <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </span>
        </div>
        <div class="item">
          <span class="label">子频道：</span> 
          <span class="classWrap">
            <el-select v-model="channelId">
              <el-option v-for="item in childChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </span>
        </div>
        <div class="item">
          <span class="label">备注：</span> 
          <span class="classWrap">
            <el-input style="width:190px;" type="text" v-model="remark"></el-input>
          </span>
        </div>
        <div class="botBtns">
          <el-button  @click="$emit('fCloseAudit')">取消</el-button>
          <el-button type="primary" class="btn" @click="confirmAudit">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'webAuditPop',
  props: ['auditId', 'isPlatform'],
  data () {
    return {
      loading: false,
      dialogVisible: false,
      channelList: [],
      childChannelList: [],
      channelId: '',
      channelPid: '',
      remark: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('fCloseAudit');
    },
    confirmAudit () { // 确定送审
      this.$loading();
      if (this.isPlatform) { // 公众号采集
        this.$jqAjax({
          url: apiHost + '/platform/updateStatus',
          type: 'POST',
          data: {
            id: this.auditId,
            channelPid: this.channelPid || 0,
            channelId: this.channelId || 0,
            remark: this.remark,
            status: 4 // 
          },
          success: (res) => {
            this.$loading().close();
            if (res.code === '0') {
              this.$message({type: 'success', message: '送审成功', showClose: true});
              this.$emit('fAuditSuccess');
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.$loading().close()
          }
        });
      } else { // 网站采集
        this.$jqAjax({
          url: apiHost + '/netCollect/sendAudit',
          type: 'POST',
          data: {
            _id: this.auditId,
            channel_pid: this.channelPid || 0,
            channel_id: this.channelId || 0,
            remark: this.remark
          },
          success: (res) => {
            this.$loading().close();
            if (res.code === '0') {
              this.$message({type: 'success', message: '送审成功', showClose: true});
              this.$emit('fAuditSuccess');
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.$loading().close()
          }
        })
      }
    },
    getChannelList (type) {
      this.$jqAjax({
        url: apiHost + '/user/getNewsChannel',
        type: 'POST',
        data: {
          pid: type == 0 ? '' : this.channelPid
        },
        success: (res) => {
          if (res.code == 0) {
            if (type == 0) {
              this.channelList = res.data;
              this.channelPid = res.data && res.data[0] ? res.data[0].id : '';
              this.getChannelList(1)
            } else {
              this.childChannelList = res.data; // 有子频道，默认选第一个
              this.channelId = this.childChannelList.length > 0 ? this.childChannelList[0].id : '';
            }
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    },
    selectChange () {
      this.childChannelList = [];
      this.channelId = '';
      this.getChannelList(1);
    }
  },
  created () {
    this.getChannelList(0); // 请求子频道
  },
  mounted () {
    this.dialogVisible = true;
  }
}
</script>
<style lang="scss" scoped>
.content
  .item {
    height: 50px;
    line-height: 50px;
    color: #000;
    .label {
      width: 70px;
      margin-right: 10px;
      text-align: right;
      display:inline-block;
    }
    .classWrap{
      width: 200px;
      display: inline-block;
    }
    .searchBorder {
      height: 24px;
      width: 200px;
      line-height: 24px;
      text-indent: 4px;
    }
 
  }
  .tips{
    height: 40px;
    text-indent: 80px;
    line-height: 40px;
    color: #999;
  }
.content
  .itemUpload{
    height: 82px;
    line-height: 82px;
    margin-top: 10px;
    color: #000;
  }
.botBtns{
    margin: 60px 0 20px 0;
    display: flex;
    justify-content: center;
    .btn {
      margin-left: 40px;
    }
  }
</style>
