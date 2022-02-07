<template>
  <div id="editCommunity">
    <el-dialog title="编辑社群" width="30%" top="30vh" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="closePop" :modal="true">
      <div class="content">
        <div class="item">
          <span class="label">社群名称：</span>
          <input class="searchBorder" placeholder="请输入社群名称" type="text" v-model="communityName" >
        </div>
        <div class="item">
          <span class="label">社群类型：</span>
          <span class="classWrap">
            <el-select v-model="communityClass">
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </span>
        </div>
        <div class="item" style="margin-top:16px;">
          <span class="label" style="vertical-align:top;line-height:20px;">社群简介：</span>
          <textarea class="searchBorder brief" placeholder="请填写社群简介" cols="30" rows="10" v-model="description"></textarea>
        </div>
        <div class="botBtns">
          <el-button  @click="closePop">取消</el-button>
          <el-button type="primary" class="btn" @click="confirmFun">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'editCommunity',
  props: ['editItem', 'typeList'],
  data () {
    return {
      communityName: '',
      communityClass: '',
      classList: [],
      description: '',
      dialogVisible: false
    }
  },
  methods: {
    closePop () {
      this.$emit('fCloseEdit');
    },
    confirmFun () {
      if (!this.communityName) {
        this.$message({type: 'warning', message: '请输入社群名称', showClose: true});
        return;
      }
      if (!this.communityClass) {
        this.$message({type: 'warning', message: '请选择社群类型', showClose: true});
        return;
      }
      if (!this.description) {
        this.$message({type: 'warning', message: '请填写社群简介', showClose: true});
      }
      this.$loading();
      this.$jqAjax({
        url: apiHost + '/community/edit',
        type: 'POST',
        data: {
          id: this.editItem.id,
          name: this.communityName,
          classId: this.communityClass,
          description: this.description
        },
        success: (res) => {
          this.$loading().close();
          if (res.code == 0) {
            this.$message({type: 'success', message: '编辑成功', showClose: true});
            this.$emit('fEditSuccess');
          } else {
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        },
        error: (err) => {
          this.$loading().close();
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    }
  },
  created () {
    this.classList = this.typeList;
    console.log('this.editItem', this.editItem);
    this.communityName = this.editItem.name;
    if (this.editItem.type) {
      for (let item of this.typeList) {
        if (this.editItem.type == item.name) {
          this.communityClass = item.id;
        }
      }
    }
    this.description = this.editItem.description;
  },
  mounted () {
    this.dialogVisible = true;
  }
}
</script>
<style lang="scss" scoped>
.content
  .item{
    // height: 50px;
    line-height: 50px;
    color: #000;
    .label {
      width: 70px;
      margin-right: 10px;
      text-align: right;
      display:inline-block;
    }
    .classWrap{
      width: 340px;
      display: inline-block;
    }
    .searchBorder {
      height: 24px;
      width: 340px;
      line-height: 24px;
      text-indent: 4px;
    }
    .brief {
      height: 80px;
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
