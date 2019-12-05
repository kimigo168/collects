<template>
  <div id="content-library">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="图片素材" name="1">
          <div class="content">
            <div class="operate clearfix">
              <div class="search lt">
                <el-form :inline="true" :model="image_search_form">
                  <el-form-item label="归属">
                    <el-select v-model="image_search_form.from" @change="fromChange">
                      <el-option label="公共素材" value="1"></el-option>
                      <el-option label="常用素材" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分类">
                    <el-select v-model="image_search_form.classify">
                      <el-option label="全部" value="0"></el-option>
                      <el-option v-for="item in media_types" :label="item.name" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="图片说明">
                    <el-input type="text" v-model="image_search_form.desc" placeholder="图片说明"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="上传者" v-if="image_search_form.from == 1">
                    <el-input type="text" v-model="image_search_form.uploader" placeholder="上传者"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="img_page_num=1;getPersonalMaterialList(1)" v-show="image_search_form.from == 0">查询</el-button>
                    <el-button type="primary" @click="img_page_num=1;getPublicMaterialList(1)" v-show="image_search_form.from == 1">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn rt">
                <el-button type="primary" v-show="image_search_form.from == '1'" @click="addImage">上传图片</el-button>
              </div>

            </div>
            <ul class="data-list clearfix">
              <li v-for="item in img_list" :key="item.id">
                <dl>
                  <dt>
                    <img :src="item.url">
                    <p class="upload-time">上传于{{item.createTime}}</p>
                  </dt>
                  <dd>
                    <span class="title" :title="item.desc">说明：{{item.desc || "暂无说明"}}</span>
                  </dd>
                  <dd>
                    <span v-if="item.classify&&item.classify!=0">分类：{{item.classifyName}} ;</span>
                    <span v-else>暂无分类 ;</span>
                    <span>大小：{{item.contentLength}}k</span>
                  </dd>
                  <dd>
                    <span>尺寸：{{item.width}}x{{item.height}}</span>
                  </dd>
                  <dd>
                    <span>上传者: {{item.userName}}</span>
                  </dd>
                  <dd class="bot">
                    <p class="clearfix" v-if="image_search_form.from == 0">
                      <el-col :span="8"><a href="javascript:;" @click="updateImage(item)">编辑</a></el-col>
                      <el-col :span="8"><a :href="item.url" class="center" download target="_blank">下载</a></el-col>
                      <el-col :span="8"><a href="javascript:;" @click="removeMaterial(item.id)">删除</a></el-col>
                    </p>
                    <p class="clearfix" v-else>
                       <el-col :span="9"><a href="javascript:;" class="bright" @click="moveToPublic(item.id)">转入常用素材</a></el-col>
                      <el-col :span="5"><a href="javascript:;" @click="updateImage(item)">编辑</a></el-col>
                      <el-col :span="5"><a :href="item.url" class="center" download target="_blank">下载</a></el-col>
                      <el-col :span="5"><a href="javascript:;" @click="removeMaterial(item.id)">删除</a></el-col>
                    </p>
                  </dd>
                </dl>
              </li>
            </ul>
            <div class="page" v-if="img_page_totle>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="img_page_num" :page-size="img_page_size" layout="total,  prev, pager, next, jumper" :total="img_page_totle">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频素材" name="2">
          <div class="content">
            <div class="operate clearfix">
              <div class="search lt">
                <el-form :inline="true" :model="video_search_form">
                  <el-form-item label="归属">
                    <el-select v-model="video_search_form.from" @change="fromChange">
                      <el-option label="公共素材" value="1"></el-option>
                      <el-option label="常用素材" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分类">
                    <el-select v-model="video_search_form.classify">
                      <el-option label="全部" value="0"></el-option>
                      <el-option v-for="item in media_types" :label="item.name" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="视频名称">
                    <el-input type="text" v-model="video_search_form.title" placeholder="视频名称"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="上传者">
                    <el-input type="text" v-model="video_search_form.uploader" placeholder="上传者"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="video_page_num=1;getPersonalMaterialList(2)" v-show="video_search_form.from == 0">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="video_page_num=1;getPublicMaterialList(2)" v-show="video_search_form.from == 1">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn rt">
                <el-button type="primary" v-show="video_search_form.from == '1'" @click="addVideo">上传视频</el-button>
              </div>
            </div>
            <ul class="data-list clearfix">
              <li v-for="item in video_list" :key="item.id">
                <dl>
                  <dt>
                    <img :src="item.cover">
                    <p class="upload-time">上传于{{item.createTime}}</p>
                    <div class="play" @click="play(item.url,item.cover)"></div>
                  </dt>
                  <dd>
                    <span class="title" :title="item.desc">名称：{{item.title || "暂无名称"}}</span>
                    <span class="title" :title="item.desc">说明：{{item.desc || "暂无说明"}}</span>
                  </dd>
                  <dd class="clearfix">
                    <div class="pl10">
                      <span v-if="item.classify&&item.classify!=0">分类：{{item.classifyName}} ;</span>
                      <span v-else>暂无分类 ;</span>
                      <span>大小：{{item.contentLength/1000}}M</span>
                    </div>
                  </dd>
                  <dd class="clearfix">
                    <span v-if="item.duration">时长：{{$durationDeal(item.duration)}}</span>
                    <span>上传者: {{item.userName}}</span>
                  </dd>
                  <dd class="bot">
                    <p class="clearfix" v-if="video_search_form.from == 0">
                      <el-col :span="8"><a href="javascript:;" @click="updateVideo(item)">编辑</a></el-col>
                      <el-col :span="8"><a :href="item.url" class="center" download target="_blank">下载</a></el-col>
                      <el-col :span="8"><a href="javascript:;" @click="removeMaterial(item.id)">删除</a></el-col>
                    </p>
                    <p class="clearfix" v-else>
                      <el-col :span="9"><a href="javascript:;" class="bright" @click="moveToPublic(item.id)">转入常用素材</a></el-col>
                      <el-col :span="5"><a href="javascript:;" @click="updateVideo(item)">编辑</a></el-col>
                      <el-col :span="5"><a :href="item.url" class="center" download target="_blank">下载</a></el-col>
                      <el-col :span="5"><a href="javascript:;" @click="removeMaterial(item.id)">删除</a></el-col>
                    </p>
                  </dd>
                </dl>
              </li>
            </ul>
            <div class="page" v-if="video_page_totle>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="video_page_num" :page-size="video_page_size" layout="total,  prev, pager, next, jumper" :total="video_page_totle">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="音频素材" name="3">
          <div class="content">
            <div class="operate clearfix">
              <div class="search lt">
                <el-form :inline="true" :model="audio_search_form">
                  <el-form-item label="归属">
                    <el-select v-model="audio_search_form.from" @change="fromChange">
                      <el-option label="公共素材" value="1"></el-option>
                      <el-option label="常用素材" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分类">
                    <el-select v-model="audio_search_form.classify">
                      <el-option label="全部" value="0"></el-option>
                      <el-option v-for="item in media_types" :label="item.name" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="音频名称">
                    <el-input type="text" v-model="audio_search_form.title" placeholder="音频名称"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="上传者">
                    <el-input type="text" v-model="audio_search_form.uploader" placeholder="上传者"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="audio_page_num=1; getPersonalMaterialList(3)" v-show="audio_search_form.from == 0">查询</el-button>
                    <el-button type="primary" @click="audio_page_num=1; getPublicMaterialList(3)" v-show="audio_search_form.from == 1">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn rt">
                <el-button type="primary" v-show="audio_search_form.from == '1'" @click="addAudio">上传音频</el-button>
              </div>
            </div>
            <ul class="data-list clearfix">
              <li v-for="item in audio_list" :key="item.id">
                <dl>
                  <dt>
                    <audio controls>
                      <source :src="item.url">
                      您的浏览器不支持 audio 元素。
                    </audio>
                    <p class="upload-time">上传于{{item.createTime}}</p>
                  </dt>
                  <dd>
                    <span class="title" :title="item.desc">名称：{{item.title || "暂无名称"}}</span>
                    <!-- <span class="title" :title="item.desc">说明：{{item.desc || "暂无说明"}}</span> -->
                  </dd>
                  <dd class="clearfix">
                    <div class="pl10">
                      <span v-if="item.classify&&item.classify!=0">分类：{{item.classifyName}} ;</span>
                      <span v-else>暂无分类 ;</span>
                      <span>大小：{{parseFloat(item.contentLength/1000).toFixed(1)}}M</span>
                    </div>
                  </dd>
                  <dd class="clearfix">
                    <span v-if="item.duration">时长：{{$durationDeal(item.duration)}}</span>
                    <span>上传者: {{item.userName}}</span>
                  </dd>
                  <dd class="bot">
                    <p class="clearfix" v-if="audio_search_form.from == 0">
                      <el-col :span="8"><a href="javascript:;" @click="updateAudio(item)">编辑</a></el-col>
                      <el-col :span="8"><a :href="item.url" class="center" download target="_blank">下载</a></el-col>
                      <el-col :span="8"><a href="javascript:;" @click="removeMaterial(item.id)">删除</a></el-col>
                    </p>
                    <p class="clearfix" v-else>
                      <el-col :span="9"><a href="javascript:;" class="bright" @click="moveToPublic(item.id)">转入常用素材</a></el-col>
                      <el-col :span="5"><a href="javascript:;" @click="updateAudio(item)">编辑</a></el-col>
                      <el-col :span="5"><a :href="item.url" class="center" download target="_blank">下载</a></el-col>
                      <el-col :span="5"><a href="javascript:;" @click="removeMaterial(item.id)">删除</a></el-col>
                    </p>
                  </dd>
                </dl>
              </li>
            </ul>
            <div class="page" v-if="audio_page_totle>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="audio_page_num" :page-size="audio_page_size" layout="total,  prev, pager, next, jumper" :total="audio_page_totle">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="新增图片素材" :visible.sync="add_image_visible" width="" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="upload">
        <div class="upload">
          <el-upload class="upload-demo" accept="image/*" :action="host" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :on-success="successUploadImage" multiple :limit="10" :on-exceed="handleExceed" :file-list="image_file_list">
            <el-button size="small" type="primary">点击上传</el-button>
            <span class="tip" style="margin-left:4px;font-size:12px;">提示：一次最多选择10张图片上传</span>
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_image_visible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增视频素材" :visible.sync="add_video_visible" width="" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="upload" style="height:370px;max-width:660px;">
        <!-- <el-upload class="upload-demo" :action="host" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :on-success="successUploadVideo" multiple :limit="10" :on-exceed="handleExceed" :file-list="video_file_list">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload> -->
        <ali-upload style="height:370px;" :acceptType="'video'" @fUploadSuccess="aliUploadVideoBack"></ali-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_video_visible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增音频素材" :visible.sync="add_audio_visible" width="" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="upload">
        <!-- <el-upload class="upload-demo" :action="host" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :on-success="successUploadAudio" multiple :limit="10" :on-exceed="handleExceed" :file-list="video_file_list">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload> -->
        <ali-upload style="height:258px;" :acceptType="'audio'" @fUploadSuccess="aliUploadAudioBack"></ali-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_audio_visible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改图片素材" :visible.sync="update_image_visible" width="" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="update_image_form" ref="update_image_form" :rules="update_image_form_rules" label-width="80px">
        <el-form-item label="图片分类" prop="classify">
          <el-select v-model="update_image_form.classify">
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="item in media_types" :label="item.name" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片说明" prop="desc">
          <el-input type="text" v-model="update_image_form.desc" maxlength="30" placeholder="请输入图片说明(选填，最多30字)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update_image_visible = false">取 消</el-button>
        <el-button type="primary" @click="updateImageDo()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改视频素材" :visible.sync="update_video_visible" width="" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="update_video_form" ref="update_video_form" :rules="update_video_form_rules" label-width="80px">
        <el-form-item label="视频名称" prop="title">
          <el-input type="text" v-model="update_video_form.title" maxlength="30" placeholder="请输入视频名称"></el-input>
        </el-form-item>
        <el-form-item label="视频分类" prop="classify">
          <el-select v-model="update_video_form.classify">
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="item in media_types" :label="item.name" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频说明" prop="desc">
          <el-input type="textarea" :rows="5" v-model="update_video_form.desc" maxlength="300" placeholder="请输入视频内容简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update_video_visible = false">取 消</el-button>
        <el-button type="primary" @click="updateVideoDo()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改音频素材" :visible.sync="update_audio_visible" width="" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="update_audio_form" ref="update_audio_form" :rules="update_audio_form_rules" label-width="80px">
        <el-form-item label="音频名称" prop="title">
          <el-input type="text" v-model="update_audio_form.title" placeholder="请输入音频名称"></el-input>
        </el-form-item>
        <el-form-item label="音频分类" prop="classify">
          <el-select v-model="update_audio_form.classify">
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="item in media_types" :label="item.name" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update_audio_visible = false">取 消</el-button>
        <el-button type="primary" @click="updateAudioDo()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog  title="视频播放" v-if="video_play_visible" :visible.sync="video_play_visible" width="" :show-close="false" :center="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="play-box">
        <video id="play" width="100%" height="auto" controls :poster="play_cover">
          <source :src="play_url">
          您的浏览器不支持 video 标签。
        </video>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePlay">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import aliUpload from '../../../components/aliUpload'
