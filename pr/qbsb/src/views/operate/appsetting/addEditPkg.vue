<template>
  <el-dialog v-loading.lock="loading" :title="isAdd?'新增':'修改'" :visible.sync="isShow" width="60%" :before-close="beforeCloseAdPanel">
    <el-form :model="add_update_form" :rules="rules" ref="add_update_form">
      <el-form-item prop="version">
        <el-input v-model="add_update_form.version" auto-complete="off" size="small" placeholder="请输入版本号" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item prop="updateinfo">
        <el-input type="textarea" :rows="5" v-model="add_update_form.update_info" auto-complete="off" placeholder="请输入更新内容(按回车键换行)" maxlength="100"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-select v-model="add_update_form.package_type_value" placeholder="请选择">
          <el-option v-for="item in package_type_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item>
        <el-input type="text" :disabled="!isAdd" v-model.number="add_update_form.version_code" placeholder="请输入安装包版本"></el-input>
        <p class="warning" v-if="isAdd">注意： 安装包code最小为 {{version_code_min}}</p>
      </el-form-item> -->
    </el-form>
    <div>
      <el-upload class="upload-demo" :action="apiHost + '/common/appUpload'" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-success="handleAvatarSuccess" :on-exceed="handleExceed" :on-change="handleChange"  :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传apk格式的文件</div>
      </el-upload>
    </div>
    <div class="dialog-footer" slot="footer">
      <el-button @click="$emit('fCloseAddEdit')" size="small">取 消</el-button>
      <el-button @click="confrimFun" type="primary">确 定</el-button>
    </div>
  </el-dialog>  
</template>
<script>
import sparkMd5 from 'spark-md5'
export default {
  name: 'addPkg',
  props: ['isAdd', 'editItem'],
  data () {
    return {
      add_update_form: {
        version: '',
        update_info: '',
        package_type_value: '',
        version_code: ''
      },
      package_type_list: [
        {label: '晶报', value: 1},
        {label: '主播', value: 2}
      ],
      version_code_min: 0,
      fileList: [],
      md5_file: '',
      file_url: '' ,
      apiHost: '',
      isShow: false,
      loading: false,
      rules: {
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur'}
        ],
        update_info: [
          { required: true, message: '请输入更新内容', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    beforeCloseAdPanel (done) {
      this.$emit('fCloseAddEdit');
      done();
    },
    beforeAvatarUpload (file) {
      var file_type = file.name.slice(file.name.lastIndexOf('.'));
      if (file_type == '.apk') {
        this.md5(file)
      } else {
        this.$message({
          type: 'warning',
          message: '上传文件格式只能为 apk',
          showClose: 'true',
        });
        return false;
      }
    },
    //对上传文件md5加密
    md5 (file) {
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      let chunkSize = 2097152;                             // Read in chunks of 2MB
      let chunks = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;
      let spark = new sparkMd5.ArrayBuffer();
      let fileReader = new FileReader();

      fileReader.onload = (ee) =>{
        spark.append(ee.target.result);
        currentChunk++;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          this.md5_file = spark.end();
        }
      }
      fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
      };

      function loadNext() {
        let start = currentChunk * chunkSize;
        let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }

      loadNext();
    },
    handleRemove () {
      this.file_url = '';
    },
    handleAvatarSuccess (res, file) {
      try {
        if (res.code == '0' && res.data.url) {
          this.file_url = res.data.url;
        } else {
          this.$message({type: 'error', message: '上传失败', showClose: true});
        }
        
      } catch (e) {
        console.log(e)
      }
    },
    handleExceed (files, fileList) {
      this.$message.warning("当前只支持上传一个文件，请先删除原有文件再重新上传");
    },
    handleChange (file, fileList) {},
    confrimFun () {
      if (!this.add_update_form.version) {
        this.$message({type: 'error', message: '请输入版本号', showClose: true});
        return;
      }
      if (!this.add_update_form.update_info) {
        this.$message({type: 'error', message: '请输入更新内容', showClose: true});
        return;
      }
      // this.file_url = 'sdfsfsdf11';
      if (!this.file_url) {
        this.$message({type: 'error', message: '请上传文件', showClose: true});
        return;
      }
      let sysuser = JSON.parse(sessionStorage.getItem('sysuser'));
      this.loading = true;
      let apiHost1 = 'http://172.16.36.112:8083/giiso-appkeeper-1.0.0'
      this.$.ajax({
        url: '/c-appkeeper'+ `${this.editItem?'/update':'/uploadPackage'}`,
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(
          {
            id: this.editItem?this.editItem.id:'',
            os: '0',
            type: '1',
            version: this.add_update_form.version,
            packageUrl: this.file_url,
            remark: this.add_update_form.update_info,
            filemd5: this.md5_file,
            createName: sysuser.name,
            appName: this.editItem?this.editItem.appName:'xmrb',
            appCode: this.editItem?this.editItem.appCode:'102',
            status: this.editItem?this.editItem.status:'0',
            // publishTime: this.editItem?this.editItem.publishTime:'',
            // versionCode: this.editItem?this.editItem.versionCode:'',
            force: this.editItem?this.editItem.force:'0'
          }
        ),
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.$message({type: 'success', message: `${this.isAdd?'新增':'修改'}成功！`});
            this.$emit('fSuccess');
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '操作失败', showClose: true});
        }
      });
    }
  },
  created () {
    // this.getPackageCode();
    if (!this.isAdd && this.editItem) { // 编辑
      this.add_update_form.version = this.editItem.version;
      this.add_update_form.update_info = this.editItem.remark;
      this.add_update_form.package_type_value = Number(this.editItem.type);
      this.file_url = this.editItem.packageUrl;
      this.add_update_form.version_code = this.editItem.versionCode;
      this.fileList = [{name: this.editItem.packageUrl, url: this.editItem.packageUrl}];
      this.md5_file = this.editItem.filemd5;
    } else {

    }
  },
  mounted () {
    this.apiHost = apiHost;
    this.isShow = true;
  }
}
</script>
<style lang="scss" scoped>

</style>
