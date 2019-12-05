<template>
  <div id="role">
    <div class="tab" v-model="tab_index">
      <el-tabs>
        <el-tab-pane label="组织管理" name="0">
          <div class="content">
            <!--<div class="operate">-->
              <!--<div class="btn">-->
                <!--<el-button type="primary" @click="">新增角色</el-button>-->
              <!--</div>-->
            <!--</div>-->
            <div class="table">
              <el-table
                :data="role_list"
                style="width: 100%">
                <el-table-column align="center" prop="title" label="角色类型"></el-table-column>
                <el-table-column align="center" prop="author" label="角色描述"></el-table-column>
                <el-table-column align="center" prop="subChannel" label="状态"></el-table-column>
                <el-table-column align="center" prop="channel" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <p>
                      <el-button type="text" class="wran-color">频道分配</el-button>
                      <el-button type="text" class="wran-color">编辑</el-button>
                    </p>
                    <p>
                      <el-button type="text" class="danger-color">删除</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="role_page_totle > 0">
              <el-pagination
                @current-change="rolePageNumChange"
                :current-page.sync="role_page_num"
                :page-size="role_page_size"
                layout="prev, pager, next, jumper"
                :total="role_page_totle">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_index: 0,
        role_list: [
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            subChannel: '家常菜',
            isRecommond: 0,
            createTime: "2019-02-21 08:31:58",
          },
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            subChannel: '家常菜',
            isRecommond: 0,
            createTime: "2019-02-21 08:31:58",
          },
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            subChannel: '家常菜',
            isRecommond: 0,
            createTime: "2019-02-21 08:31:58",
          },
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            subChannel: '家常菜',
            isRecommond: 0,
            createTime: "2019-02-21 08:31:58",
          },
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            subChannel: '家常菜',
            isRecommond: 0,
            createTime: "2019-02-21 08:31:58",
          },
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            subChannel: '家常菜',
            isRecommond: 0,
            createTime: "2019-02-21 08:31:58",
          },
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            subChannel: '家常菜',
            isRecommond: 0,
            createTime: "2019-02-21 08:31:58",
          },
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            subChannel: '家常菜',
            isRecommond: 0,
            createTime: "2019-02-21 08:31:58",
          },

        ],
        role_page_num: 1,
        role_page_size: 10,
        role_page_totle: 0,
      }
    },
    methods: {
      rolePageNumChange(val) {
        this.role_page_num = val;
      }
    }
  }
</script>

<style lang="scss">
  #role {

  }
</style>
