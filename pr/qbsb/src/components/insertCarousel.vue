<template>
  <el-dialog :title="isEdit?'修改轮播标题封面':isView?'原始标题封面':'选入轮播'" class="insertCarousel" :visible.sync="showModel" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <el-form :model="insertForm" :rules="insertRules" ref="insertForm" label-width="100px" class="insert-form">
      <el-form-item label="轮播图片：" prop="cover">
        <div class="upload">
          <!-- 后面讲el-upload改成原生input,解决默认触发上传事件 -->
          <el-upload :disabled="isView" class="avatar-uploader" :action="''" ref="upload" :show-file-list="false" :on-success="successUpload" :on-change="uploadChange" :before-upload="beforeUpload" accept="image/*">
            <img v-if="insertForm.cover" :src="insertForm.cover" class="avatar" style="width:256px;height:128px;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="轮播标题：" prop="title">
        <p v-if="isView">{{insertForm.title}}</p>
        <el-input v-else type="text" v-model="insertForm.title"  placeholder="请输入轮播标题"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="beforeClose" v-if="!isView">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
    <img-crop v-if="imgCropObj.isShow" :imgCropObj="imgCropObj" @fCloseCrop="imgCropObj.isShow=false" @uploadSuccess="cropSuccess"></img-crop>
  </el-dialog>
</template>
<script>
import imgCrop from './imgCrop'; // 图片裁切
export default {
  name: 'insertCarousel',
  props: ['insertData'],
  components: {
    imgCrop
  },
  data () {
    var checkTitle = (rule, value, callback) => {
      if (!value || value.length <6) {
        callback(new Error('标题不能少于6个字'));
      } else {
        callback()
      }
    }
    return {
      showModel: false,
      host: apiHost,
      insertForm: {
        cover: '',
        title: ''
      },
      insertRules: {
        cover: [
          { required: true, message: '图片不能为空', trigger: 'blur'}
        ],
        title: [
          { validator: checkTitle, trigger: 'blur'}
        ]
      },
      imgCropObj: {
        isShow: false,
        imgUrl: '',
        size: [480, 240]
      },
      isEdit: false,
      isView: false
    }
  },
  methods: {
    beforeClose () {
      this.$emit('fClosePop');
    },
    successUpload () {

    },
    beforeUpload () {

    },
    uploadChange (file, fileList) {
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
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    submitForm () {
      if (this.isView) {
        this.$emit('fClosePop');
      } else {
        this.$refs['insertForm'].validate((valid) => {
          if (valid) {
            // alert('submit!');
            this.$emit('fConfirmInsert', {
              title: this.insertForm.title,
              cover: this.insertForm.cover
            });
          } else {
            return false;
          }
        });
      }
    },
    cropSuccess (img) {
      this.insertForm.cover = img;
      this.imgCropObj.isShow = false;
    }
  },
  created () {
    this.insertForm.title = this.insertData.title;
    this.insertForm.cover = this.insertData.cover;
    if (this.insertData.status) {
      if (this.insertData.status == 'view') {
        this.isView = true;
        this.insertRules = {};
      } else if (this.insertData.status == 'edit') {
        this.isEdit = true;
      }
    }
  },
  mounted () {
    this.showModel = true;
  }
}
</script>
<style lang="scss" scoped>

</style>
