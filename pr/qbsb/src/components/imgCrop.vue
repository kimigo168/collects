<template>
  <div class="cropWrap" v-loading.lock="loading">
    <div class="cover"></div>
    <div class="box">
      <p class="crop-title">图片上传</p>
      <div class="imgWrap">
        <VueCropper class="cut" ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true" :full="option.full" :can-scale="option.canScale" :can-move="option.canMove" :can-move-box="option.canMoveBox" fixed :original="option.original" :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox" :high="option.high" @real-time="realTime" :mode="option.mode" @img-load="imgLoad" :fixedNumber="option.fixedNumber" style="height: 100%;"></VueCropper>
      </div>
      <div class="btnWrap">
        <el-button class="btn"><input title=" " class="fileBtn" type="file" @change="triggerFile" accept="image/jpeg, image/png, image/jpg"/>重新上传</el-button>
        <el-button class="btn" type="primary" @click="confirmCrop">确定</el-button>
        <el-button class="btn" @click="$emit('fCloseCrop')">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
export default {
  name: 'cropWrap',
  props: ['imgCropObj'],
  data () {
    return {
      previews: '',
      imgMsg: '',
      option: {
        img: '',
        size: 1,
        full: false,
        outputType: 'png',
        canMove: false,
        canScale: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启，宽高才生效
        autoCropWidth: 750,
        autoCropHeight: 480,
        fixedNumber: [750,480],
        centerBox: false,
        hight: true,
        mode:'cover'
      },
      loading: false,
      uploadUrl: apiHost+'/common/upload',
    }
  },
  methods: {
    realTime (data) {
      this.previews = data
    },
    imgLoad (msg) {
      this.imgMsg = msg;
    },
    confirmCrop () {
      // this.$loading();
      this.$refs.cropper.getCropBlob((data) => {
        this.loading = true;
        let formData = new FormData();
        formData.append("file", data);
        this.$.ajax({
          url: this.uploadUrl,
          type: 'POST',
          data: formData,
          dataType: "json",
          processData: false,
          contentType: false,
          timeout: 15000,
          success: (res) => {
            this.loading = false;
            if (res.code == '0' && res.data && res.data.url) {
              this.$emit('uploadSuccess', res.data.url);
            } else {
              this.$message({ showClose: true, message: '图片上传失败,请重试', type: 'error'});
            }
          },
          error: (err) => {
            this.$message({ showClose: true, message: '图片上传失败,请重试', type: 'error'});
          } 
        })
      });
    },
    triggerFile (e) {
      let file = e.target.files[0];
      if (file.size / 1024 / 1024 > 5) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return false;
      }
      this.option.img = this.getObjectURL(file);
    },
    getObjectURL (file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    }
  },
  created () {
    this.option.img = this.imgCropObj.imgUrl;
    if (this.imgCropObj.size) {
      this.option.autoCropWidth = this.imgCropObj.size[0];
      this.option.autoCropHeight = this.imgCropObj.size[1];
      this.option.fixedNumber = this.imgCropObj.size;
      // this.option.fixedNumber.push(this.imgCropObj.size[0]);
      // this.option.fixedNumber.push(this.imgCropObj.size[1]);
    }
  },
  mounted () {

    // this.option.autoCropWidth = this.option.fixedNumber[0];
    // this.option.autoCropHeight = this.option.fixedNumber[1];
  },
  components: {
    VueCropper
  }
}
</script>
<style lang="scss" scoped>
  .cropWrap{
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    .cover{
      height: 100%;
      width: 100%;
      position: fixed;
      left: 0;
      top: 0;
      background-color: rgba(0,0,0,.3);
    }
    .box{
      width: 470px;
      height: 444px;
      background-color: rgba(242, 242, 242, 1);
      position: fixed;
      top: 50%;
      left: 50%;
      margin-left: -235px;
      margin-top: -227px;
      z-index: 10;
      .crop-title{
        height: 54px;
        line-height: 54px;
        font-weight: normal;
        font-size: 16px;
        margin-left: 26px;
      }
      .imgWrap{
        width: 402px;
        height: 290px;
        margin: 0 auto;
        box-sizing: border-box;
        .preview{
          height: 100%;
          width: 100%;
        }
      }
      .btnWrap {
        height: 100px;
        line-height: 100px;
        padding: 0 36px;
        .btn{
          width: 80px;
          position: relative;
          .fileBtn{
            height: 100%;
            width: 100%;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        .el-button--primary {
          color: #fff!important;
          background-color: #4d7cfe!important;
          border-color: #4d7cfe!important;
        }
      }
    }
  }
</style>
