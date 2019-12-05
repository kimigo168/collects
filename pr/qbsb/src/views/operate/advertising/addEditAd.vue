<template>
  <el-dialog v-loading.lock="loading" :title="isAdd?'新建广告':'编辑广告'" :visible.sync="showModel" top="10vh" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeCloseAdPanel">
    <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-addForm">
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入广告名称"></el-input>
      </el-form-item>
      <el-form-item label="广告链接" prop="link">
        <el-input v-model="addForm.link" placeholder="请输入广告链接"></el-input>
      </el-form-item>
      <el-form-item label="广告标签" prop="tag">
        <el-input v-model="addForm.tag" placeholder="选填，请输入广告标签（标签以逗号隔开，每个标签限6个字符，最多5个标签）"></el-input>
      </el-form-item>
      <el-form-item label="广告类型" prop="classify">
        <el-select v-model="addForm.classify" @change="selectOption($event, 3)">
          <el-option label="启动页广告" value="0"></el-option>
          <el-option label="频道信息流广告" value="1"></el-option>
          <el-option label="轮播广告" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放频道" v-if="addForm.classify==1||addForm.classify==2">
        <el-select v-model="parentChannel" @change="selectOption($event, 1)">
          <el-option v-for="(item, index) in parentChannelList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放子频道" v-if="addForm.classify==1||addForm.classify==2">
        <el-select v-model="childChannel" @change="selectOption($event, 2)">
          <el-option v-for="(item, index) in childChannelList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告图片" prop="imgUrl">
        <div class="avatar-uploader" :class="{'emptyImg':!tempImgUrl}" @click="selectBefore">
          <input title=" " v-if="addForm.classify!==''" type="file" id="uploadImage" class="upload-input" @change="triggerFile"  accept="image/*" />
          <div v-if="tempImgUrl" class="avatar">
            <img class="previewImg" :src="tempImgUrl" :style="{height:addForm.classify=='0'?'100%':'auto',width:addForm.classify=='0'?'auto':'100%'}" alt="">
          </div>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <p style="line-height:24px;margin-top:4px;font-size:12px;">广告图最大支持5M，支持jpg、jpeg、png及gif</p>
        <p style="line-height:20px;font-size:12px;">尺寸：{{sizeTips}}</p>
      </el-form-item>
      <el-form-item>
        <el-button style="width:80px;" type="primary" @click="submitForm(0)">保存</el-button>
        <!-- <el-button style="width:80px;" type="primary" @click="submitForm(1)">发布</el-button> -->
        <el-button style="width:80px;" @click="$emit('fCloseEdit')">取消</el-button>
      </el-form-item>
    </el-form>
    <img-crop-pop v-if="imgCropObj.show" :adType="addForm.classify" :imgCropObj="imgCropObj" @fCloseCrop="imgCropObj.show=false" @uploadSuccess="uploadSuccess"></img-crop-pop>
  </el-dialog>