export default {
  data() {
    return {
      tab_index: "1",
      //图片素材
      img_list: [],
      image_search_form: {
        from: "1",
        classify: '0',
        desc: "",
        // uploader: ""
      },
      img_page_totle: 0,
      img_page_num: 1,
      img_page_size: 10,

      //视频素材
      video_list: [],
      video_search_form: {
        from: "1",
        classify: "0",
        title: "",
        // uploader: ""
      },
      video_page_totle: 0,
      video_page_num: 1,
      video_page_size: 10,

      //音频素材
      audio_list: [],
      audio_search_form: {
        from: "1",
        classify: "0",
        title: "",
        uploader: ""
      },
      audio_page_totle: 0,
      audio_page_num: 1,
      audio_page_size: 10,

      host: apiHost + "/common/upload",

      //新增图片素材
      add_image_visible: false,
      image_file_list: [],
      image_url: "",
      image_size: "",
      image_width: "",
      image_height: "",

      //修改图片素材
      update_image_info: {},
      update_image_visible: false,
      update_image_form: {
        classify: "",
        desc: ""
      },
      update_image_form_rules: {
        classify: [
          { required: true, message: "请输入图片分类!", trigger: "blur" }
        ]
      },

      //新增视频素材
      add_video_visible: false,
      video_file_list: [],
      video_url: "",
      video_cover: "",
      video_size: "",
      video_duration: "",
      video_time: "",

      //修改视频素材
      update_video_info: {},
      update_video_visible: false,
      update_video_form: {
        title: "",
        classify: "",
        desc: ""
      },
      update_video_form_rules: {
        classify: [
          { required: true, message: "请输入图片分类!", trigger: "blur" }
        ]
      },

      //新增音频素材
      add_audio_visible: false,
      audio_file_list: [],
      audio_url: "",
      audio_size: "",
      audio_duration: "",
      audio_time: "",

      //修改音频素材
      update_audio_info: {},
      update_audio_visible: false,
      update_audio_form: {
        title: "",
        classify: ""
      },
      update_audio_form_rules: {
        classify: [
          { required: true, message: "请输入音频分类!", trigger: "blur" }
        ]
      },

      //视频播放
      video_play_visible: false,
      play_url: "",
      play_cover: "",
      loading: false,
      media_types: [] // 图片，视频，音频分类列表
    };
  },
  components: {
    aliUpload
  },
  created() {
    this.getPublicMaterialList(1);
    this.getMediaTypeList();
    // this.getPersonalMaterialList(2);
    // this.getPersonalMaterialList(3);
  },
  methods: {
    handleClick () {
      if (this.tab_index == 1) {
        this.img_page_num = 1;
        this.image_search_form.classify = '0';
        this.image_search_form.from = '1'
      } else if (this.tab_index == 2) {
        this.video_search_form.classify = '0';
        this.video_search_form.from = '1'
        this.video_page_num = 1;
      } else {
        this.audio_page_num = 1;
        this.audio_search_form.classify = '0';
        this.audio_search_form.from = '1';
      }
      this.getPublicMaterialList(this.tab_index);
      this.getMediaTypeList();
    },
    getMediaTypeList () {
      this.media_types = [];
      this.$jqAjax({
        url: apiHost + '/media/typeList',
        type: 'POST',
        data: {
          type: this.tab_index,
          pageNum: 1,
          pageSize: 100
        },
        success: (res) => {
          if (res.code == 0) {
            this.media_types = res.data.list;
          } 
        },
        error: (err) => {
          console.log(err)
        }
      });
    },
    /*
     *获取公共素材列表
     *type2  1:图片 2:视频 3:音频
     */
    getPublicMaterialList(type) {
      let self = this;
      let data;
      if (type == 1) {
        data = {
          pageNum: self.img_page_num,
          pageSize: self.img_page_size,
          type: type,
          classify: self.image_search_form.classify,
          desc: self.image_search_form.desc,
          // author: self.image_search_form.uploader
        };
        self.img_list = []
      } else if (type == 2) {
        data = {
          pageNum: self.video_page_num,
          pageSize: self.video_page_size,
          type: type,
          classify: self.video_search_form.classify,
          title: self.video_search_form.title,
          // author: self.video_search_form.uploader
        };
        self.video_list = [];
      } else {
        data = {
          pageNum: self.audio_page_num,
          pageSize: self.audio_page_size,
          type: type,
          classify: self.audio_search_form.classify,
          title: self.audio_search_form.title,
          // author: self.audio_search_form.uploader
        };
        self.audio_list = []
      }
      self.loading = true;
      self.$jqAjax({
        url: apiHost + "/media/list",
        type: "POST",
        data: data,
        success: function (data) {
          self.loading = false;
          if (data.code == 0) {
            try {
              if (type == 1) {
                self.img_list = data.data.list;
                self.img_page_totle = data.data.total;
              } else if (type == 2) {
                self.video_list = data.data.list;
                self.video_page_totle = data.data.total;
              } else {
                self.audio_list = data.data.list;
                self.audio_page_totle = data.data.total;
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: "true"
            });
          }
        },
        error(error) {
          self.loading = false;
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: "true"
          });
        }
      });
    },

    /*
     *获取公共素材列表
     *type2  1:图片 2:视频 3:音频
     */
    getPersonalMaterialList(type) {
      let self = this;
      let data;
      if (type == 1) {
        data = {
          pageNum: self.img_page_num,
          pageSize: self.img_page_size,
          type: type,
          classify: self.image_search_form.classify,
          desc: self.image_search_form.desc,
          // author: self.image_search_form.uploader
        };
        self.img_list = [];
        self.img_page_totle = 0;
      } else if (type == 2) {
        data = {
          pageNum: self.video_page_num,
          pageSize: self.video_page_size,
          type: type,
          classify: self.video_search_form.classify,
          title: self.video_search_form.title,
          // author: self.audio_search_form.uploader
        };
        self.video_list = [];
        self.video_page_totle = 0;
      } else {
        data = {
          pageNum: self.audio_page_num,
          pageSize: self.audio_page_size,
          type: type,
          classify: self.audio_search_form.classify,
          title: self.audio_search_form.title,
          // author: self.audio_search_form.uploader
        };
        self.audio_list = [];
        self.audio_page_totle = 0;
      }
      self.loading = true;
      self.$jqAjax({
        url: apiHost + "/media/personal/list",
        type: "POST",
        data: data,
        success: function (data) {
          self.loading = false;
          if (data.code == 0 && data.data && data.data.list && data.data.total > 0) {
            console.log('aaa')
            try {
              if (type == 1) {
                self.img_list = data.data.list;
                self.img_page_totle = data.data.total;
              } else if (type == 2) {
                self.video_list = data.data.list;
                self.video_page_totle = data.data.total;
              } else {
                self.audio_list = data.data.list;
                self.audio_page_totle = data.data.total;
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            console.log('bbb')
            self.$message({ type: "error", message: "未查询到数据", showClose: "true"});
          }
        },
        error(error) {
          self.loading = false;
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: "true"
          });
        }
      });
    },
    pageNumChange(val) {
      if (this.tab_index == 1) {
        this.img_page_num = val;
        if (this.image_search_form.from == "0") {
          this.getPersonalMaterialList(1);
        } else {
          this.getPublicMaterialList(1);
        }
      } else if (this.tab_index == 2) {
        this.video_page_num = val;
        if (this.video_search_form.from == "1") {
          this.getPublicMaterialList(2);
        } else {
          this.getPersonalMaterialList(2);
        }
      } else {
        this.audio_page_num = val;
        if (this.audio_search_form.from == "1") {
          this.getPublicMaterialList(3);
        } else {
          this.audio_page_num = val;
          this.getPersonalMaterialList(3);
        }
      }
    },

    fromChange(val) {
      if (this.tab_index == 1) {
        this.img_page_num = 1;
        if (val == 0) {
          this.getPersonalMaterialList(1)
        } else {
          this.getPublicMaterialList(1)
        }
      } else if (this.tab_index == 2) {
        this.video_page_num = 1;
        if (val == 0) {
          this.getPersonalMaterialList(2)
        } else {
          this.getPublicMaterialList(2)
        }
      } else {
        this.audio_page_num = 1;
        if (val == 0) {
          this.getPersonalMaterialList(3)
        } else {
          this.getPublicMaterialList(3)
        }
      }
    },

    //新增图片素材
    addImage() {
      this.add_image_visible = true;
      this.image_url = "";
      this.image_file_list = [];
    },
    beforeUploadImage(file) { },
    successUploadImage(res, file) {
      var data = null;
      try {
        data = {
          type: this.tab_index,
          status: 1,
          url: res.data.url,
          contentLength: res.data.size,
          width: res.data.width,
          height: res.data.height
        };
        this.addImageDo(data);
      } catch (e) {
        console.log(e);
      }
    },
    addImageDo(data) {
      var self = this;
      self.$ajax({
        url: "/media/add",
        type: "POST",
        data: data,
        success: function (data) {
          if (data.code == 0) {
            try {
              self.getPublicMaterialList(1);
            } catch (e) {
              console.log(e);
            }
          } else {
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: "true"
            });
          }
        },
        error(error) {
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: "true"
          });
        }
      });
    },

    //更新图片素材
    updateImage(item) {
      var self = this;
      self.update_image_visible = true;
      self.update_image_info = item;
      self.update_image_form.classify = Number(item.classify) || '0';
      self.update_image_form.desc = item.desc || "";
    },
    updateImageDo() {
      let self = this;
      self.$refs.update_image_form.validate(valid => {
        let type = self.tab_index;
        if (valid) {
          self.$jqAjax({
            url: apiHost + "/media/update",
            type: "POST",
            data: {
              classify: self.update_image_form.classify,
              desc: self.update_image_form.desc,
              type: self.tab_index,
              id: self.update_image_info.id
            },
            success: function (data) {
              if (data.code == 0) {
                try {
                  if (self.image_search_form.from == 1) {
                    self.getPublicMaterialList(1);
                  } else {
                    self.getPersonalMaterialList(1);
                  }
                  self.update_image_visible = false;
                } catch (e) {
                  console.log(e);
                }
              } else {
                self.$message({
                  type: "error",
                  message: "请求失败",
                  showClose: "true"
                });
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: "true"
              });
            }
          });
        } else {
          console.log("error submit");
        }
      });
    },

    //新增视频素材
    addVideo() {
      this.add_video_visible = true;
      this.video_url = "";
      this.video_cover = "";
    },
    beforeUploadVideo(file) { },
    successUploadVideo(res, file) {
      let self = this;
      let data = null;
      data = {
        type: self.tab_index,
        status: 1,
        url: res.data.url,
        contentLength: res.data.size,
        duration: res.data.timeSeconds,
        cover: res.data.cover ? res.data.cover[0] : res.data.url + '?x-oss-process=video/snapshot,t_5000'
      };
      this.addVideoDo(data);
    },
    aliUploadVideoBack (res) {
      let data = {
        type: this.tab_index,
        status: 1,
        url: res.playUrl,
        contentLength: res.size,
        duration: res.duration,
        cover: res.cover ? res.cover : res.playUrl + '?x-oss-process=video/snapshot,t_5000'
      };
      this.addVideoDo(data);
    },
    addVideoDo(data) {
      var self = this;
      self.$ajax({
        url: "/media/add",
        type: "POST",
        data: data,
        success: function (data) {
          if (data.code == 0) {
            self.$message({type: 'success', message: '添加素材成功，可以选择关闭或继续添加', showClose: true});
            self.getPublicMaterialList(2);
          } else {
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: "true"
            });
          }
        },
        error(error) {
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: "true"
          });
        }
      });
    },

    //更新视频素材
    updateVideo(item) {
      var self = this;
      self.update_video_visible = true;
      self.update_video_info = item;
      self.update_video_form.title = item.title || "";
      self.update_video_form.classify = Number(item.classify)|| "0";
      self.update_video_form.desc = item.desc || "";
    },
    updateVideoDo() {
      let self = this;
      self.$refs.update_video_form.validate(valid => {
        if (valid) {
          self.$jqAjax({
            url: apiHost + "/media/update",
            type: "POST",
            data: {
              title: self.update_video_form.title,
              classify: self.update_video_form.classify,
              desc: self.update_video_form.desc,
              type: self.tab_index,
              id: self.update_video_info.id
            },
            success: function (data) {
              if (data.code == 0) {
                try {
                  if (self.video_search_form.from == 1) {
                    self.getPublicMaterialList(2);
                  } else {
                    self.getPersonalMaterialList(2);
                  }
                  self.update_video_visible = false;
                } catch (e) {
                  console.log(e);
                }
              } else {
                self.$message({
                  type: "error",
                  message: "请求失败",
                  showClose: "true"
                });
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: "true"
              });
            }
          });
        } else {
          console.log("error submit");
        }
      });
    },

    //新增音频素材
    addAudio() {
      this.add_audio_visible = true;
      this.audio_url = "";
    },
    successUploadAudio(res, file) {
      let self = this;
      let data = null;
      try {
        data = {
          type: self.tab_index,
          status: 1,
          url: res.data.url,
          contentLength: res.data.size,
          duration: res.data.timeSeconds
        };
        this.addAudioDo(data);
      } catch (e) {
        console.log(e);
      }
    },
    aliUploadAudioBack (res) {
      let data = {
        type: this.tab_index,
        status: 1,
        url: res.playUrl,
        contentLength: res.size,
        duration: res.duration
      }
      this.addAudioDo(data);
    },
    addAudioDo(data) {
      var self = this;
      self.$ajax({
        url: "/media/add",
        type: "POST",
        data: data,
        success: function (data) {
          if (data.code == 0) {
            self.$message({type: 'success', message: '添加素材成功，可以选择关闭或继续添加', showClose: true});
            self.getPublicMaterialList(3);
          } else {
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: "true"
            });
          }
        },
        error(error) {
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: "true"
          });
        }
      });
    },

    //更新音频素材
    updateAudio(item) {
      var self = this;
      self.update_audio_visible = true;
      self.update_audio_info = item;
      self.update_audio_form.title = item.title || "";
      self.update_audio_form.classify = Number(item.classify) || "0";
    },
    updateAudioDo() {
      let self = this;
      self.$refs.update_audio_form.validate(valid => {
        if (valid) {
          self.$jqAjax({
            url: apiHost + "/media/update",
            type: "POST",
            data: {
              title: self.update_audio_form.title,
              classify: self.update_audio_form.classify,
              type: self.tab_index,
              id: self.update_audio_info.id
            },
            success: function (data) {
              if (data.code == 0) {
                self.update_audio_visible = false;
                try {
                  if (self.audio_search_form.from == 1) {
                    self.getPublicMaterialList(3);
                  } else {
                    self.getPersonalMaterialList(3);
                  }
                  self.update_video_visible = false;
                } catch (e) {
                  console.log(e);
                }
              } else {
                self.$message({
                  type: "error",
                  message: "请求失败",
                  showClose: "true"
                });
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: "true"
              });
            }
          });
        } else {
          console.log("error submit");
        }
      });
    },

    //删除
    removeMaterial(id) {
      var self = this;
      var type = self.tab_index;
      self.$confirm("确定删除该素材吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.$jqAjax({
            url: apiHost + "/media/update",
            type: "POST",
            data: {
              id: id,
              type: type,
              isDelete: 1
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "删除成功",
                  showClose: "true"
                });
                if (type == 1) {
                  if (self.image_search_form.from == 0) {
                    self.getPersonalMaterialList(1);
                  } else {
                    self.getPublicMaterialList(1);
                  }
                } else if (type == 2) {
                  if (self.video_search_form.from == 0) {
                    self.getPersonalMaterialList(2);
                  } else {
                    self.getPublicMaterialList(2);
                  }
                } else {
                  if (self.audio_search_form.from == 0) {
                    self.getPersonalMaterialList(3);
                  } else {
                    self.getPublicMaterialList(3);
                  }
                }
              } else {
                self.$message({
                  type: "error",
                  message: "删除失败",
                  showClose: "true"
                });
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: "true"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //转入公共库
    moveToPublic(id) {
      var self = this;
      let type = this.tab_index;
      self.$confirm("确定转入常用素库吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.$jqAjax({
            url: apiHost + "/media/update",
            type: "POST",
            data: {
              id: id,
              type: type,
              status: 0  // 0: 常用素材，1：公共素材库
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "转入成功",
                  showClose: "true"
                });
                if (type == 1) {
                  self.getPublicMaterialList(1);
                } else if (type == 2) {
                  self.getPublicMaterialList(2);
                } else {
                  self.getPublicMaterialList(3);
                }
              } else {
                self.$message({
                  type: "error",
                  message: "转入失败",
                  showClose: "true"
                });
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: "true"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //视频播放
    play(url, cover) {
      this.play_url = url
      this.play_cover = cover;
      this.video_play_visible = true;
      this.$nextTick(function () {
        document.getElementById("play").play();
      })

      // document.getElementById("play").pause();
     

    },

    //关闭视频播放
    closePlay() {
      document.getElementById("play").pause();
      this.play_url = ''
      this.play_cover = '';
      this.video_play_visible = false;
      // this.$nextTick(function () {
      //   document.getElementById("play").pause();
      // })
      // this.play_url = null;
    },

    handlePreview() { },
    handleRemove() { },
    beforeRemove() { },
    handleExceed() { }
  }
};
</script>

