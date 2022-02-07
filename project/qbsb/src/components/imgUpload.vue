<template>
  <div class="uploadWrap" :style="{width: size[0]+'px', height: size[1]+'px'}">
    <el-upload class="avatar-uploader img-upload-btn"  :action="uploadUrl" :on-change="uploadChange" accept="image/*" :show-file-list="false" :auto-upload="false">
      <div class="avatar" v-if="imgSrc" :style="{backgroundImage: 'url('+imgSrc+')'}"></div>
      <i v-if="!imgSrc" class="el-icon-plus avatar-uploader-icon"></i>
      <i v-if="imgSrc" class="el-icon-circle-close close" @click.stop="delImgSrc"></i>
    </el-upload>
    <!-- 图片裁切 -->
    <img-crop v-if="imgCropObj.isShow" :imgCropObj="imgCropObj" @fCloseCrop="imgCropObj.isShow=false" @uploadSuccess="cropSuccess"></img-crop>
  </div>
</template>
<script>
import imgCrop from './imgCrop'
export default {
  name: 'imgUploadBtn',
  props: ['uploadUrl', 'size', 'imgSrc', 'imgSrcName'],
  data () {
    return {
      imgCropObj: { // 裁切对象
        isShow: false,
        imgUrl: '' // 图片路径
      }
    }
  },
  methods: {
    delImgSrc () {
      this.$emit('delImgSrc');
    },
    uploadChange (file, fileList) {
      console.log('file', file)
      if (file.raw.type != 'image/jpeg' && file.raw.type != 'image/png') {
        this.$message.warning('封面图仅支持jpg，jpeg及png格式!');
        return;
      }
      if (file.raw.size /1024 / 1024 > 5) {
        this.$message.warning('封面图最大支持5M!');
        return;
      }
      this.imgCropObj.imgUrl = this.getObjectURL(file.raw);
      this.imgCropObj.isShow= true;
    },
    getObjectURL (file) {
      let url = null;
      console.log('file', file)
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    cropSuccess (img) {
      this.$emit('changeImgSrc', img, this.imgSrcName);
      this.imgCropObj.isShow = false;
    }
  },
  mounted () {

  },
  components: {
    imgCrop
  }
}
</script>
<style lang="scss" scoped>
#create-create {
  .uploadWrap {
    display: inline-block;
    margin-right: 5px;
    .img-upload-btn {
      width: 100%;
      height: 100%;
    }
  }
}
.avatar{
  // background-size: cover;
  background: url('') no-repeat center/contain;
}
</style>
