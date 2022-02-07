<template>
  <div id="u-info-setting">
    <div class="container">
      <div class="content-path">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="user-info">
        <div class="info-head">
          <span></span>
          <p>基础资料</p>
        </div>
        <div class="user-head">
          <span>头像</span>
          <div class="avatar-wrap">
            <img-upload :size="[60,60]" :imgSrc="userData.imgUrl" @changeImgSrc="uploadBack"></img-upload>
          </div>
        </div>
        <el-form ref="form" :model="userData" label-width="80px">
          <el-form-item label="昵称">
            <el-input v-model="userData.name"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userData.sex">
              <el-radio label="男" ></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="领域">
            <el-input v-model="userData.description" placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="地区" class="area-select">
            <pca-select :area="userData.area" @selectBack="selectBack"></pca-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn" @click="updateInfo">
        <input type="button" value="更新资料" />
      </div>
      <div class="pwd-setting">
        <div class="info-head">
          <span></span>
          <p>设置密码</p>
        </div>
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="110px"
          class="demo-ruleForm"
          :rules="ruleForm_rules"
        >
          <el-form-item label="原密码" prop="pass">
            <el-input type="password" v-model="ruleForm.old_pwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="再次输入新密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn">
        <input type="button" value="更新资料" @click="updatePwd('ruleFrom')"/>
      </div>
    </div>
  </div>
</template>