<style lang="scss">
#content-library {
  .data-list {
    padding: 0 20px 0 40px;

    li {
      float: left;
      margin-right: 20px;
      margin-bottom: 30px;
      width: 240px;

      dl {
        dt {
          position: relative;
          width: 236px;
          height: 167px;
          border: 2px solid #fff;
          overflow: hidden;
          // background-color: #000;

          .play {
            width: 60px;
            height: 60px;
            position: absolute;
            top: 53px;
            left: 88px;
            cursor: pointer;
            background: url("../../../images/video_play.png") center no-repeat;
          }

          img {
            display: block;
            width: 100%;
            height: 100%;
          }

          p {
            position: absolute;
            width: 100%;
            font-size: 12px;
            color: #fff;
            background-color: rgba(0,0,0,.3);
            line-height: 30px;
            // padding-left: 10px;
            text-indent: 10px;
            bottom: 0;
            left: 0;
          }

          audio {
            position: absolute;
            top: 50%;
            transform: translate(8px, -50%);
            width: 220px;
            height: 45px;
          }
        }

        dt:hover {
          border-color: $main-color;
        }

        dd {
          margin-top: 5px;

          span {
            font-size: 12px;
            color: #999;
            line-height: 20px;
          }

          .title {
            display: block;
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          p {
            text-align: center;
            border: 1px solid $main-color;

            a {
              display: block;
              font-size: 16px;
              color: #999;
              text-align: center;
              line-height: 30px;
              text-align: center;
              font-size: 12px;
              color: $main-color;
              letter-spacing: 0;
              box-sizing: border-box;
            }

            .center {
              border-left: 1px solid $main-color;
              border-right: 1px solid $main-color;
            }

            .bright {
              border-right: 1px solid $main-color;
            }

            a:hover {
              background-color: $main-color;
              color: #fff;
            }
          }
        }

        .bot {
          margin-top: 20px;
        }
      }
    }
  }

  .el-dialog {
    .avatar-uploader {
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
