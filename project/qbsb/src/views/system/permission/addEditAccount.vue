<template>
  <el-dialog v-loading.lock="loading" :title="!!account_edit_row.id ? '编辑账号' : '新增账号'" :visible.sync="isShow" width="30%" :before-close="closePop">
    <div class="wrap">
      <el-form :model="account_operate_form" ref="account_operate_form" :validate-on-rule-change="false" :rules="account_operate_rules" label-width="110px">
        <el-form-item label="账号(手机号)" prop="username">
          <el-input type="text" v-model="account_operate_form.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="account_operate_form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="role">
          <el-select v-model="account_operate_form.role" multiple>
            <el-option v-for="list in role_list" :key="list.id" :value="list.id" :label="list.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="account_operate_form.status" :disabled="!account_edit_row.id">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="account_operate_form.password"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closePop">取 消</el-button>
      <el-button type="primary" @click="accountOperateDo('account_operate_form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'addEditAccount',
  data () {
    return {
      isShow: false,
      account_operate_form: {
        username: '',
        name: '',
        role: [],
        status: '',
        password: ''
      }
    }
  },
  computed: {
    account_operate_rules (){
      return {
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' },
          { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur'}
        ],
        role: [
          { required: false, message: '请选择角色类型', trigger: 'blur' }
        ],
        password: [
          { required: this.account_edit_row.id ? false: true, message: '请输入密码', trigger: 'blur'}, 
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur'}
        ]
      }
        
    }
  },
  methods: {
    closePop () {
      this.$emit('fCloseAddEdit');
    },
    accountOperateDo () {
      
    }
  },
  created () {
    this.isShow = true;
  }
}
</script>
<style lang="scss" scoped>

</style>
