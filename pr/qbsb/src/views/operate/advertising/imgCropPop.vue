<template>
  <div class="cropWrap" v-loading.lock="loading">
    <div class="cover"></div>
    <div class="box">
      <h3>图片上传</h3>
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
  props: ['imgCropObj', 'adType'],
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
        autoCropWidth: 200,
        autoCropHeight: 150,
        fixedNumber: [200, 150],
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
        // let request = new XMLHttpRequest();
        // request.open("POST", this.uploadUrl);
        // request.send(formData);
        // request.onreadystatechange = () => {
        //   if (request.readyState == 4) {
        //     this.loading = false;
        //     if (request.status == 200) {
        //       let res = JSON.parse(request.response);
        //       // this.$loading.close();
        //       if (res.code == "0" && res.data && res.data.url) {
        //         let url = res.data.url;
        //         this.$emit('uploadSuccess', url);
        //       } else {
        //         this.$message({ showClose: true, message: '图片上传失败,请重试', type: 'error'});
        //       }
        //     } else {
        //       this.$message({ showClose: true, message: '图片上传失败,请重试', type: 'error'});
        //     }
        //   }
        // };
        this.$.ajax({
          url: this.uploadUrl,
          type: 'POST',
          data: formData,
          dataType: "json",
          processData: false,
          contentType: false,
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
  mounted () {
    this.option.img = this.imgCropObj.imgUrl;
    this.option.fixedNumber = this.imgCropObj.isServiceIcon ? this.imgCropObj.fixedNumber: (this.adType == 0 ? [750, 1080]:this.adType == 1?[690, 364] : [750, 364]); //0:启动，1：频道，2：轮播
    this.option.autoCropWidth = this.option.fixedNumber[0];
    this.option.autoCropHeight = this.option.fixedNumber[1];
  },
  components: {
    VueCropper
  }
}
</script>
<style lang="scss" scoped>
  .cropWrap{
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
      h3{
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
      }
    }
  }
</style>
