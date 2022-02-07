import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login'
import Layout from '../views/layout'

//内容生产
import Create from '../views/content/create/create'
import CreateMy from '../views/content/create/my'
import CreateAudit from '../views/content/create/audit'
import CreatePaper from '../views/content/create/paper'
import HotPaper from '../views/content/create/hot-paper'
import CreateLibrary from '../views/content/create/library'
import Aiwriter from '../views/content/create/aiwriter'


//内容采集
import Collect from '../views/content/collect/collect'
import WebCollect from '../views/content/collect/web'
import Third from '../views/content/collect/third'
import CollectArticle from '../views/content/collect/collect-article'

//编辑发布
import Edit from '../views/content/edit/edit'
import EditPublish from '../views/content/edit/publish'
import EditeArticle from '../views/content/edit/edite-article.vue'
import EditeVideo from '../views/content/edit/edite-video.vue'
import EditeLink from '../views/content/edit/edite-link.vue'
import EditChannels from '../views/content/edit/multi-channel-publish.vue'
import editQuick from '../views/content/edit/quick'

//已发布管理
import PublishedRecommend from '../views/content/published/recommend'
import PublishedNormal from '../views/content/published/normal'
import publishedChannleArticle from '../views/content/published/channel-article'
import channelSort from '../views/content/published/channel-sort'

//频道设置
import ChannelManage from '../views/content/channel/manage'
import ChannelCarousel from '../views/content/channel/carousel'
import ChannelSubject from '../views/content/channel/subject'


//内容设置
import SetSensitive from '../views/content/set/sensitive'
// 热词管理
import HotWords from '../views/content/set/hot-words'
// 素材库分类
import MediaType from '../views/content/set/media-type'

//平台号管理
import NumberList from '../views/content/number/list'
import NumberClassify from '../views/content/number/classify'
import NumberArticle from '../views/content/number/article'
import NumberCreate from '../views/content/number/create'


//运营中心
//数据统计
import DataStatistics from '../views/operate/data/statistics.vue'
import DataUsers from '../views/operate/data/users'
import DataContext from '../views/operate/data/context'
import DataStaff from '../views/operate/data/staffs'
import Intelligence from '../views/operate/data/intelligence'
import UserClick from '../views/operate/data/userClick'
import ArticleCount from '../views/operate/data/ArticleCount'
import userReadDetail from '../views/operate/data/userReadDetail'

//用户中心
import UserCommon from '../views/operate/user/common.vue'
import feedback from '../views/operate/user/feedback.vue'

//评论管理
import CommentAudit from '../views/operate/comment/audit.vue'
import CommentSet from '../views/operate/comment/set.vue'
//消息管理
import MessageInform from '../views/operate/message/inform.vue'
import MessagePush from '../views/operate/message/push.vue'
import PushAdd from '../views/operate/message/push-add'
//广告管理
import AdvertisingManage from '../views/operate/advertising/manage.vue'
//积分管理
import Integral from '../views/operate/integral/integral'

//系统设置
//权限设置
import PermissionAccount from '../views/system/permission/account'
import PermissionRole from '../views/system/permission/role'
import PermissionOrganization from '../views/system/permission/organization'
import Assign from '../views/system/permission/assign'
import Position from '../views/system/permission/position'
import Staff from '../views/system/permission/staff'
import Company from '../views/system/permission/company'

//用户协议
import Agreement from '../views/system/agreement/agreement'
//操作日志
import Log from '../views/system/log/log'
//用户协议
import Protel from '../views/system/basic';
import Privacy from '../views/operate/appsetting/privacy'; // 隐私协议
// 安装包管理
import Package from '../views/operate/appsetting/package';

