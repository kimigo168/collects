<template>
  <div id="edit">
    <div class="tab" v-model="tab_index">
      <el-tabs>
        <el-tab-pane label="待审核" name="0">
          <div class="content">
            <div class="sub-tab">
              <el-radio-group v-model="sub_tab_index_1">
                <el-radio-button label="1">文章</el-radio-button>
                <el-radio-button label="2">视频</el-radio-button>
              </el-radio-group>
            </div>
            <div v-show="sub_tab_index_1 == 1">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="article_search_form_1">
                    <el-form-item>
                      <el-select v-model="article_search_form_1.time" placeholder="时间">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="article_search_form_1.channel" placeholder="频道">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="article_search_form_1.column" placeholder="栏目">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input type="text" v-model="article_search_form_1.title" placeholder="标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-input type="text" v-model="article_search_form_1.author" placeholder="作者"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="table">
                <el-table
                  :data="article_list_1"
                  style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                  <el-table-column align="center" prop="imageUrl" label="封面" width="">
                    <template slot-scope="scope">
                      <img :src="scope.row.imageUrl">
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="author" label="作者"></el-table-column>
                  <el-table-column align="center" prop="channel" label="频道"></el-table-column>
                  <el-table-column align="center" prop="subChannel" label="子频道"></el-table-column>
                  <el-table-column align="center" prop="isRecommond" label="是否推荐">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isRecommond == 0">否</span>
                      <span v-if="scope.row.isRecommond == 1">是</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                      <p>
                        <el-button type="text">送审</el-button>
                        <el-button type="text" class="wran-color">修改</el-button>
                      </p>
                      <p>
                        <el-button type="text" class="danger-color">打回</el-button>
                        <el-button type="text">修改记录</el-button>
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="article_page_totle_1 > 0">
                <el-pagination
                  @current-change="articlePageNumChange1"
                  :current-page.sync="article_page_num_1"
                  :page-size="article_page_size_1"
                  layout="prev, pager, next, jumper"
                  :total="article_page_totle_1">
                </el-pagination>
              </div>
            </div>
            <div v-show="sub_tab_index_1 == 2">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="video_search_form_1">
                    <el-form-item>
                      <el-select v-model="video_search_form_1.time" placeholder="时间">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="video_search_form_1.channel" placeholder="频道">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input type="text" v-model="video_search_form_1.title" placeholder="标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-input type="text" v-model="video_search_form_1.author" placeholder="作者"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="table">
                <el-table
                  :data="video_list_1"
                  style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                  <el-table-column align="center" prop="imageUrl" label="封面" width="">
                    <template slot-scope="scope">
                      <img :src="scope.row.imageUrl">
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="author" label="作者"></el-table-column>
                  <el-table-column align="center" prop="channel" label="频道"></el-table-column>
                  <el-table-column align="center" prop="isRecommond" label="是否推荐">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isRecommond == 0">否</span>
                      <span v-if="scope.row.isRecommond == 1">是</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="videoSize" label="视频大小"></el-table-column>
                  <el-table-column align="center" prop="videoTime" label="视频时长"></el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                      <p>
                        <el-button type="text">送审</el-button>
                        <el-button type="text" class="wran-color">修改</el-button>
                      </p>
                      <p>
                        <el-button type="text" class="danger-color">打回</el-button>
                        <el-button type="text">修改记录</el-button>
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="video_page_totle_1 > 0">
                <el-pagination
                  @current-change="videoPageNumChange1"
                  :current-page.sync="video_page_num_1"
                  :page-size="video_page_size_1"
                  layout="prev, pager, next, jumper"
                  :total="video_page_totle_1">
                </el-pagination>
              </div>
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="1">
          <div class="content">
            <div class="sub-tab">
              <el-radio-group v-model="sub_tab_index_2">
                <el-radio-button label="1">文章</el-radio-button>
                <el-radio-button label="2">视频</el-radio-button>
              </el-radio-group>
            </div>
            <div v-show="sub_tab_index_2 == 1">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="article_search_form_2">
                    <el-form-item>
                      <el-select v-model="article_search_form_2.time" placeholder="时间">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="article_search_form_2.channel" placeholder="频道">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="article_search_form_2.column" placeholder="栏目">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="article_search_form_2.status" placeholder="状态">
                        <el-option label="打回" value="0"></el-option>
                        <el-option label="通过" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input type="text" v-model="article_search_form_2.title" placeholder="标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-input type="text" v-model="article_search_form_2.author" placeholder="作者"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="table">
                <el-table
                  :data="article_list_2"
                  style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                  <el-table-column align="center" prop="imageUrl" label="封面" width="">
                    <template slot-scope="scope">
                      <img :src="scope.row.imageUrl">
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="author" label="作者"></el-table-column>
                  <el-table-column align="center" prop="channel" label="频道"></el-table-column>
                  <el-table-column align="center" prop="subChannel" label="子频道"></el-table-column>
                  <el-table-column align="center" prop="isRecommond" label="是否推荐">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isRecommond == 0">否</span>
                      <span v-if="scope.row.isRecommond == 1">是</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <el-table-column align="center" prop="status" label="状态"></el-table-column>
                  <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                      <p>
                        <el-button type="text">操作记录</el-button>
                      </p>

                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="article_page_totle_2 > 0">
                <el-pagination
                  @current-change="articlePageNumChange2"
                  :current-page.sync="article_page_num_2"
                  :page-size="article_page_size_2"
                  layout="prev, pager, next, jumper"
                  :total="article_page_totle_2">
                </el-pagination>
              </div>
            </div>
            <div v-show="sub_tab_index_2 == 2">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="video_search_form_2">
                    <el-form-item>
                      <el-select v-model="video_search_form_2.time" placeholder="时间">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="video_search_form_2.channel" placeholder="频道">
                        <el-option label="最近7天" value="0"></el-option>
                        <el-option label="最近30天" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="video_search_form_2.status" placeholder="状态">
                        <el-option label="打回" value="0"></el-option>
                        <el-option label="通过" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input type="text" v-model="video_search_form_2.title" placeholder="标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-input type="text" v-model="video_search_form_2.author" placeholder="作者"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="table">
                <el-table
                  :data="video_list_2"
                  style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                  <el-table-column align="center" prop="imageUrl" label="封面" width="">
                    <template slot-scope="scope">
                      <img :src="scope.row.imageUrl">
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="author" label="作者"></el-table-column>
                  <el-table-column align="center" prop="channel" label="频道"></el-table-column>
                  <el-table-column align="center" prop="isRecommond" label="是否推荐">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isRecommond == 0">否</span>
                      <span v-if="scope.row.isRecommond == 1">是</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="videoSize" label="视频大小"></el-table-column>
                  <el-table-column align="center" prop="videoTime" label="视频时长"></el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                      <p>
                        <el-button type="text">操作记录</el-button>
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="video_page_totle_2 > 0">
                <el-pagination
                  @current-change="videoPageNumChange2"
                  :current-page.sync="video_page_num_2"
                  :page-size="video_page_size_2"
                  layout="prev, pager, next, jumper"
                  :total="video_page_totle_2">
                </el-pagination>
              </div>
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
        //待审核
        //文章
        sub_tab_index_1: 0,
        article_search_form_1: {
          time: "",
          channel: "",
          column: "",
          title: "",
          author: "",
        },
        article_list_1: [
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
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_totle_1: 0,

        //视频
        sub_tab_index_1: 1,
        video_search_form_1: {
          time: "",
          channel: "",
          title: "",
          author: "",
        },
        video_list_1: [
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            isRecommond: 0,
            videoSize: "30M",
            videoTime: "2:05",
            createTime: "2019-02-21 08:31:58",
          },

        ],
        video_page_num_1: 1,
        video_page_size_1: 10,
        video_page_totle_1: 0,


        //已审核
        //文章
        sub_tab_index_2: 0,
        article_search_form_2: {
          time: "",
          channel: "",
          column: "",
          status: "",
          title: "",
          author: "",
        },
        article_list_2: [
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
        article_page_num_2: 1,
        article_page_size_2: 10,
        article_page_totle_2: 0,

        //视频
        sub_tab_index_2: 1,
        video_search_form_2: {
          time: "",
          channel: "",
          status: "",
          title: "",
          author: "",
        },
        video_list_2: [
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            title: '西红柿炒蛋这样做才好吃',
            author: '孙悟空',
            channel: '要闻',
            isRecommond: 0,
            videoSize: "30M",
            videoTime: "2:05",
            createTime: "2019-02-21 08:31:58",
          },

        ],
        video_page_num_2: 1,
        video_page_size_2: 10,
        video_page_totle_2: 0,
      }
    },
    methods: {
      articlePageNumChange1(val) {
        this.article_page_num_1 = val;
      },
      articlePageNumChange2(val) {
        this.article_page_num_2 = val;
      },
      videoPageNumChange1(val) {
        this.video_page_num_1 = val;
      },
      videoPageNumChange2(val) {
        this.video_page_num_2 = val;
      }
    }
  }
</script>

<style lang="scss">
  #edit {

  }
</style>
