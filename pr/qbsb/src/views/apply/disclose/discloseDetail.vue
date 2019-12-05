<template>
  <div id="disclose-detailPop">
    <el-dialog v-loading.lock :title="'详情'" :before-close="closePop" :visible.sync="isShowModal" width="700px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll" style="min-height:500px;">
        <h2 class="title">{{detail.brokeTitle?detail.brokeTitle:''}}</h2>
        <div class="info" style="line-height:20px;" v-if="detail.createTime">
          <!-- <span class="source">{{source}}</span> -->
          <p><span class="label-name">爆料人：</span>{{detail.userName?detail.userName:''}}</p>
          <p><span class="label-name">联系方式：</span>{{detail.contact?detail.contact:''}}</p>
          <p class="time"><span class="label-name">时间：</span>{{detail.createTime?detail.createTime:''}}</p>
        </div>
        <div class="article" v-html="detail.brokeContent?detail.brokeContent:''"></div>
        <ul class="imgWrap" v-if="mediaType=='video'">
          <li v-for="(item, index) in annex" :key="index">
            <video style="width:100%;height:300px;outline:none;" controls="controls" v-if="item.indexOf('mp4') > -1" :src="item"></video>
            <!-- <img v-else class="listItem" :src="item" alt=""> -->
          </li>
        </ul>
        <div class="imgPrev" v-if="mediaType=='pic'">
          <el-upload v-if="fileList.length > 0"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture-card">
            <i class="el-icon-plus" style="display:none;"></i>
          </el-upload>
        </div>
        <div class="reply" v-if="detail.comment">
          <h3 class="label">回复内容：</h3>
          <p>{{detail.comment?detail.comment:''}}</p>
          <p>{{detail.commentName?detail.commentName+'  /':''}}&nbsp;{{detail.commentTime?detail.commentTime:''}}</p>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" @click="closePop">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'discloseDetail',
  props: ['discloseId'],
  data () {
    return {
      detail: {},
      annex: [],
      fileList: [],
      isShowModal: false,
      dialogVisible: false,
      dialogImageUrl: '',
      mediaType: '' // 返回资源类型
    }
  },
  methods: {
    handleRemove(file, fileList) {
        console.log(file, fileList);
        return;
      },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    closePop () {
      this.isShowModal = false;
      this.$emit('fCloseDisclose');
    },
    getDiscloseDetail () {
      this.$loading();
      this.$jqAjax({
        url: apiHost + '/broke/detail',
        type: 'POST',
        data: {
          id: this.discloseId
        },
        success: (res) => {
          this.$loading().close();
          if (res.code == 0) {
            console.log('res', res);
            this.detail = res.data.detail;
            this.annex = res.data.annex;
            this.mediaType = res.data.type;
            if (this.annex) {
              this.annex.forEach((item, index) => {
                this.fileList.push({
                  name: '',
                  url: item
                });
              });
            }
            
          }
        },
        error: (err) => {
          this.$loading().close();
          this.$message({type: 'warning', message: '请求失败', showClose: true});
        }
      });
    }
  },
  created () {
    this.getDiscloseDetail();
    setTimeout(() => {
      this.isShowModal = true;
    }, 100);
  }
}
</script>
<style lang="scss">
#disclose-detailPop {
  .title{
    font-size: 20px;
    color: #333333;
    margin-bottom: 10px;
  }
  .article{
    font-size: 16px;
    color: #333333;
    padding-right: 5px;
    margin-bottom: 20px;
    *{
      max-width: 100%;
    }
  }
  .imgWrap {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    li {
      flex: 1;
      padding: 0 4px;
      .listItem {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        overflow: hidden;
      }
    }
  }
  .info{
    font-size: 12px;
    color: #999999;
    margin-bottom: 20px;
    .label-name {
      width: 70px;
      text-align: right;
      display:inline-block;
      margin-right: 6px;
    }
    
  }
  .reply {
    margin-top: 20px;
    .label{
      font-size: 18px;
      color: #000;
      margin-bottom: 10px;
    }
    p {
      line-height: 20px;
    }
  }
  .btns{
    text-align: center;
    padding-top: 20px;
    border: none;
  }
  .el-icon-delete{
    display: none;
  }
  .imgPrev {
    .el-upload--picture-card {
      display: none;
    }
    .el-upload-list--picture-card 
      .el-upload-list__item {
        width: 100px;
        height: 100px;
      }
  }
}

</style>
