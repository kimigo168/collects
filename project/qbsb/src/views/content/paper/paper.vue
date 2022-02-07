<template>
  <div id="paper">
    <div class="tab" v-model="tab_index">
      <el-tabs>
        <el-tab-pane label="待发布" name="0">
          <div class="content">
            <div class="operate clearfix">
              <div class="search">
                <el-form :inline="true" :model="paper_search_form_1">
                  <el-form-item label="时间">
                    <el-select v-model="paper_search_form_1.time">
                      <el-option label="最近7天" value="0"></el-option>
                      <el-option label="最近30天" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input type="text" v-model="paper_search_form_1.title" placeholder="标题"></el-input>
                  </el-form-item>
                  <el-form-item label="来源">
                    <el-input type="text" v-model="paper_search_form_1.source" placeholder="来源"></el-input>
                  </el-form-item>
                  <el-form-item label="姓名">
                    <el-input type="text" v-model="paper_search_form_1.username" placeholder="姓名"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn">
                <el-button type="primary" @click="addPaper">新增快报</el-button>
              </div>
            </div>
            <div class="table">
              <el-table
                  :data="paper_list_1"
                  style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="图片" width="">
                  <template slot-scope="scope">
                    <img :src="scope.row.imageUrl">
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="channel" label="摘要"></el-table-column>
                <el-table-column align="center" prop="channel" label="时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text">进入待发布</el-button>
                    <el-button type="text">直接发布</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="paper_page_totle_1 > 0">
              <el-pagination
                  @current-change="paperPageNumChange1"
                  :current-page.sync="paper_page_num_1"
                  :page-size="paper_page_size_1"
                  layout="prev, pager, next, jumper"
                  :total="paper_page_totle_1">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="新增快报" :visible.sync="add_edit_paper_visible" width="30%" :close-on-click-modal="false">
      <el-form :model="add_edit_paper_form" label-width="80px">
        <el-form-item label="快报图片">
          <div class="upload">
            <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="successUpload"
                :before-upload="beforeUpload">
              <img v-if="add_edit_paper_form.image_url" :src="add_edit_paper_form.image_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="快报标题">
          <el-input type="text" v-model="add_edit_paper_form.title"></el-input>
        </el-form-item>
        <el-form-item label="快报摘要">
          <el-input type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_edit_paper_visible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_index: 0,
        //待发布
        sub_tab_index_1: 0,
        paper_search_form_1: {
          time: "",
          title: "",
          source: "",
          name: "",
        },
        paper_list_1: [],
        paper_page_num_1: 1,
        paper_page_size_1: 10,
        paper_page_totle_1: 0,

        //新增-修改快报
        add_edit_paper_visible: false,
        add_edit_paper_form: {
          image_url: '',
          title: '',
        }

      }
    },
    created() {
      //待发布
      this.getPaperList(0,1)
    },
    methods: {
      //获取快报列表
      getPaperList(type, status) {
        var self = this;
        var data = {};
        if (type == 0) {
          if (status == 1) {
            data = {
              pageNum: self.paper_page_num_1,
              pageSize: self.paper_page_size_1,
              type: type,
              status: status,
              timeStart: !self.paper_search_form_1.date ? '' : self.paper_search_form_1.date[0],
              timeEnd: !self.paper_search_form_1.date ? '' : self.paper_search_form_1.date[1],
            }
          }
        }
        self.$ajax({
          url: '/newsflash/list',
          type: 'POST',
          data: data,
          success: function (res) {
            if(res.code == 0) {
              try {
                self.paper_list_1 = res.data.list;
              }catch (e) {
                
              }
            }
          },
          error: function (err) {

          }
        })
      },
      paperPageNumChange1(val) {
        this.paper_page_num_1 = val;
      },
      beforeUpload(file) {
      },
      successUpload(res, file) {
        this.add_edit_paper_form.image_url = URL.createObjectURL(file.raw);
      },

      //新增快报
      addPaper() {
        this.add_edit_paper_visible = true;
      },
      //修改快报
      editPaper(row) {
        this.add_edit_paper_visible = true;
      }
    }
  }
</script>

<style lang="scss">
  #paper {

  }
</style>