</template>
<script>
import imgCropPop from './imgCropPop' // 图片预览弹出
export default {
  name: 'addEditAd',
  props: ['isAdd','articleForm', 'editItem','tabIdx'],
  data () {
    return {
      showModel: false,
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        link: [
          { required: false, message: '请输入广告链接', trigger: 'blur' },
        ],tag: [
          { required: false, message: '请输入广告标签', trigger: 'blur' },
        ],classify: [
          { required: true, message: '请选择广告类型', trigger: 'blur' },
        ],imgUrl: [
          { required: true, message: '请选择广告图片', trigger: 'blur' },
        ]
      },
      addForm: {
        name: '',
        link: '',
        tag: '',
        classify: '0',
        imgUrl: ''
      },
      tempImgUrl: '',
      imgCropObj: {
        show: false,
        imgUrl: ''
      },
      parentChannelList: [],
      childChannelList: [],
      childChannel: '',
      parentChannel: '',
      sizeTips: '750X1080',
      uploadUrl: apiHost+'/common/upload',
      loading: false,
    }
  },
  methods: {
    selectBefore () {
      if (!this.addForm.classify) {
        this.$message({type: "error",message: `请先选择广告类型`,showClose: 'true',})
        return;
      }
    },
    handleAvatarSuccess(res, file) {
      this.addForm.imgUrl = res.data.url;
    },
    beforeAvatarUpload(file) {
      if (file.size / 1024 / 1024 > 5) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return false;
      }
    },
    submitForm(type) {
      let self = this;
      let sysuser = JSON.parse(sessionStorage.getItem('sysuser'));
      let questUrl = this.isAdd ? '/advertisement/add':'/advertisement/update'
      this.$refs.addForm.validate((valid) => {
        if (valid) {
            this.$ajax({
              url: questUrl,
              type: 'POST',
              data: {
                channelId: this.addForm.classify == 0 ? '' : this.parentChannel,
                sonChannelId: this.addForm.classify == 0 ? '' : this.childChannel,
                createId: sysuser.id, // 创建人
                createTime: new Date().format('YYYY-MM-DD hh:mm:ss'),
                desc: '',
                image: this.addForm.imgUrl,
                label: this.addForm.tag, // 标签
                status: (this.tabIdx == 0||this.tabIdx == 1)?type:this.tabIdx == 2?type == 0 ? 2 : 1 :'', // 0：待发布，1：已发布，2：已下架
                title: '',
                type: this.addForm.classify, // 广告类型
                url: this.addForm.link, // 链接
                name: this.addForm.name, // 名称
                id: !this.isAdd ? this.editItem.id:'' // 编辑传id
              },
              success (res) {
                if (res.code == 0) {
                  self.$message({
                    type: "success",
                    message: `${type == 0?'保存':'发布'}成功`,
                    showClose: 'true',
                  })
                  self.$emit('fRefreshList');
                }
              }
            })
          
          // 刷新数据
        } else {
          return false;
        }
      });
    },
    beforeCloseAdPanel (done) {
      this.$emit('fCloseEdit')
      done();
    },
    triggerFile (e) {
      let self = this;
      let file = e.target.files[0];
      e.target.value = '';
      if (file.size / 1024 / 1024 > 5) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return false;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        let image = new Image();
        image.src = res.target.result;
        image.onload = function () { // 判断尺寸是否符合
          if ((self.addForm.classify == '0' && this.width == 750 && this.height == 1080) || (self.addForm.classify == '1' && this.width == 690 && this.height == 364) || (self.addForm.classify == '2' && this.width == 750 && this.height == 364)) {
            self.uploadImg(file); // 上传
          } else {
            self.$message({type: 'warning', message: '图片尺寸不符，请重新选择',showClose: true});
          }
        }
      } 
      // 原来需打开裁切，现去掉
      // this.imgCropObj.imgUrl = this.getObjectURL(file);
      // this.imgCropObj.show = true;
    },
    uploadImg (file) {
      let formData = new FormData();
      formData.append("file", file);
      this.loading = true;
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
            this.tempImgUrl = res.data.url;
            this.addForm.imgUrl = res.data.url;
          } else {
            this.$message({ showClose: true, message: '图片上传失败,请重试', type: 'error'});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({ showClose: true, message: '图片上传失败,请重试', type: 'error'});
        } 
      });
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
    },
    selectOption (e, type) {
      if (type == 1) {
        this.childChannel = '';
        this.childChannelList = [];
        if (e != '') {
          this.getChannelList(1, 0, e);
        }
      } else if (type == 3) {
        this.childChannel = '';
        this.childChannelList = [];
        // 显示提示
        if (this.addForm.classify == '0') {
          this.sizeTips = '750X1080';
        } else if (this.addForm.classify == '1') {
          this.sizeTips = '690X364';
        } else {
          this.sizeTips = '750X364';
        }
      }
    },
    getChannelList (queryType, type, pid, isInit) {
      let data = {};
        if (pid)  data = { pid: pid }
        this.$jqAjax({
          url: apiHost + `/user/${type==0?'getNewsChannel':'getVideoChannel'}`,
          data: data,
          success: (res) => {
            if (res.code == '0' && res.data) {
              let data = res.data;
              if (pid) {
                this.childChannelList = res.data;
                if (isInit) {
                  for (let item of data) {
                    if (item.name == this.editItem.sonChannelName) {
                      this.childChannel = item.id;
                    }
                  }
                }
              } else {
                this.parentChannelList = res.data;
                if (this.editItem && this.editItem.channelName) {
                  for(let item of data) {
                    if (item.name == this.editItem.channelName) {
                      this.parentChannel = item.id;
                      this.getChannelList(1, 0, item.id, true); // 请求子频道
                    }
                  }
                } else {
                  this.parentChannel = data[0].id;
                }
              }
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        });
    }
  },
  created () {
    this.getChannelList(0, 0);
    setTimeout(() => {
      this.showModel = true;
    },0);
    if (!this.isAdd && this.editItem) {
      this.addForm.name = this.editItem.name;
      this.addForm.tag = this.editItem.label;
      this.addForm.link = this.editItem.url;
      this.addForm.classify = this.editItem.type;
      this.addForm.imgUrl = this.editItem.image;
      this.tempImgUrl = this.editItem.image;
    }
  },
  components: {
    imgCropPop
  }
}
</script>
<style lang="scss" scoped>
  .avatar-uploader{
    border: 1px solid #ddd;
    .upload-input{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      opacity: 0;
    }
    
    .avatar{
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      .previewImg {
        width: auto;
        height: auto;
      }
    }
  }
  .emptyImg:hover{
    border: 1px solid #4D7CFE;
  }
  
</style>
