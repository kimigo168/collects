<template>
  <div id="addEdit" v-loading.lock="loading">
    <el-dialog :title="isAdd?'新增服务':'修改'" width="30%" top="30vh" :visible.sync="dialogVisible" class="popBox" :before-close="handleClose" :modal="true">
      <div class="content">
        <div class="item">
          <span class="label">服务名称：</span> <input placeholder="必填" type="text" class="searchBorder" v-model="serviceName">
        </div>
        <div class="item">
          <span class="label">服务链接：</span>  <input placeholder="必填" type="text" class="searchBorder" v-model="serviceLink">
        </div>
        <div class="item">
          <span class="label">类别：</span> 
          <span class="classWrap">
            <el-select v-model="serviceClassify">
              <el-option v-for="(item, index) in categoryList" :key="index" :label="item.data.name" :value="item.data.name"></el-option>
            </el-select>
          </span>
        </div>
        <div class="item itemUpload">
          <span class="label" style="height:20px;line-height:20px;vertical-align:top;">服务图标：</span>
          <div class="uploadWrap" :class="{'emptyImg':!tempImgUrl, 'noBorder': tempImgUrl}">
            <input title=" " type="file" id="uploadImage" class="upload-input" @change="triggerFile"  accept="image/jpeg, image/png, image/jpg" />
            <div v-if="tempImgUrl" class="avatar">
              <img class="previewImg" :src="tempImgUrl" style="width:100%;height:100%;border-radius:50%;over-flow:hidden;" alt="">
            </div>
            <i v-else style="width:100%;height:100%;" class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
        <div class="tips">
          <p v-if="tempImgUrl">点击图标进行更换</p> 
        </div>
        <div class="botBtns">
          <el-button  @click="$emit('fCloseAdd')">取消</el-button>
          <el-button type="primary" class="btn" @click="confrimAdd">{{isAdd?'上架服务': '确认'}}</el-button>
        </div>
      </div>
        <img-crop-pop v-if="imgCropObj.show" :imgCropObj="imgCropObj" @fCloseCrop="imgCropObj.show=false" @uploadSuccess="uploadSuccess"></img-crop-pop>
    </el-dialog>
  </div>
</template>
<script>
import imgCropPop from '../../operate/advertising/imgCropPop' // 图片预览弹出
export default {
  name: 'addEditService',
  props: ['isAdd', 'serviceData', 'categoryList'],
  data () {
    return {
      dialogVisible: false,
      serviceName: '',
      serviceLink: '',
      serviceClassify: '', // 服务类别
      tempImgUrl: '', // 临时上传文件路径
      addForm: {
        classify: '0',
        imgUrl: ''
      },
      imgCropObj: { // 裁切图片对象
        imgUrl: '',
        show: false,
        fixedNumber: [100, 100],
        isServiceIcon: true // 表示是服务图标
      },
      loading: false,
      selectCategoryId: ''
    }
  },
  components: {
    imgCropPop
  },
  methods: {
    handleClose () {
      this.$emit('fCloseAdd');
    },
    triggerFile (e) {
      let file = e.target.files[0];
      if (!file) return;
      if (file.size / 1024 / 1024 > 5) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return false;
      }
      this.imgCropObj.imgUrl = this.getObjectURL(file);
      this.imgCropObj.show = true;
    },
    confrimAdd () {
      this.categoryList.forEach((item) => {
        if (item.data.name == this.serviceClassify) {
          this.selectCategoryId = item.data.id;
        }
      });
      if (!this.serviceName) {
        this.$message({type: 'error', message: '请填写服务名称', showClose: true});
        return;
      }
      if (!this.serviceLink) {
        this.$message({type: 'error', message: '请填写服务链接', showClose: true});
        return;
      }
      if (!this.serviceClassify) {
        this.$message({type: 'error', message: '请选择服务类别', showClose: true});
        return;
      }
      this.loading = true;
      if (this.isAdd) { // 上架服务
        this.$ajax({
          url:'/lifeServer/add',
          type: 'POST',
          data: {
            icon: this.tempImgUrl,
            name: this.serviceName,
            url: this.serviceLink,
            categoryId: this.selectCategoryId
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({ type: 'success', message: '新增成功', showClose: true});
              this.$emit('fAddEditSuccess');    
            } else {
              this.$message({ type: 'error', message: '操作失败', showClose: true});   
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({ type: 'error', message: '操作失败', showClose: true});            
          }
        });
      } else { // 确认修改
        this.$ajax({
          url: '/lifeServer/update',
          type: 'POST',
          data: {
            id: this.serviceData.id,
            icon: this.tempImgUrl,
            name: this.serviceName,
            url: this.serviceLink,
            categoryId: this.selectCategoryId
          },
          success: (res) => {
            if (res.code == 0) {
              this.$message({ type: 'success', message: '编辑成功', showClose: true});
              this.$emit('fAddEditSuccess');  
            } else {
              this.$message({ type: 'error', message: '操作失败', showClose: true});  
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({ type: 'error', message: '操作失败', showClose: true});  
          }
        });
      }
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
    },
    uploadSuccess (img) {
      this.tempImgUrl = img;
      this.addForm.imgUrl = img;
      this.imgCropObj.show = false;
    }
  },
  created () {
    this.categoryList.forEach((item, index) => {
      if (this.serviceData && item.data.name == this.serviceData.cName) {
        this.serviceClassify = this.serviceData.cName;
        this.selectCategoryId = item.data.id;
        console.log('匹配')
      }
    });
  },
  mounted () {
    this.dialogVisible = true;
    console.log('serviceData', this.serviceData);
    if (!this.isAdd && this.serviceData) { // 编辑
      this.tempImgUrl = this.serviceData.icon;
      this.serviceName = this.serviceData.name;
      this.serviceLink = this.serviceData.url;
    }
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
    .uploadWrap {
      height: 80px;
      width: 80px;
      display: inline-block;
      position: relative;
      border: 1px solid rgba(121, 121, 121, 1);
      .upload-input{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        opacity: 0;
      }

      .el-icon-plus:before{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .emptyImg:hover{
      border: 1px solid #4D7CFE;
    }
    .noBorder {
      border: 0;
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
#layout .right .content .uploadWrap .avatar{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .previewImg {
    width: auto;
    height: auto;
  }
}
.botBtns{
    margin: 30px 0 20px 0;
    display: flex;
    justify-content: center;
    .btn {
      margin-left: 40px;
    }
  }
  
</style>