// 应用中心
// 直播
import LiveRoom from '../views/apply/live/room'
import LiveReplay from '../views/apply/live/replay'
import LiveHost from '../views/apply/live/host'
// 服务
import ServiceManage from '../views/apply/service/service-manage'
import ServiceCategory from '../views/apply/service/service-category'
// 爆料
import Disclose from '../views/apply/disclose/disclose'
// 社群
import Community from '../views/apply/community/community'
import Activity from '../views/apply/community/activity'
import CommunityClassify from '../views/apply/community/classify'
import CommunityDynamic from '../views/apply/community/dynamic'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      component: Login
    },
    {
      path: '/layout',
      component: Layout,
      // redirect: "/layout/create-create",
      children: [
        //内容生产
        {
          path: 'create-create', //内容创作
          component: Create
        },
        {
          path: 'create-my', //我的稿件
          component: CreateMy
        },
        {
          path: 'create-audit', //稿件部门
          component: CreateAudit
        },
        {
          path: 'hot-paper', //全网热门快报
          component: HotPaper
        },
        {
          path: 'create-library', //素材库
          component: CreateLibrary
        },
        {
          path: 'create-aiwriter', // 写作机器人
          component: Aiwriter 
        },
        //内容采集
        {
          path: 'collect-collect', //采编审核
          component: Collect,
        },
        {
          path: 'create-web',
          component: WebCollect
        },
        {
          path: 'collect-third',
          component: Third
        },
        {
          path: 'collect-article', // 平台号文章采集
          component: CollectArticle
        },
        //编辑发布
        {
          path: 'edit-edit', //内容编辑
          component: Edit
        },
        {
          path: 'edit-publish', //内容发布
          component: EditPublish
        },
        {
          path: 'edit-edite-article',
          component: EditeArticle
        },
        {
          path: 'edit-edite-video',
          component: EditeVideo
        },
        {
          path: 'edit-edite-link',
          component: EditeLink
        },
        {
          path: 'edit-channels', // 多频道发布
          component: EditChannels
        },
        {
          path: 'edit-quick',
          component: editQuick
        },
        //已发布管理
        {
          path: 'published-normal', //普通频道
          component: PublishedNormal
        },
        {
          path: 'published-recommend', //推荐频道
          component: PublishedRecommend
        },
        {
          path: 'published-channelArticle', // 频道稿件管理
          component: publishedChannleArticle
        },
        {
          path: 'published-channelSort', // 频道内容排序
          component: channelSort
        },
        //内容设置
        {
          path: 'set-channel', //频道管理
          component: ChannelManage
        },
        {
          path: 'set-carousel', //轮播管理
          component: ChannelCarousel
        },
        {
          path: 'set-subject', //专题管理
          component: ChannelSubject
        },
        {
          path: 'set-paper', //快报管理
          component: CreatePaper
        },
        {
          path: 'set-sensitive', //敏感词设置
          component: SetSensitive
        },
        {
          path: 'set-hotword', // 热词管理
          component: HotWords
        },
        {
          path: 'set-mediaType', // 素材库分类
          component: MediaType
        },
        //平台号管理
        {
          path: 'number-list', //平台号列表
          component: NumberList
        },
        {
          path: 'number-classify', //平台号分类
          component: NumberClassify
        },
        {
          path: 'number-article', //平台号文章
          component: NumberArticle
        },
        {
          path: 'number-create', //新建平台号文章
          component: NumberCreate
        },

        //运营中心
        //数据统计
        {
          path: 'data-statistics',
          component: DataStatistics
        },
        //用户统计
        {
          path: 'data-user',
          component: DataUsers
        },
        //稿件统计
        {
          path: 'data-context',
          component: UserClick // 用户点击
        },
        {
          path: 'data-staff',
          component: DataStaff
        },
        {
          path: 'Intelligence', // 情报统计
          component: Intelligence
        },
        {
          path: 'UserClick', // 用户点击
          component: UserClick
        },
        {
          path: 'articleCount', // 文章统计
          component: ArticleCount
        },
        {
          path: 'readDetail', // 用户阅读详情
          component: userReadDetail
        },
        //用户中心
        {
          path: 'user-common',
          component: UserCommon
        },
        {
          path: 'user-broke',
          component: feedback, // 反馈列表
          name: 'feedback'
        },
        //评论管理
        {
          path: 'comment-audit',
          component: CommentAudit
        },
        {
          path: 'comment-set',
          component: CommentSet
        },
        //消息管理
        {
          path: 'message-inform',
          component: MessageInform
        },
        {
          path: 'message-push',
          component: MessagePush
        },
        {
          path: 'push-add',
          component: PushAdd
        },
        //广告管理
        {
          path: 'advertising-manage',
          component: AdvertisingManage
        },
        // 积分管理
        {
          path: 'integral-integral',
          component: Integral
        },
        //权限设置
        {
          path: 'permission-account',
          component: PermissionAccount
        },
        {
          path: 'permission-role',
          component: PermissionRole
        },
        {
          path: 'permission-company', // 企业管理
          component: Company
        },
        {
          path: 'permission-organization',
          component: PermissionOrganization
        },
        {
          path: 'permission-assign',
          component: Assign
        },
        {
          path: 'staff-staff',
          component: Staff
        },
        {
          path: 'staff-position',
          component: Position
        },
        //操作日志
        {
          path: 'log-log',
          component: Log
        },

        //用户协议
        {
          path: 'protocol-protocol',
          component: Protel,
        },
        { // 隐私协议
          path: 'protocol-private',
          component: Privacy
        },
        // 安装包管理
        {
          path: 'protocol-package',
          component: Package
        },
        //直播间管理
        {
          path: 'live-room',
          component: LiveRoom
        },
        {
          path: 'live-replay',
          component: LiveReplay
        },
        // 主播管理
        {
          path: 'live-host',
          component: LiveHost
        },
        // 服务
        {
          path: 'service-manage',
          component: ServiceManage
        },
        {
          path: 'service-category',
          component: ServiceCategory
        },
        // 爆料
        {
          path: 'broke-broke',
          component: Disclose
        },
        // 社群
        {
          path: 'community-community',
          component: Community
        },
        {
          path: 'community-activity',
          component: Activity
        },
        {
          path: 'community-classify',
          component: CommunityClassify
        },
        {
          path: 'community-dynamic',
          component: CommunityDynamic
        }
      ]
    }
  ]
})
