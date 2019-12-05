<template>
  <div id="create-create" v-loading.lock="loading">
    <div class="contents-top clearfix">
      <div class="write-box tab scroll" id="write-box">
        <el-tabs v-model="active_index">
          <el-tab-pane label="新建内容" name="0">
            <div class="write-title" id="write-title" style="display: none;">
              <input v-model="articleForm.title" maxlength="60" type="text" placeholder="请在这里输入标题（6～60个字）"/>
              <span>{{articleForm.title.length}}/60</span>
            </div>
            <div class="editor" id="editor" style="height:500px;"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="publish-box scroll">
        <div class="publish-article">
          <h3 class="title">发布设置</h3>
          <div class="item">
            <h3>封面（选填）</h3>
            <p class="tip">
              <el-button size="small" type="primary" @click="clickUseContentImage()">使用</el-button>
              <span>(可使用详情页图片作为封面)</span>
            </p>
            <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :on-success="successUpload1"
                :before-upload="beforeUpload"
                accept="image/*"
                :show-file-list="false">
              <div class="avatar" v-if="articleCover1" :style="{backgroundImage:'url('+articleCover1+')'}"></div>
              <i v-if="!articleCover1" class="el-icon-plus avatar-uploader-icon"></i>
              <i v-if="articleCover1" class="el-icon-circle-close close" @click.stop="articleCover1=''"></i>
            </el-upload>
            <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :on-success="successUpload2"
                :before-upload="beforeUpload"
                accept="image/*"
                :show-file-list="false">
              <div class="avatar" v-if="articleCover2" :style="{backgroundImage:'url('+articleCover2+')'}"></div>
              <i v-if="!articleCover2" class="el-icon-plus avatar-uploader-icon"></i>
              <i v-if="articleCover2" class="el-icon-circle-close close" @click.stop="articleCover2=''"></i>
            </el-upload>
            <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :on-success="successUpload3"
                :before-upload="beforeUpload"
                accept="image/*"
                :show-file-list="false">
              <div class="avatar" v-if="articleCover3" :style="{backgroundImage:'url('+articleCover3+')'}"></div>
              <i v-if="!articleCover3" class="el-icon-plus avatar-uploader-icon"></i>
              <i v-if="articleCover3" class="el-icon-circle-close close" @click.stop="articleCover3=''"></i>
            </el-upload>
          </div>

          <div class="item">
            <h3>署名（选填）</h3>
            <div class="input">
              <input v-model="articleForm.sign" maxlength="30" type="text"/>
              <span>{{articleForm.sign?articleForm.sign.length:0}}/30</span>
            </div>
          </div>
          <div class="item">
            <h3>来源（选填）</h3>
            <div class="input">
              <input v-model="articleForm.source" maxlength="30" type="text"/>
              <span>{{articleForm.source.length}}/30</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contents-bottom">

      <div class="btns">
        <p class="word-num">文章字数：{{articleWordsNum}} 个字</p>
        <a href="javascript:;" class="btn active" @click="publishAndSave(1)">发布</a>
        <a href="javascript:;" class="btn" @click="publishAndSave(0)">存草稿</a>
        <a href="javascript:;" class="btn" @click="openPreviewArticle()">预览</a>
      </div>
    </div>

    <el-dialog class="insert-image-model" title="插入图片" :visible.sync="insertImageModelShow" width="820px"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs>
        <el-tab-pane label="从素材库中选择">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="insertImageSearchForm">
                  <el-form-item label="范围">
                    <el-select v-model="insertImageSearchForm.channel">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="公共图片" value="0"></el-option>
                      <el-option label="我的图片" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="时间">
                    <el-select v-model="insertImageSearchForm.time">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="最近7天" value="0"></el-option>
                      <el-option label="最近30天" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分类">
                    <el-select v-model="insertImageSearchForm.column">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="娱乐" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="关键词">
                    <el-input type="text" v-model="insertImageSearchForm.keywords" placeholder="关键词"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <ul class="list scroll">
              <li v-for="item in 18" :class="{active:item ==1}">
                <div class="img"
                     :style="{backgroundImage:'url('+ 'http://wordpress.giiso.com/wordpress/wp-content/uploads/2018/10/detail1-1.jpg' +')'}"></div>
                <p>比亚迪汽车比亚迪汽车比亚迪汽车比亚迪汽车比亚迪汽车比亚迪汽车比亚迪汽车比亚迪汽车</p>
                <span>汽车；200K；200*100</span>
              </li>
            </ul>

          </div>

          <div class="btns">
            <el-button type="primary" @click="editorInsertImage(insertImageCheckedUrl)">插入</el-button>
            <el-button @click="insertImageModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="手动上传">
          <div class="upload-box">
            <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="successUpload1"
                :before-upload="beforeUpload">
              <div v-if="insertUploadImageUrl" :style="{backgroundImage:'url('+insertUploadImageUrl+')'}"
                   class="avatar"></div>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <i v-if="insertUploadImageUrl" class="el-icon-circle-close close"
                 @click.stop="insertUploadImageUrl=''"></i>
            </el-upload>

            <h3>点击上传图片</h3>
            <p>支持jpg、jpeg、png、gif格式，单张图片大小不超过5M</p>
          </div>
          <div class="btns">
            <el-button type="primary" @click="editorInsertImage(insertUploadImageUrl)">插入</el-button>
            <el-button @click="insertImageModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog class="insert-image-model" title="插入视频" :visible.sync="insertVideoModelShow" width="820px"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs v-if="insertVideoModelShow">
        <el-tab-pane label="视频素材">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="insertVideoSearchForm">
                  <el-form-item label="范围">
                    <el-select v-model="insertVideoSearchForm.channel">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="公共视频" value="0"></el-option>
                      <el-option label="我的视频" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="时间">
                    <el-select v-model="insertVideoSearchForm.time">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="最近7天" value="0"></el-option>
                      <el-option label="最近30天" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分类">
                    <el-select v-model="insertVideoSearchForm.column">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="娱乐" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="关键词">
                    <el-input type="text" v-model="insertVideoSearchForm.keywords"
                              placeholder="输入视频名称/上传者查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <ul class="list  scroll">
              <li v-for="item in 18" :class="{active:item ==1}">
                <div class="img"
                     :style="{backgroundImage:'url('+ 'http://wordpress.giiso.com/wordpress/wp-content/uploads/2018/10/detail1-1.jpg' +')'}">
                  <p>
                    <span class="time">2018-10-13 13:30:20</span>
                    <span class="author">王晶</span>
                  </p>
                </div>
                <p>比亚迪汽车视频</p>
                <span>汽车；20M；03:00:06</span>
              </li>
            </ul>

          </div>

          <div class="btns">
            <el-button type="primary" @click="editorInsertVideo(insertVideoCheckedUrl)">插入</el-button>
            <el-button @click="insertVideoModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频链接" v-if="active_index == '0'">
          <div class="video-url">
            <span>视频URL</span>
            <el-input v-model="insertUploadVideoUrl" style="width: 480px;"></el-input>
            <el-button type="primary">预览</el-button>
          </div>
          <div class="video-box">
            <video :src="insertUploadVideoUrl"
                   :poster="insertUploadVideoUrl+'?x-oss-process=video/snapshot,t_5000,f_jpg'" controls=""></video>

          </div>
          <div class="btns">
            <el-button type="primary" @click="editorInsertVideo(insertUploadVideoUrl)">插入</el-button>
            <el-button @click="insertVideoModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog class="insert-image-model" title="插入音频" :visible.sync="insertRadioModelShow" width="820px"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs v-if="insertRadioModelShow">
        <el-tab-pane label="音频素材">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="insertRadioSearchForm">
                  <el-form-item label="范围">
                    <el-select v-model="insertRadioSearchForm.channel">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="公共音频" value="0"></el-option>
                      <el-option label="我的音频" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="时间">
                    <el-select v-model="insertRadioSearchForm.time">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="最近7天" value="0"></el-option>
                      <el-option label="最近30天" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分类">
                    <el-select v-model="insertRadioSearchForm.column">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="娱乐" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="关键词">
                    <el-input type="text" v-model="insertRadioSearchForm.keywords"
                              placeholder="输入音频名称/上传者查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <ul class="list  scroll">
              <li v-for="item in 18" :class="{active:item ==1}">
                <div class="img"
                     :style="{backgroundImage:'url('+ 'http://wordpress.giiso.com/wordpress/wp-content/uploads/2018/10/detail1-1.jpg' +')'}">
                  <p>
                    <span class="time">2018-10-13 13:30:20</span>
                    <span class="author">王晶</span>
                  </p>
                </div>
                <p>音频音频音频音频音频音频音频音频音频音频</p>
                <span>汽车；20M；03:00:06</span>
              </li>
            </ul>

          </div>

          <div class="btns">
            <el-button type="primary" @click="editorInsertRadio(insertRadioCheckedUrl)">插入</el-button>
            <el-button @click="insertRadioModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="音频链接">
          <div class="upload-box">
            <div style="text-align: center;">
              <span>音频URL</span>
              <el-input v-model="insertUploadRadioUrl" style="width: 600px;"></el-input>
              <el-button type="primary">预览</el-button>
            </div>
            <div style="text-align: center;padding-top: 30px;">
              <audio controls :src="insertUploadRadioUrl">
                您的浏览器不支持 audio 标签。
              </audio>
            </div>
          </div>
          <div class="btns">
            <el-button type="primary" @click="editorInsertRadio(insertUploadRadioUrl)">插入</el-button>
            <el-button @click="insertRadioModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>


    </el-dialog>


    <!-- <PreviewArticle :articleForm="previewArticleForm" @closePreviewArticle="closePreviewArticle"></PreviewArticle> -->
    <previewPop v-if="previewArticleForm" :articleForm="previewArticleForm" @closePreviewArticle="closePreviewArticle"></previewPop>
  </div>