<script>
import pcaSelect from '@/components/pcaSelect' // 省市区三级联动
import imgUpload from '@/components/imgUpload' // 图片上传
import MD5 from 'md5'
import { mapMutations } from 'vuex'
export default {
  name: 'setting',
  data () {
    return {
      userData: {
        name: '',
        description: '',
        area: '',
        sex: '男',
        imgUrl: ''
      },
      ruleForm: {
        pwd: '',
        old_pwd: '',
        checkPass: ''
      },
      ruleForm_rules: {
        old_pwd: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
        ]
      },
      imageUrl: '',
      uploadUrl: 'http://172.16.1.21:8080/c-userportal/loginV2/upload_image'
    }
  },
  components: {
    pcaSelect,
    imgUpload
  },
  methods: {
    ...mapMutations(['UPDATE_USERINFO']),
    updateInfo () {
      if (!this.userData.name) {
        this.$message({ type: 'warning', message: '请输入昵称', showClose: true })
        return
      }
      if (!this.userData.description) {
        this.$message({ type: 'warning', message: '请输入领域', showClose: true })
        return
      }
      if (!this.userData.area) {
        this.$message({ type: 'warning', message: '请输入地区', showClose: true })
        return
      }
      this.$axios
        .post(this.$global.API.updateUserInfo, this.$qs.stringify({
          nickName: this.userData.name,
          description: this.userData.description,
          sex: this.userData.sex === '男' ? '0' : '1',
          area: this.userData.area,
          birthday: ''
        }))
        .then(res => {
          // console.log('update', res)
          if (res.code === '0') {
            this.$message({ type: 'success', message: '更新成功', showClose: true })
            this.getUserInfo()
          }
        })
      this.$axios.post(this.$global.API.saveUserAvatar,
        this.$qs.stringify({
          headImg: this.userData.imgUrl
        })
      ).then((res) => {
        if (res.code === '0') {
          // this.$message({ type: 'success', message: '头像更换成功' })
        }
      })
    },
    // 修改密码
    updatePwd (formName) {
      if (!this.ruleForm.old_pwd) {
        this.$message({ type: 'warning', message: '请输入原密码', showClose: true })
        return
      }
      if (!this.ruleForm.pwd) {
        this.$message({ type: 'warning', message: '请输入新密码', showClose: true })
        return
      }
      if (!this.ruleForm.checkPass) {
        this.$message({ type: 'warning', message: '请确认新密码', showClose: true })
        return
      }
      if (this.ruleForm.checkPass === this.ruleForm.pwd) {
        this.$axios
          .post(this.$global.API.resetPwd, this.$qs.stringify(
            {
              oldPassword: MD5(this.ruleForm.old_pwd),
              password: MD5(this.ruleForm.pwd)
            }
          ))
          .then(res => {
            if (res.code === '0') {
              this.$message({ type: 'success', message: '更新成功', showClose: true })
              this.ruleForm.old_pwd = ''
              this.ruleForm.pwd = ''
              this.ruleForm.checkPass = ''
            }
            if (res.code === 'OLD_PWD_WRONG') {
              this.$message({ type: 'error', message: res.msg, showClose: true })
            }
          })
      } else {
        this.$message({ type: 'warning', message: '新旧密码不一致', showClose: true })
      }
    },
    selectBack (val) {
      this.userData.area = val
    },
    uploadBack (val) {
      this.userData.imgUrl = val
      // this.$axios.post(this.$global.API.saveUserAvatar,
      //   this.$qs.stringify({
      //     headImg: val
      //   })
      // ).then((res) => {
      //   if (res.code === '0') {
      //     this.$message({ type: 'success', message: '头像更换成功' })
      //   }
      // })
    },
    getUserInfo () {
      this.$axios.post(this.$global.API.userInfo).then((res) => {
        if (res.code === '0' && res.data) {
          let data = res.data
          this.userData.imgUrl = data.headimgUrl
          this.userData.name = data.nikeName
          this.userData.sex = data.sex
          this.userData.description = data.description
          this.userData.area = data.area
          this.UPDATE_USERINFO(res.data)
        }
      })
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
#u-info-setting {
  width: 100%;
  height: 100%;
  background: rgba(244, 244, 244, 1);
  padding-top: 119px;
  .container {
    width: 1200px;
    min-height: 880px;
    background: rgb(255, 255, 255);
    margin: 0 auto;
    padding: 40px 84px 0px;
    .user-info {
      padding: 25px 0;
      margin-right: 2px;
      border-bottom: 1px solid #ededed;
      .user-head {
        width: 100%;
        height: 60px;
        margin-top: 18px;
        position: relative;
        span {
          width: 68px;
          text-align: right;
          display: inline-block;
          height: 100%;
          line-height: 60px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
        // .head-img {
        //   position: absolute;
        //   left: 129px;
        // }
        .avatar-uploader {
          display: inline-block;
          border-radius: 50%;
          background: #F4F4F4;
          .avatar-uploader .el-upload {
            border: 1px dashed #F4F4F4;
            border-radius: 50%;;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
          }
          .avatar-uploader-icon {
            font-size: 20px;
            color: #8c939d;
            width: 60px;
            height: 60px;
            line-height: 60px;
            text-align: center;
          }
          .avatar {
            width: 178px;
            height: 178px;
            display: block;
          }
        }
        .avatar-wrap {
          height: 60px;
          width: 60px;
          border: 1px solid #E4E4E4;
          border-radius: 50%;
          position: absolute;
          left: 129px;
          top: 0;
        }
      }
    }
    .btn {
      width: 100%;
      height: 78px;
      position: relative;
      input {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        padding: 5px 22px;
        width: 100px;
        height: 30px;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        background-color: #0a97ed;
        border-radius: 2px;
      }
    }
    .info-head {
      height: 22px;
      span {
        display: inline-block;
        width: 4px;
        height: 20px;
        background: rgba(10, 151, 237, 1);
        border-radius: 3px;
        vertical-align: middle;
        margin-right: 8px;
      }
      p {
        display: inline-block;
        height: 22px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 22px;
      }
    }
    .el-form {
      margin-top: 25px;
      .el-form-item {
        margin-bottom: 30px;
        .el-form-item__label {
          text-align: left;
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          width: 120px !important;
        }
        .el-form-item__content {
          margin-left: 129px !important;
          .el-input {
            width: 301px;
            height: 30px;
            .el-input__inner {
              background: rgba(244, 244, 244, 1);
              border-radius: 2px;
              border: 1px solid rgba(228, 228, 228, 1);
              height: 30px;
              line-height: 30px;
            }
            .el-input__icon {
              line-height: 30px !important;
            }
          }
        }
      }
      .area-select {
        margin-bottom: 0 !important;
      }
    }
    .pwd-setting {
      padding-bottom: 25px;
      border-bottom: 1px solid #ededed;
    }
  }
}
</style>
