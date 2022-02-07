<template>
  <div class="upload-pannel" v-loading.lock="loading" element-loading-text="获取数据中，请稍后..">
    <div class="type-title" :style="{paddingTop:acceptType=='audio'?'80px':'145px'}">+{{title}}</div>
    <ul class="btn-wrap">
      <li >本地上传<input type="file" class="upload-file" :accept="mediaType" @change="fileChange" :disabled="isUploading"></li>
      <li class="in-library" v-if="addInLib" @click="addInLibiary">从素材库添加</li>
    </ul>
    <div class="progress" v-if="isUploading">
      <el-progress :percentage="uploadProgress"></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  name: 'uploadPannel',
  props: ['addInLib', 'acceptType'],
  data () {
    return {
      title: '',
      loading: false,
      // 阿里音视频上传相关
      uploadProgress: 0, // 上传进度
      statusText: '', // 上传状态
      status: '',
      isUploading: false, // 是否上传中
      fileTitle: '',
      fileSize: '',
      // 上传权限参数
      uploadAuth: '',
      uploadAddress: '',
      videoId: '',
      getInfoFlag: null, // 查询上传信息返回
      cancelWaitFlag: null,
      mediaType: ''
    }
  },
  methods: {
    addInLibiary () {
      this.$emit('addInLibiary');
    },
    fileChange (e) {
      let file = e.target.files[0];
      let title = file.name;
      this.fileTitle = title.slice(0, title.indexOf('.'));
      this.fileSize = parseFloat(file.size / 1024 /1024).toFixed(2) + 'M';
      let userData = '{"Vod":{}}';
      if (this.uploader) {
        this.uploader.stopUpload();
        this.uploadProgress = 0;
        this.statusText = '';
      }
      this.uploader = this.createUploader();
      this.uploader.addFile(file, null, null, null, userData);
      // 直接触发上传
      this.isUploading = true;
      this.uploader.startUpload(); // 上传
      let obj = document.querySelectorAll('.upload-file');
      obj[0].value = '' // 清空上传的选择
    },
    createUploader () {
      let uploader = new AliyunUpload.Vod({
        timeout: 60000,
        partSize: 1048576, // 分片大小默认1M,不能小于100k
        parallel: 5, // 并行上传分片个数，默认5
        retryCount: 3, // 网络原因失败时，重新上传次数，默认为3
        retryDuration: 2, //网络原因失败时，重新上传间隔时间，默认为2秒
        // region: '',
        // userId: '', // 阿里云账号id
        addFileSuccess: (uploadInfo) => { // 添加文件成功
          this.statusText = '添加成功，等待上传...'
          this.getAuthAddress(uploadInfo);  
          console.log('添加成功')
        },
        onUploadStarted: (uploadInfo) => { // 开始上传
          console.log('开始上传')
          this.getAuthAddress(uploadInfo);  
        },
        onUploadSucceed: (uploadInfo) => { // 上传成功
          this.$message({type: 'success', message: '上传已完成，获取数据中，请稍后..', showClose: true});
          this.loading = true;
          this.getInfoFlag = setInterval(() => {
            this.getPlayInfo();
          }, 2000);
          // this.cancelWaitFlag = setTimeout(() => { // 10s后仍未请求到上传信息，则不再请求
          //   this.isUploading = false;
          //   this.loading = false;
          //   this.$message({type: 'warning', message:'获取上传信息超时', showClose: true});
          //   clearInterval(this.getInfoFlag)
          // }, 30000);
        },
        onUploadFailed: (uploadInfo, code, message) => { // 上传失败
          this.statusText = '上传失败！';
          this.$message({type: 'error', message: '上传失败', showClose: true});
          this.isUploading = false;
          this.status = 'exception';
        },
        onUploadCanceled: (uploadInfo, code, message) => { // 取消上传
          this.statusText = '文件已暂停上传！';
          this.isUploading = false;
        },
        onUploadProgress: (uploadInfo, totalSize, progress) => {
          let progressPercent = Math.ceil(progress * 100)
          console.log(`上传进度 ${progressPercent}%`);
          this.uploadProgress = Number(progressPercent);
          this.statusText = `上传中...${progressPercent}%`
          if (progress == 1) {
            this.status = 'success';
          }
        },
        onUploadTokenExpired: (uploadInfo) => {
          this.$message({type: 'warning', message: '上传超时，请重新上传', showClose: true});
          this.isUploading = false;
          this.status = 'warning';
        }
      })
      return uploader;
    },
    getAuthAddress (uploadInfo) { // 获取阿里云凭证及地址
      this.$ajax({
        url:'/common/getUploadToken',
        type: 'POST',
        data: {
          fileName: uploadInfo.file.name,
          title: this.fileTitle
        },
        success: (res) => {
          if (res.code == 0) {
            this.uploadAuth = res.data.UploadAuth;
            this.uploadAddress = res.data.UploadAddress;
            this.videoId = res.data.videoId;
            this.uploader.setUploadAuthAndAddress(uploadInfo, this.uploadAuth, this.uploadAddress);
          } else {
            this.$message({type: 'error', message: res.msg, showClose: true});
            this.isUploading = false;
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: '请求失败', showClose: true});
          this.isUploading = false;
        }
      })
    },
    getPlayInfo () { // 从服务器获取上传音视频路径和信息
      this.$ajax({
        url: '/common/getPlayUrl',
        type: 'POST',
        data: {
          videoId: this.videoId,
          formats: 'mp4' // 默认
        },
        success: (res) => {
          if (res.code == 0) {
            if (res.data && res.data.playUrl) {
              clearInterval(this.getInfoFlag)
              // clearTimeout(this.cancelWaitFlag);
              this.loading = false;
              // this.$message({type: 'success', message: '上传成功', showClose: true});
              this.$emit('fUploadSuccess', res.data);
              this.isUploading = false;
            }
          } else {
            clearInterval(this.getInfoFlag)
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: '获取上传信息失败', showClose: true});
          this.isUploading = false;
          this.loading = false;
          clearInterval(this.getInfoFlag)
        }
      });
    } 
  },
  created () {
    this.title = this.acceptType == 'video' ? '添加视频' : '添加音频';
    this.mediaType = this.acceptType == 'video'? ('video/mp4,video/x-m4v,video/*') : (this.acceptType+'/*');
  }
}
</script>
<style lang="scss" scoped>
.upload-pannel {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #d6d6d6;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  .type-title {
    font-size: 24px;
    color:#4d7cfe;
    text-align: center;
    padding: 145px 0 28px;
  }
  .btn-wrap {
    height: 30px;
    width: 250px;
    margin: 0 auto;
    text-align: center;
    li {
      width: 100px;
      height: 30px;
      line-height: 30px;
      display: inline-block;
      position: relative;
      background-color: #fff;
      color:#4d7cfe;
      border: 1px solid #4d7cfe;
      text-align: center;
      .upload-file {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .in-library {
      width: 110px;
      margin-left: 32px;
      background-color: #4d7cfe;
      color: #fff;
      cursor: pointer;
    }
  }
  .progress {
    width: 400px;
    margin: 20px auto;
  }
}
</style>
