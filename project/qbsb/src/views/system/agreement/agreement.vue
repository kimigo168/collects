<template>
  <div id="collecting">
    <div class="tab" v-model="tab_index">
      <el-tabs>
        <el-tab-pane label="用户协议" name="0">
          <div class="content">
            <p></p>
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
  #collecting {

  }
</style>