</template>

<script>
  // import PreviewArticle from "./../../../components/preview-article.vue";
  import previewPop from "./../../../components/previewPop.vue";

  export default {
    components: {
      // PreviewArticle,
      previewPop
    },
    data() {
      return {
        uploadUrl: '/common/upload',
        active_index: '0',

        articleWordsNum: 0,
        articleForm: {
          title: '',
          content: '',
          cover: '',
          sign: '',
          source: '',
          enableComment: '',
          platformId: '',
          id: '',
        },
        articleCover1: '',
        articleCover2: '',
        articleCover3: '',

        previewArticleForm: '',

        insertImageModelShow: false,
        insertImageSearchForm: {},
        insertImageCheckedUrl: 'http://wordpress.giiso.com/wordpress/wp-content/uploads/2018/10/detail1-1.jpg',
        insertUploadImageUrl: 'http://wordpress.giiso.com/wordpress/wp-content/uploads/2018/10/detail2-2.png',


        insertVideoModelShow: false,
        insertVideoSearchForm: {},
        insertVideoCheckedUrl: 'http://video.allcitysz.com/2f3b1b21d2a8405c8073fb294a574dcf/72d6e2ce5c204221b171569399839348-eda4fb92de8ffafb6c4ce82e4dc450e8-ld.mp4',
        insertUploadVideoUrl: 'http://video.allcitysz.com/2f3b1b21d2a8405c8073fb294a574dcf/72d6e2ce5c204221b171569399839348-eda4fb92de8ffafb6c4ce82e4dc450e8-ld.mp4',

        insertRadioModelShow: false,
        insertRadioSearchForm: {},
        insertRadioCheckedUrl: 'static/media/沙漠骆驼.mp3',
        insertUploadRadioUrl: 'static/media/沙漠骆驼.mp3',

        loading: false,
      }
    },

    created() {
      var self = this;
      console.log(self.$route.query.queryId);
      if (self.$route.query.queryId) {
        self.getArticleDraftDetail();
      }
    },
    mounted() {
      var self = this;
      self.$nextTick(function () {
        self.editorInt();
      });
    },
    destroyed: function () {
      if (this.editor) this.editor.destroy();
    },
    methods: {
      //获取文章草稿内容
      getArticleDraftDetail: function () {
        var self = this;
        self.loading = true;
        self.$ajax({
          url: "/platform/selectById",
          type: 'GET',
          data: {
            id: self.$route.query.queryId
          },
          success: function (data) {
            self.loading = false;
            if (data.code == 0 && data.data) {
              self.articleForm = data.data;
              if (self.articleForm.content) self.editor.setContent(self.articleForm.content);
              if (self.articleForm.cover) {
                try {
                  var coverArr = JSON.parse(self.articleForm.cover);
                  if (coverArr[0]) self.articleCover1 = coverArr[0].url;
                  if (coverArr[1]) self.articleCover2 = coverArr[1].url;
                  if (coverArr[2]) self.articleCover3 = coverArr[2].url;
                } catch (e) {
                }
              }
            }
          }
        })
      },

      //发布和存草稿
      publishAndSave: function (status) {
        var self = this;
        if (!self.articleForm.title) {
          self.$alert('请输入标题', '提示', {
            type: 'warning'
          });
          return;
        } else if (self.articleForm.title.length < 6) {
          self.$alert('标题至少输入6个字', '提示', {
            type: 'warning'
          });
          return;
        }
        if (!self.editor.hasContents()) {
          self.$alert('请输入文章内容', '提示', {
            type: 'warning'
          });
          return;
        }
        if (status == '1') {
          self.$confirm('建议发布前再检查一遍，确定送审？', '发布提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            callback: function (action) {
              if (action == 'confirm') {
                self.publishAndSaveDo(status)
              }
            }
          })
        } else {
          self.publishAndSaveDo(status)
        }
      },
      //写文章保存数据
      publishAndSaveDo: function (status) {
        var self = this;
        self.loading = true;
        self.articleForm.status = status;
        self.articleForm.platformId = self.$route.query.platformId || '';
        self.articleForm.id = self.$route.query.queryId || '';
        var coverArr = [];
        if (self.articleCover1) coverArr.push({url: self.articleCover1});
        if (self.articleCover2) coverArr.push({url: self.articleCover2});
        if (self.articleCover3) coverArr.push({url: self.articleCover3});
        self.articleForm.cover = JSON.stringify(coverArr);

        var url = '/platform/addArticle';
        if (self.$route.query.queryId) {
          url = '/platform/updateArticle';
        }
        self.$ajax({
          url: url,
          data: self.articleForm,
          success: function (data) {
            self.loading = false;
            if (data.code === "0") {
              if (status == '0') {
                self.$message({
                  showClose: true,
                  message: '文章发布成功',
                  type: 'success'
                });
              } else {
                self.$message({
                  showClose: true,
                  message: '草稿保存成功！',
                  type: 'success'
                });
              }
            } else {
              self.$message({
                showClose: true,
                message: data.msg + '',
                type: 'error'
              });
            }
          }
        })

      },

      //点击使用正文图片
      clickUseContentImage: function () {
        var objE = document.createElement("div");
        objE.innerHTML = this.editor.getContent();
        var imgs = objE.getElementsByTagName('img');
        console.log(imgs)
        if (imgs && imgs.length > 0) {
          for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].src) {
              if (!this.articleCover1) {
                this.articleCover1 = imgs[i].src;
              } else {
                if (!this.articleCover2) {
                  this.articleCover2 = imgs[i].src;
                } else {
                  if (!this.articleCover3) this.articleCover3 = imgs[i].src;
                }
              }
            }
          }
        } else {
          this.$message({
            showClose: true,
            message: '对不起，正文中暂无图片！',
            type: 'error'
          });
        }
      },
      //图片、封面上传
      beforeUpload(file) {
        var self = this;
//        const isSize = new Promise((resolve, reject) => {
//          var mime = path.extname(file.name).slice(1).toUpperCase();
//          console.log(mime);
//          if (mime == 'JPG' || mime == 'PNG' || mime == 'GIF' || mime == 'JPEG') {
//            var img = new Image();
//            var _URL = window.URL || window.webkitURL;
//            img.src = _URL.createObjectURL(file);
//            img.onload = function () {
//              if (img.width == 224 && img.height == 138 || true) {
//                return resolve(true)
//              } else {
//                return resolve(false);
//              }
//            };
//          } else {
//            return resolve(false);
//          }
//        }).then((val) => {
//            if (val) {
//              return file;
//            } else {
//              this.$message({
//                type: 'warning',
//                message: '上传文件与要求不符',
//                showClose: 'true'
//              })
//              return new Promise.reject()
//            }
//          });
//        return isSize;
      },
      successUpload1(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.articleCover1 = data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      successUpload2(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.articleCover2 = data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      successUpload3(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.articleCover3 = data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },

      //打开预览函数
      openPreviewArticle: function () {
        this.previewArticleForm = {
          title: this.articleForm.title,
          source: this.articleForm.source,
          content: this.articleForm.content,
        };
      },
      //关闭预览函数
      closePreviewArticle: function () {
        if (this.previewArticleForm) this.previewArticleForm = '';
      },


      //编辑器中插入图片
      editorInsertImage: function (url) {
        if (!url) {
          this.$message({
            type: 'error',
            message: '请选择图片',
            showClose: 'true'
          });
          return
        }
        this.editor.execCommand('insertimage', {
          src: url,
          _src: url,
        });
        this.insertImageModelShow = false;
      },
      //编辑器中插入视频
      editorInsertVideo: function (url) {
        if (this.active_index == 0) {
          if (!url) {
            this.$message({
              type: 'error',
              message: '请选择视频',
              showClose: 'true'
            });
            return
          }
          var content = '<div><video controls="">' +
              '<source src="' + url + '" type="video/mp4">' +
              '</video></div>';
          this.editor.execCommand('inserthtml', content);
        } else {

        }
        this.insertVideoModelShow = false;
      },
      //编辑器中插入音频
      editorInsertRadio: function (url) {
        if (this.active_index == 0) {
          if (!url) {
            this.$message({
              type: 'error',
              message: '请选择音频',
              showClose: 'true'
            });
            return
          }
          var content = '<div><audio controls="" src="' + url + '" ></audio></div>';
          this.editor.execCommand('inserthtml', content);
        } else {

        }
        this.insertRadioModelShow = false;
      },

      //富文本编辑器初始化程序
      editorInt: function () {
        var self = this;
        if (document.getElementById('editor')) {
          UE.registerUI('myInsertImage', function (editor, uiName) {
            var btn = new UE.ui.Button({
              name: uiName,
              title: '插入图片',
              cssRules: 'background-position: -380px 0px;',
              onclick: function () {
                self.insertImageModelShow = true;
              }
            });
            return btn;
          }, [0]);
          UE.registerUI('myInsertVideo', function (editor, uiName) {
            var btn = new UE.ui.Button({
              name: uiName,
              title: '插入视频',
              cssRules: 'background-position: -320px -20px;',
              onclick: function () {
                self.insertVideoModelShow = true;
              }
            });
            return btn;
          }, [1]);
          UE.registerUI('myInsertRadio', function (editor, uiName) {
            var btn = new UE.ui.Button({
              name: uiName,
              title: '插入音频',
              cssRules: 'background-position: -18px -40px;',
              onclick: function () {
                self.insertRadioModelShow = true;
              }
            });
            return btn;
          }, [2]);
          self.editor = UE.getEditor('editor', {
            toolbars: [[
              'link', 'blockquote', 'horizontal',
              'bold', 'italic', 'underline', 'strikethrough', 'fontsize', 'forecolor',
              'removeformat',
              'undo', 'redo',
              'fullscreen',
            ]],
            fontsize: [16, 18, 20, 22],
            wordCount: false,
            wordCountMsg: '当前已输入 {#count} 个字',
            elementPathEnabled: false,
            enableAutoSave: false,
            autoHeightEnabled: true,

          });
          self.editor.ready(function (editor) {
            self.$("#write-title").insertAfter(self.$(".edui-editor-toolbarbox")).show();
            self.$('#write-box').scroll(function () {
              var top = self.$(this).scrollTop();
              var tollbarbox = self.$('.edui-editor-toolbarbox');

              console.log(top)
              if (top >= 47) {
                tollbarbox.css({
                  'position': 'fixed',
                  'top': '70px',
                  'left': self.$(this).offset().left,
                  'right': '460px',
                  'z-index': '99'
                })
              } else {
                tollbarbox.css({
                  'position': 'static',

                })
              }
            })
          });
          self.editor.addListener('contentChange', function (editor) {
            self.articleForm.content = self.editor.getContent();
            self.articleWordsNum = self.editor.getContentTxt().length;
          });
        } else {
        }
      },
    }
  }
</script>

<style lang="scss">
  /*已引入create-create.scss*/
</style>
