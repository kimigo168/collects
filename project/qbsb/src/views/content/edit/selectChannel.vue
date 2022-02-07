<template>
  <div id="selectChannel">
    <el-dialog title="选入频道" width="30%" top="25vh" :visible.sync="dialogVisible" class="popBox" :before-close="handleClose">
      <div class="content">
        <!-- <ul class="itemWrap">
          <li class="item" v-for="(item, index) in channelList" :key="index" @click="selectFun(item)">{{item.name}}</li>
        </ul> -->
        <h3>频道</h3>
        <ul class="itemWrap"><li @click="selectParentChannel(item, index)" class="item" :class="{'active':selectParentIdx == index, 'isDisabled':item.isSelected == 1}" v-for="(item, index) in parentChannelList" :key="index">{{item.name}}</li></ul>
        <h3>子频道</h3>
        <ul class="itemWrap"><li @click="selectChildChannel(null, 0)" class="item" :class="{'active':selectChildIdx == 0 }">全部</li><li @click="selectChildChannel(item, index+1)" class="item" :class="{'active':selectChildIdx == (index+1),'isDisabled':item.isSelected == 1}" v-for="(item, index) in childChannelList" :key="index" >{{item.name}}</li></ul>
        <div class="botBtns">
          <el-button @click="$emit('fCloseSelect')">取消</el-button>
          <el-button type="primary" class="btn" @click="confirmSelect">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'selectChannel',
  props: ['isShowSelect', 'selectItem', 'tabIndex'],
  data () {
    return {
      dialogVisible: false,
      checkedOptions: [],
      parentChannelList: [],
      childChannelList: [],
      selectParentIdx: 0,
      selectParentItem: null,
      selectChildIdx: 0,
      selectChildItem: null
    }
  },
  methods: {
    selectParentChannel (item, index) {
      this.selectParentIdx = index;
      this.selectParentItem = item;
      this.childChannelList = [];
      this.selectChildIdx = 0;
      this.selectChildItem = null;
      this.queryCurChannel(1, item.id);
    },
    selectChildChannel (item, idx) {
      if (item && item.isSelected == 1) return;
      this.selectChildIdx = idx;
      this.selectChildItem = item;
    },
    handleClose () {
      this.$emit('fCloseSelect');
    },
    confirmSelect () {
      console.log('checkedOptions', this.checkedOptions);
      this.$confirm('确定选入该频道吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$loading();
        if (this.tabIndex == 2) { // 平台号文章
          this.$jqAjax({
            url: apiHost + '/platform/updateStatus',
            type: 'POST',
            data: {
              id: this.selectItem.id,
              channelPid: this.selectParentItem.id, // 父频道
              channelId: this.selectChildItem ? this.selectChildItem.id : 0, // 子频道
              status: 7 // 3 送审（到频道编辑）7:发布（已发布）
            },
            success: (res) => {
              this.$loading().close();
              if (res.code == 0) {
                this.$message({type: 'success', message: '选入成功', showClose: true});
                this.$emit('fSetSuccess');
              }
            },
            error: (err) => {
              this.$loading().close();
              this.$message({type: 'error', message: err.msg, showClose: true});
            }
          });
        } else { // 原创文章，采集文章
          this.$jqAjax({
            url: apiHost + '/channel/context/add',
            type: 'POST',
            data: {
              // info: JSON.stringify({
                channelPid: this.selectParentItem.id, // 父频道
                channelId: this.selectChildItem ? this.selectChildItem.id : 0, // 子频道
                cid: this.selectItem.cid
              // })
            },
            success: (res) => {
              this.$loading().close();
              if (res.code == 0) {
                this.$message({type: 'success', message: '选入成功', showClose: true});
                this.$emit('fSetSuccess');
              } else {
                this.$message({type: 'error', message: res.msg, showClose: true});
              }
            },
            error: (err) => {
              this.$loading().close();
              this.$message({type: 'error', message: err.msg, showClose: true});
            }
          });
        }

      });
    },
    // getChannelList (type, pid) { // type:0父，1子
    //   this.$jqAjax({
    //     url: apiHost + '/user/getNewsChannel',
    //     type: 'POST',
    //     data: {
    //       pid: pid
    //     },
    //     success: (res) => {
    //       if (res.code == 0) {
    //         if (type == 0) {
    //           this.parentChannelList = res.data;
    //           this.selectParentItem = this.parentChannelList[0];
    //         } else {
    //           this.childChannelList = res.data;
    //           this.selectChildItem = null;
    //           this.selectChildIdx = 0;
    //         }
    //       }
    //     },
    //     error: (err) => {
    //       this.$message({type: 'error', message: '请求失败', showClose: true});
    //     }
    //   });
    // },
    queryCurChannel (type, pid) { // 查询当前稿件已选频道，type: 0表示查父级，1：表示查子级
      if (type == 0) {
        this.parentChannelList = [];
      } else {
        this.childChannelList = [];
      }
      this.$jqAjax({
        url: apiHost + '/channel/context/selectableChannelList', // 当前稿件可选频道列表
        type: 'POST',
        data: {
          cid: this.selectItem.cid, // 稿件id
          pid: type == 1 ? pid : 0
        },
        success: (res) => {
          console.log('查询的稿件频道结果', res)
          if (res.code == 0) {
            if (type == 0) {
              this.parentChannelList = res.data;
              this.selectParentItem = this.parentChannelList[0];
              this.queryCurChannel(1, res.data[0].id);
            } else {
              this.childChannelList = res.data;
            }
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: '请求失败',showClose: true});
        }
      });
    } 
  },
  created () {
    this.queryCurChannel(0);
  },
  mounted () {
    this.dialogVisible = this.isShowSelect;
  }
}
</script>
<style lang="scss" scoped>
.content {
  padding: 10px 20px;
  h3{
    font-size: 14px;
    line-height: 14px;
    color: #333;
    padding-bottom: 15px;
    font-weight: 400;
    margin-top: 16px;
  }
  .itemWrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 10px;
    .item {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      margin: 0 10px 10px 0;
      background-color: #fff;
      border: 1px solid #ddd;
      color: #999;
      height: 28px;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
    }
    .item:nth-child(3n+1) {
      margin-left: 0;
    }
    .active{
      background: #4d7cfe;
      border-color: #4d7cfe;
      color: #fff;
    }
    .isDisabled {
      background-color: #dadee4;
    }
  }
  .botBtns {
    height: 60px;
    line-height: 60px;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn{
      margin-left: 30px;
    }
  }
}
</style>