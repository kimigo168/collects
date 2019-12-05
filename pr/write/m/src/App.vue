<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <router-view @getUserInfo="getUserInfo"></router-view>
    </transition>

    <div class="login-model login-check-model" v-show="loginTypeCheckModel">
      <div class="content">
        <a class="close" href="javascript:;" @tap="loginTypeCheckModel=false"></a>
        <div class="form">
          <h3>登录</h3>
          <a class="btn" href="javascript:;" @tap="clickWechatLogin()">
            <img src="./assets/images/login-icon-wechat.png"/>
            <span>微信登录</span>
          </a>
          <a class="btn" href="javascript:;" @tap="clickPhoneLogin()">
            <img src="./assets/images/login-icon-phone.png"/>
            <span>手机号登录</span>
          </a>
        </div>
        <p class="text" @tap="loginTypeCheckModel=false">暂不登录</p>
      </div>
    </div>

    <div class="login-model" v-show="loginModel">
      <div class="content">
        <a class="close" href="javascript:;" @tap="loginModel=false"></a>
        <div class="form">
          <h3>登录</h3>
          <div class="row">
            <p>手机号</p>
            <input type="text" placeholder="请输入您的手机号" v-model="loginForm.phone"/>
          </div>
          <div class="row">
            <p>密码</p>
            <input type="password" placeholder="请输入您的密码" v-model="loginForm.password"/>
          </div>
          <button class="submit-btn" type="button" @tap="loginSubmit()">登 录</button>
        </div>
        <div class="bot">
          <span>还没有账号？</span>
          <a href="javascript:;" @tap="clickRegisterModelShow()">马上注册！</a>
          <a class="right" href="javascript:;" @tap="loginModel=false;passwordModel=true">忘记密码？</a>
        </div>

        <div class="wechat-login-box" v-if="$isWeixin">
          <h3 class="text"><span>其他登录方式</span></h3>
          <a class="btn" href="javascript:;" @tap="clickWechatLogin()">
            <div class="img"></div>
            <span>微信登录</span>
          </a>
        </div>
      </div>
    </div>

    <div class="login-model" v-show="registerModel">
      <div class="content">
        <a class="close" href="javascript:;" @tap="registerModel=false"></a>
        <div class="form">
          <h3>注册</h3>
          <div class="row">
            <p>手机号</p>
            <input type="text" placeholder="请输入手机号" v-model="registerForm.phone"/>
          </div>
          <div class="row">
            <p>密码</p>
            <input type="password" placeholder="请输入密码" v-model="registerForm.password"/>
          </div>
          <div class="row">
            <p>确认密码</p>
            <input type="password" placeholder="请再次输入密码" v-model="registerForm.password2"/>
          </div>
          <div class="row">
            <p>验证码</p>
            <input class="code-input" type="text" placeholder="请输入验证码" v-model="registerForm.code"/>
            <button class="code-btn" type="button" :disabled="phoneCodeBtnDisabled" @tap="clickRegisterGetPhoneCode()">
              {{phoneCodeText}}
            </button>
          </div>
          <div class="service">
            <input type="checkbox" v-model="isReadService"/>
            <span>我已阅读并接受</span>
            <a href="javascript:;" @tap="serviceModel=true">《服务条款》</a>
          </div>
          <button class="submit-btn" type="button" :disabled="!isReadService" @tap="registerSubmit()">注 册</button>
        </div>
        <div class="bot">
          <a class="right" href="javascript:;" @tap="loginModel=true;registerModel=false">已有账号，点此登录</a>
        </div>
      </div>
    </div>

    <div class="login-model" v-show="passwordModel">
      <div class="content">
        <a class="close" href="javascript:;" @tap="passwordModel=false"></a>

        <div class="form" v-show="passwordStep==1">
          <h3>找回密码（1/3）</h3>
          <div class="row">
            <p>手机号</p>
            <input type="text" placeholder="请输入您的手机号" v-model="resetPasswordForm.phone"/>
          </div>
          <div class="row">
            <p>验证码</p>
            <input class="code-input" type="text" placeholder="请输入验证码" v-model="resetPasswordForm.code"/>
            <button class="code-btn" type="button" :disabled="phoneCodeBtnDisabled" @tap="clickResetPwdGetPhoneCode()">
              {{phoneCodeText}}
            </button>
          </div>
          <button class="submit-btn" type="button" @tap="resetPasswordSubmit1()">下一步</button>
        </div>

        <div class="form" v-show="passwordStep==2">
          <h3>找回密码（2/3）</h3>
          <div class="row">
            <p>输入新密码</p>
            <input type="password" placeholder="请输入新密码" v-model="resetPasswordForm.password"/>
          </div>
          <div class="row">
            <p>确认密码</p>
            <input type="password" placeholder="请再次输入新密码" v-model="resetPasswordForm.password2"/>
          </div>
          <button class="submit-btn" type="button" @tap="resetPasswordSubmit2()">提 交</button>
        </div>

        <div class="form" v-show="passwordStep==3">
          <h3>找回密码（3/3）</h3>
          <div class="success">
            <img src="./assets/images/icon-success.png"/>
            <p>重置成功</p>
          </div>
          <button class="submit-btn" type="button" @tap="loginModel=true;passwordModel=false">返回登录</button>
        </div>


        <div class="bot" v-show="passwordStep!=3">
          <a class="right" href="javascript:;" @tap="loginModel=true;passwordModel=false">返回登录</a>
        </div>
      </div>
    </div>


    <div class="login-model service-model" v-show="serviceModel">
      <div class="content">
        <a class="close" href="javascript:;" @tap="serviceModel=false"></a>
        <h3 class="title">写作机器人服务协议</h3>
        <div class="wrap scroll">
          <p class="dear">欢迎您使用写作机器人服务！</p>
          <p class="tip">为使用写作机器人服务，您应当阅读并充分理解《<b>写作机器人</b>服务协议》（下简称“本协议”），尤其是免除或者限制<b>写作机器人</b>责任的条款及对用户权利的限制。除非您已充分阅读、完全理解并接受本协议所有条款，否则您无权使用<b>写作机器人</b>的写作服务。您点击“同意”或“下一步”，或您使用本平台服务，或者以其他任何明示或者默示方式表示接受本协议的，均视为您已阅读并同意签署本协议。本协议即在您与智搜公司之间产生法律效力，成为对双方均具有约束力的法律文件。
          </p>
          <p class="tip">如果您因年龄、智力等因素而不具有完全民事行为能力，请在法定监护人（以下简称"监护人"）的陪同下阅读和判断是否同意本协议，并特别注意未成年人使用条款。</p>
          <p class="tip">如果您是中国大陆地区以外的用户，您订立或履行本协议还需要同时遵守您所属和/或所处国家或地区的法律。</p>
          <p class="index">一、【协议的范围】</p>
          <p class="tip">
            本协议是用户与深圳市智搜信息技术有限公司（简称“智搜公司”）之间关于其使用写作机器人写作服务所订立的协议。本《协议》描述写作机器人写作平台与会员之间关于软件许可以及服务使用及相关方面的权利义务。“用户”或"您"是指使用写作机器人服务的个人或单一个体，包含了普通试用用户和VIP会员用户两类。
          </p>
          <p class="index">二、【帐号与密码安全】</p>
          <p class="tip">
            您在使用本服务时需要注册一个帐号。关于您使用帐号的具体规则，请仔细阅读并遵守相关单独协议。智搜特别提醒您应妥善保管您的帐号和密码。当您使用完毕后，应安全退出。因您保管不善可能导致遭受被盗号或密码失窃，责任由您自行承担。
          </p>
          <p class="index">三、【用户个人信息保护】</p>
          <p class="tip">
            保护用户个人信息一直是智搜的一项基本原则。用户在注册帐号或使用服务中，可能需要填写一些必要的信息，智搜将按照法律规定搜集、使用、储存您的个人信息。智搜不会将您的个人信息转移或者披露给第三方，除非
          </p>
          <p class="tip">（1）相关法律法规或司法机关、行政机关要求。</p>
          <p class="tip">（2）为完成合并、分立、收购或资产转让而转移。</p>
          <p class="tip">（3）为提供您要求的服务所必需。</p>
          <p class="tip">（4）其他相关协议规则可以转移或披露给任何第三方的情形。</p>
          <p class="tip">智搜非常重视对未成年人个人信息的保护。若您不具备完全民事行为能力，在使用我们的的服务前，应事先取得您的监护人的同意。</p>
          <p class="index">四、【使用本服务的方式】</p>
          <p class="tip1">
            4.1用户一旦注册成功，成为本站普通用户，将得到一个密码和用户名。用户可随时根据指示改变用户的密码，用户将对用户名和密码安全负全部责任。写作机器人写作会员帐号使用权仅属于初始申请注册人，禁止帐号共享、赠与、借用、租用、转让或售卖，因上述原因导致帐号或密码丢失，智搜公司有权不予找回并不承担引发的任何责任。另外，每个用户都要对以其用户名进行的所有活动和事件负全责。用户若发现任何非法使用用户帐户或存在安全漏洞的情况，请立即通告本站。
          </p>
          <p class="tip1">
            4.2用户在使用中，享受有限的免费体验次数。当免费体验次数达上限后，如需继续使用写作机器人服务，用户需在线付费开通会员服务。完成会员服务升级后，方可继续对文章进行编辑、保存、下载等。</p>
          <p class="tip1">4.3Giiso写作机器人PC端、手机端属于相同VIP服务体系，只需要在一个平台开通VIP后，在有效期内可以在两个不同平台享受相关服务。</p>
          <p class="tip1">
            4.4在线购买后，如果用户需要开具发票，请与我们联系。联系方式：0755 8672 0697。                          我们将在30个工作日内处理并以快递到付的方式寄出发票或者向您发送电子发票。</p>
          <p class="tip1">4.5会员服务期限届满后，若用户未选择续费，账户将自动变成普通账户，不再享有VIP特权。</p>
          <p class="tip1">
            4.6选择本服务系用户自愿行为，且智搜以合理的收费标准为用户提供服务，智搜保留不对已付费用户提供退费或者费用调整之权利。
          </p>
          <p class="index">五、【结束本服务的方式】</p>
          <p class="tip1">
            5.1VIP有效期满后，用户需要及时在线续费才可以继续使用VIP服务。如续费时智搜对产品名称、服务或价格进行了调整，双方同意按照续约当时有效的新的产品名称、服务和价格由智搜提供服务。</p>
          <p class="tip1">5.2其他收费方式：以该具体服务项目网页公布的消费信息提醒及金额为准。</p>
          <p class="tip1">
            5.3用户充分了解智搜的所有赠送服务项目和涉及价格的活动均为在正常服务价格之外的一次性特别优惠，优惠内容不包括赠送服务项目的修改、更新和维护费用，并且赠送服务项目不可折价冲抵服务价格、不可兑换现金。</p>
          <p class="index">六、【服务更变的方式】</p>
          <p class="tip1">6.1如因系统维护或升级的需要而暂停本服务的，智搜将尽可能事先在本站进行通告。</p>
          <p class="tip1">6.2如由于用户的软件异常出现任何影响到本服务的正常运行情况，可能造成重大网络安全问题而影响到其他用户时，智搜有权暂停用户对本服务的使用。</p>
          <p class="tip1">6.3如用户的行为违反本协议中明确约定或属智搜事先明确告知的应被终止服务的禁止性行为，智搜有权立即终止对用户提供服务并不退还任何款项。</p>
          <p class="tip1">
            6.4一旦智搜通过内部检测程序发现或经其他机构或用户举报而发现用户有可能正在从事违反法律、行政法规禁止性规定或本协议约定的行为时，智搜有权做出独立的判断并采取相应措施，包括但不限于限制账号的登录、暂停服务使用、终止服务不退还任何款项并要求用户赔偿因从事上述行为而给智搜造成的损失。</p>
          <p class="index">七、【知识产权&版权声明】</p>
          <p class="tip1">
            7.1智搜公司在本服务中提供的写作机器人的知识产权归属智搜公司所有。本服务所有内容，包括但不限于数据库、网站设计、文字和图表、软件、照片、录像、音乐、声音及前述组合，软件编译、相关源代码和软件 (包括小应用程序和脚本)，均由智搜或智搜关联企业依法拥有其知识产权，包括但不限于商标权、专利权、著作权、商业秘密等。非经智搜或智搜关联企业书面同意，任何人不得擅自使用、修改、复制、传播、改变、散布、发行或公开发表本服务程序或内容。</p>
          <p class="tip1">
            7.2Giiso写作机器人作为一款新闻的AI辅助创作工具，仅作为工具为用户提供服务。平台上提供的文章、图片等所有素材来源于网络抓取的第三方素材，均不提供版权服务。若因该些素材侵犯他人合法权益造成您被权利人追责的，您应当自行向权利人承担责任。
          </p>
          <p class="tip1">
            7.3知识产权政策是对符合《信息网络传播权保护条例》和其它适用的知识产权法律规定的声称侵权之通告进行回复和处理。任何单位或个人认为通过写作机器人写作智能成文引擎获得的文字内容或者用户自行编辑的内容可能涉嫌侵犯其合法权益的，应该及时向智搜公司书面反馈，并请同时提供身份证明、权属证明及详细侵权情况证明。</p>
          <p class="index">八、【用户违法违规行为】</p>
          <p class="tip1">8.1您在使用本服务时须遵守法律法规，不得制作、复制、发布、传播含有下列内容的信息或从事相关行为，也不得为制作、复制、发布、传播含有下列内容的信息或从事相关行为提供便利：</p>
          <p class="tip">（1）反对宪法所确定的基本原则的。</p>
          <p class="tip">（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的。</p>
          <p class="tip">（3）损害国家荣誉和利益的。</p>
          <p class="tip">（4）煽动民族仇恨、民族歧视，破坏民族团结的。</p>
          <p class="tip">（5）破坏国家宗教政策，宣扬邪教和封建迷信的。</p>
          <p class="tip">（6）散布谣言，扰乱社会秩序，破坏社会稳定的。</p>
          <p class="tip">（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的。</p>
          <p class="tip">（8）侮辱或者诽谤他人，侵害他人合法权益的。</p>
          <p class="tip">（9）违反法律法规底线、社会主义制度底线、国家利益底线、公民合法权益底线、社会公共秩序底线、道德风尚底线和信息真实性底线的“七条底线”要求的。</p>
          <p class="tip">（10）相关法律法规或本协议、相关协议、规则等禁止的。</p>
          <p class="tip1">
            8.2如果您在使用本服务过程中违反了相关法律法规或本协议约定，相关国家机关或机构可能会对您提起诉讼、罚款或采取其他制裁措施，并要求智搜给予协助。因此给您或者他人造成损害的，您应自行承担全部责任，智搜不承担任何责任。</p>
          <p class="tip1"> 8.3如果您违反本协议约定，智搜有权进行独立判断并采取相应措施，采取包括但不限于暂停或终止向您提供服务，限制、中止、冻结或终止您对写作机器人账号的使用，追究法律责任等措施。</p>
          <p class="tip1">8.4您违反本协议约定，导致任何主体损失的，您应当独立承担责任；智搜因此遭受损失的，您也应当一并赔偿。</p>
          <p class="tip">
            本产品“写作机器人”版权归属深圳市智搜信息技术有限公司所有，本声明的所有内容最终解释权归智搜。
          </p>
        </div>
        <button class="confirm-btn" @tap="serviceModel=false">我接受</button>
      </div>
    </div>

    <transition name="router-fade" mode="out-in">
      <div class="tool-tip" v-show="toolTip">{{toolTip}}</div>
    </transition>

    <div class="wechat-tip-model" v-show="wechatTipModelShow">
      <div class="content clearfix">
        <p>可以使用浏览器分享功能并在微信中打开该链接，即可快速授权登录</p>
        <a href="javascript:;" @tap="wechatTipModelShow=false">我知道了</a>
      </div>
    </div>

    <transition name="router-fade" mode="out-in">
      <div class="normal-model code7003-model" v-show="code7003Model">
        <div class="model" @tap="$store.commit('setCode7003Model', false)"></div>
        <div class="content clearfix">
          <h3>您今天的免费体验次数已用尽！</h3>
          <p>充值购买VIP立享任意使用</p>
          <a href="javascript:;" class="btn2" @tap="goToPayCenter()">立即充值</a>
        </div>
      </div>
    </transition>

    <div class="loading-model" v-show="loading">
      <div class="content">
        <img src="./assets/images/loading.png"/>
        <p>{{loading}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {

        wechatTipModelShow: false,

        loginTypeCheckModel: false,


        loginModel: false,
        loginForm: {
          phone: '',
          password: '',
        },

        registerModel: false,
        registerForm: {
          phone: '',
          password: '',
          password2: '',
          code: '',
        },
        registerSource: '0',
        isReadService: true,


        phoneCodeBtnDisabled: true,
        phoneCodeText: '获取验证码',

        passwordModel: false,
        passwordStep: 1,
        resetPasswordForm: {
          phone: '',
          password: '',
          password2: '',
          code: '',
        },


        serviceModel: false,

      }
    },
    computed: {
      toolTip() {
        return this.$store.state.toolTip
      },
      loading() {
        return this.$store.state.loading
      },
      code7003Model() {
        return this.$store.state.code7003Model
      },
    },
    watch: {
      '$store.state.loginModel': function (val) {
        if (val) {
          if (this.$isWeixin) {
            this.loginTypeCheckModel = true;
          } else {
            this.loginModel = true;
          }
          this.$store.commit('setLoginModel', false);

          _czc.push(['_trackEvent','登录注册','点击登录',this.routerName()])

        }
      },
      'registerForm.phone': function (val) {
        if (val.length === 11) {
          if (!(/^1[3456789]\d{9}$/.test(val))) {
            this.$store.commit('setToolTip', '手机号码格式不正确!');
          } else {
            this.checkPhone(val, 1)
          }
        } else {
          this.phoneCodeBtnDisabled = true;
        }
      },
      'resetPasswordForm.phone': function (val) {
        if (val.length === 11) {
          if (!(/^1[3456789]\d{9}$/.test(val))) {
            this.$store.commit('setToolTip', '手机号码格式不正确!');
          } else {
            this.checkPhone(val, 2)
          }
        } else {
          this.phoneCodeBtnDisabled = true;
        }
      },

      passwordModel(val) {
        if (!val) this.passwordStep = 1;
      },
      toolTip(val) {
        if (val && val !== '') {
          setTimeout(() => {
            this.$store.commit('setToolTip', '');
          }, 1500)
        }
      }
    },
    created() {
      this.init();
    },
    mounted() {
      this.seTencentCaptchaRegister();
      this.seTencentCaptchaResetPwd();
      GIISO.shareInterface.shareInit();
    },
    methods: {
      init() {
        var self = this;
        var searchObj = self.$getSearchPamara();
        if (searchObj.source) {
          self.registerSource = searchObj.source;
        }

        self.getUserInfo(function (user) {
          self.$updateStcLog({
            code: 3,  //登录日志
            uid: user.id,
            platform: 2, //手机端H5
            from: self.registerSource
          })
        });

        self.$updateStcLog({
          code: 1,  //PV
          platform: 2, //手机端H5
          from: self.registerSource
        });
        self.$router.afterEach(function (to, from, next) {
          self.getUserInfo();
          self.$updateStcLog({
            code: 1,  //PV
            platform: 2, //手机端H5
            from: self.registerSource
          });
          _czc.push(["_trackPageview", '/m/#' + to.path, '/m/#' + from.path]);
          self.$store.commit('setLoading', false);
        });
        self.updateUUIDStcLog();
        self.checkVersion();
      },


      //获取用户信息
      getUserInfo(callback) {
        var self = this;
        $.ajax({
          url: apiHost + "/auth/user/info.do",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          success: function (data) {
            if (data.code == 0) {
              self.$store.commit('setUserInfo', data.data.user);
              if (callback) callback(data.data.user);
            } else if (data.code == "9001") {
              self.isNotLogin();
            }
          }
        })
      },
      isNotLogin() {
        var self = this;
        if (self.$route.path.indexOf('/edit') > -1
          || self.$route.path.indexOf('/user-center') > -1
          || self.$route.path.indexOf('/pay-center') > -1
          || self.$route.path.indexOf('/pay-suc') > -1
          || self.$route.path.indexOf('/my-article') > -1
          || self.$route.path.indexOf('/order') > -1
          || self.$route.path.indexOf('/reset-pwd') > -1
          || self.$route.path.indexOf('/feedback') > -1
          || self.$route.path.indexOf('/duplicate-list') > -1
          || self.$route.path.indexOf('/duplicate-detail') > -1
        ) {
          location.href = location.href.split('#')[0];
        }
      },



      //点击手机登陆
      clickPhoneLogin() {
        this.loginTypeCheckModel=false;
        this.loginModel=true;
        _czc.push(['_trackEvent','登录注册','点击手机登录方式',this.routerName()])
      },
      //点击微信登陆
      clickWechatLogin() {
        if (this.$isWeixin) {
          this.wechatLogin();
        } else {
          this.loginTypeCheckModel = false;
          this.wechatTipModelShow = true;
        }
        _czc.push(['_trackEvent','登录注册','点击微信登陆方式',this.routerName()])
      },

      //微信登陆
      wechatLogin() {
        var self = this;
        var redirect_url = location.href;
        redirect_url = decodeURI(redirect_url);
        self.$http({
          url: apiHost + "/auth/wx/oauth/uri.do",
          data: {
            redirect_uri: encodeURIComponent(redirect_url),
            source: self.registerSource,
            scene: 0,
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.authUrl) {
              location.href = data.data.authUrl;
            } else {
              self.$store.commit('setToolTip', data.msg);
            }
          }
        })
      },


      //手机号登录提交
      loginSubmit(tipText) {
        var self = this;
        _czc.push(['_trackEvent','登录注册','点击登录按钮',this.routerName()])

        if (!self.loginForm.phone) {
          self.$store.commit('setToolTip', '请输入您的手机号!');
          return
        }
        if (!self.loginForm.password) {
          self.$store.commit('setToolTip', '请输入您的密码!');
          return
        }
        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/auth/login.do",
          data: {
            username: self.loginForm.phone,
            pwd: MD5(self.loginForm.password)
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0) {
              if (data.data && data.data.isLogin) {
                self.getUserInfo();
                setTimeout(function () {
                  self.getUserInfo();
                  setTimeout(function () {
                    self.getUserInfo(function (user) {
                      self.$updateStcLog({
                        code: 3,  //登录日志
                        uid: user.id,
                        platform: 2, //手机端H5
                        from: self.registerSource
                      })
                    });
                  }, 2000);
                }, 2000);
                self.loginModel = false;
                self.$store.commit('setToolTip', tipText || '登录成功！');
              } else {
                self.$store.commit('setToolTip', '账号或者密码错误！');
              }
            } else {
              self.$store.commit('setToolTip', data.msg);
            }
          }
        })
      },


      checkPhone(phone, type) {
        var self = this;
        self.$http({
          url: apiHost + "/auth/checkPhone.do",
          data: {
            mobile: phone,
            type: type,
          },
          success: function (data) {
            if (data.code == 0) {
              self.phoneCodeBtnDisabled = false;
            } else {
              self.$store.commit('setToolTip', data.msg);
            }
          }
        })
      },
      getPhoneCode(mobile, type, captchaObj) {
        var self = this;
        self.phoneCodeText = '发送中';
        self.phoneCodeBtnDisabled = true;
        self.$http({
          url: apiHost + "/auth/getCode.do",
          data: {
            type: type,
            mobile: mobile,
            aid: captchaObj.appid,
            ticket: captchaObj.ticket,
            randstr: captchaObj.randstr,
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0) {
              self.$store.commit('setToolTip', '短信已发送成功！');

              var m = 60;
              self.phoneCodeText = m + 's';
              if (self.phoneCodeTimer) clearInterval(self.phoneCodeTimer);
              self.phoneCodeTimer = setInterval(function () {
                m--;
                if (m <= 0) {
                  clearInterval(self.phoneCodeTimer);
                  self.phoneCodeText = '重新发送';
                  self.phoneCodeBtnDisabled = false;
                } else {
                  self.phoneCodeText = m + 's';
                }
              }, 1000)
            } else {
              self.phoneCodeText = '重新发送';
              self.phoneCodeBtnDisabled = false;
              self.$store.commit('setToolTip', data.msg);
            }
          },
          error: function () {
            self.phoneCodeText = '重新发送';
            self.phoneCodeBtnDisabled = false;
          }
        })
      },


      //打开注册模块
      clickRegisterModelShow(){
        this.loginModel=false;
        this.registerModel=true;
        _czc.push(['_trackEvent','登录注册','点击注册入口',this.routerName()])
      },
      seTencentCaptchaRegister() {
        var self = this;
        self.captchaRegister = new TencentCaptcha('2035369005', function (res) {
          console.log(res)
          if (res.ret === 0) {
            self.getPhoneCode(self.registerForm.phone, 1, res)
          }
        }, {bizState: 'register'});
      },
      //注册获取短信验证码
      clickRegisterGetPhoneCode() {
        var self = this;
        _czc.push(['_trackEvent','登录注册','点击获取注册验证码',this.routerName()])

        if (self.phoneCodeBtnDisabled) return;
        if (self.captchaRegister) self.captchaRegister.show()
      },
      //提交注册信息
      registerSubmit() {
        var self = this;
        _czc.push(['_trackEvent','登录注册','点击注册按钮',this.routerName()])

        if (!self.isReadService) return;
        if (!self.registerForm.phone) {
          self.$store.commit('setToolTip', '请输入您的手机号!');
          return
        } else if (!(/^1[3456789]\d{9}$/.test(self.registerForm.phone))) {
          self.$store.commit('setToolTip', '手机号码格式不正确!');
          return
        }
        if (!self.registerForm.password) {
          self.$store.commit('setToolTip', '请输入您的密码!');
          return
        } else if (self.registerForm.password2 !== self.registerForm.password) {
          self.$store.commit('setToolTip', '两次输入的密码不一致，请重新输入!');
          return
        }
        if (!self.registerForm.code) {
          self.$store.commit('setToolTip', '请输入验证码!');
          return
        }

        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/auth/register.do",
          data: {
            mobile: self.registerForm.phone,
            code: self.registerForm.code,
            pwd: MD5(self.registerForm.password),
            platform: 2,
            source: self.registerSource,
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0) {
              self.registerModel = false;
              self.loginForm.phone = self.registerForm.phone;
              self.loginForm.password = self.registerForm.password;
              self.loginSubmit('注册并登录成功！');
              self.registerForm = {
                phone: '',
                password: '',
                password2: '',
                code: '',
              };
            } else {
              self.$store.commit('setToolTip', data.msg);
            }
          }
        })
      },


      seTencentCaptchaResetPwd() {
        var self = this;
        self.captchaResetPwd = new TencentCaptcha('2098934018', function (res) {
          console.log(res)
          if (res.ret === 0) {
            self.getPhoneCode(self.resetPasswordForm.phone, 2, res)
          }
        }, {bizState: 'register'});
      },
      //找回密码获取短信验证码
      clickResetPwdGetPhoneCode() {
        var self = this;
        if (self.phoneCodeBtnDisabled) return;
        if (self.captchaResetPwd) self.captchaResetPwd.show()
      },
      resetPasswordSubmit1() {
        var self = this;
        if (!self.resetPasswordForm.phone) {
          self.$store.commit('setToolTip', '请输入您的手机号!');
          return
        } else if (!(/^1[3456789]\d{9}$/.test(self.resetPasswordForm.phone))) {
          self.$store.commit('setToolTip', '手机号码格式不正确!');
          return
        }
        if (!self.resetPasswordForm.code) {
          self.$store.commit('setToolTip', '请输入验证码!');
          return
        }
        self.passwordStep = 2;
      },
      resetPasswordSubmit2() {
        var self = this;
        if (!self.resetPasswordForm.phone) {
          self.$store.commit('setToolTip', '请输入您的手机号!');
          return
        } else if (!(/^1[3456789]\d{9}$/.test(self.resetPasswordForm.phone))) {
          self.$store.commit('setToolTip', '手机号码格式不正确!');
          return
        }
        if (!self.resetPasswordForm.code) {
          self.$store.commit('setToolTip', '请输入验证码!');
          return
        }
        if (!self.resetPasswordForm.password) {
          self.$store.commit('setToolTip', '请输入您的密码!');
          return
        } else if (self.resetPasswordForm.password2 !== self.resetPasswordForm.password) {
          self.$store.commit('setToolTip', '两次输入的密码不一致，请重新输入!');
          return
        }

        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/auth/findPassword.do",
          data: {
            mobile: self.resetPasswordForm.phone,
            code: self.resetPasswordForm.code,
            pwd: MD5(self.resetPasswordForm.password)
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0) {
              self.passwordStep = 3;
              self.resetPasswordForm = {
                phone: '',
                password: '',
                password2: '',
                code: '',
              }
            } else {
              self.$store.commit('setToolTip', data.msg);
            }
          }
        })
      },

      //跳转去支付中心函数
      goToPayCenter() {
        var self = this;
        _czc.push(['_trackEvent','个人中心','点击VIP充值或续费'])

        self.$store.commit('setCode7003Model', false);
        if (self.$isWeixin) {
          var redirect_url = location.href.split('#')[0];
          redirect_url = redirect_url + '#/pay-center?t=1';
          self.$http({
            url: apiHost + "/auth/wx/oauth/uri.do",
            data: {
              redirect_uri: encodeURIComponent(redirect_url),
              scene: 2,
            },
            success: function (data) {
              if (data.code == 0 && data.data && data.data.authUrl) {
                location.href = data.data.authUrl;
              } else {
                self.$store.commit('setToolTip', data.msg);
              }
            }
          })
        } else {
          self.$router.push('/pay-center')
        }
      },

      //与服务器端版本号比对，重新从服务器下载页面文档，防止页面缓存
      checkVersion() {
        var self = this;
        self.$http({
          url: apiHost + "/version/num.do",
          success: function (data) {
            var htmlVersion = 9;
            if (data.code == 0) {
              console.log(htmlVersion + ' : ' + data.data);
              if (htmlVersion < data.data) {
                window.location.reload(true);
              }
            }
          }
        })
      },

      //未登录时使用随机生成唯一标识上传UV统计
      updateUUIDStcLog() {
        var self = this;

        var UUID = '';
        if (window.localStorage.UUID) {
          UUID = window.localStorage.UUID;
        } else {
          UUID = self.$generateUUID();
          window.localStorage.UUID = UUID;
        }
        self.$updateStcLog({
          code: 2,  //UV
          uid: UUID,
          platform: 2, //手机端H5
          from: self.registerSource
        })
      },


      routerName(){
        var str="";
        if(this.$route.path.indexOf('/home') > -1){
          str='首页'
        }else if(this.$route.path.indexOf('/hots') > -1){
          str='热点写作'
        }else if(this.$route.path.indexOf('/outline') > -1){
          str='提纲写作'
        }else {
          str=this.$route.path;
        }
        console.log(str)
        return str;
      }

    }
  }

</script>

<style lang="scss">
  @import "./assets/scss/app.scss";

  #app {
    width: 100%;
    height: 100%;
    input[type='text'],
    input[type='password'] {
      box-shadow: none;
      -webkit-appearance: none;
    }
    .login-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 99999;
      background: rgba(0, 0, 0, 0.5);
      .content {
        position: absolute;
        left: 50%;
        top: 47%;
        transform: translate(-50%, -50%);
        width: rem(570);
        min-height: rem(630);
        background: rgba(255, 255, 255, 1);
        border-radius: rem(9);
        box-sizing: border-box;
        padding: rem(50) rem(38) rem(40);
        .close {
          width: rem(52);
          height: rem(52);
          background: url("./assets/images/close.png") no-repeat center/rem(32);
          position: absolute;
          right: rem(30);
          top: rem(40);
        }
        .form {
          h3 {
            font-size: rem(36);
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
            line-height: rem(50);
            padding-bottom: rem(42);
          }
          .row {
            margin-bottom: rem(30);
            position: relative;
            p {
              font-size: rem(32);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              line-height: rem(45);
              margin-bottom: rem(20);
            }
            input {
              height: rem(60);
              border: none;
              border-bottom: 1px solid #E5E5E5;
              font-size: rem(28);
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              width: 100%;
              box-sizing: border-box;
            }
            .code-btn {
              position: absolute;
              right: 0;
              bottom: 2px;
              background-color: #ffffff;
              height: rem(56);
              font-size: rem(28);
              color: rgba(36, 107, 255, 1);
              border: none;
              width: rem(170);
              border-radius: 4px;
              &:disabled {
                cursor: not-allowed;
                background-color: #cccccc;
                color: #ffffff;
              }
            }
            .code-input {
              padding-right: rem(180);
            }
          }
          .success {
            text-align: center;
            padding: rem(62) 0 rem(84);
            img {
              width: rem(100);
              margin-bottom: rem(12);
            }
            p {
              font-size: rem(28);
              color: rgba(51, 51, 51, 1);
              line-height: rem(40);
            }
          }
          .service {
            font-size: rem(24);
            color: rgba(51, 51, 51, 1);
            line-height: rem(36);
            margin-bottom: rem(26);
            a {
              color: rgba(36, 107, 255, 1);
            }
            input {
              vertical-align: middle;
            }
          }
          .submit-btn {
            display: block;
            width: 100%;
            height: rem(88);
            background: rgba(36, 107, 255, 1);
            border-radius: rem(48);
            font-size: rem(36);
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            border: none;
            margin-bottom: rem(26);
            &:disabled {
              cursor: not-allowed;
              background-color: #cccccc;
            }
          }
        }
        .bot {
          font-size: rem(24);
          line-height: rem(36);
          color: rgba(153, 153, 153, 1);
          a {
            color: rgba(36, 107, 255, 1);
          }
        }
        .wechat-login-box {
          padding-top: rem(45);
          text-align: center;
          .text {
            height: 1px;
            background: rgba(238, 238, 238, 1);
            position: relative;
            span {
              font-size: rem(24);
              color: rgba(141, 141, 141, 1);
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              background-color: #ffffff;
              padding: 0 rem(26);
            }
          }
          .btn {
            display: inline-block;
            margin: rem(36) auto 0;
            .img {
              width: rem(68);
              height: rem(68);
              border-radius: 50%;
              background: rgba(246, 246, 246, 1) url("./assets/images/login-icon-wechat.png") no-repeat center / rem(48);
              margin: 0 auto rem(6);
            }
            span {
              font-size: rem(24);
              color: rgba(102, 102, 102, 1);
              white-space: nowrap;
            }
          }
        }
      }
    }
    .login-check-model {
      .content {
        min-height: rem(480);
        .btn {
          display: block;
          background: rgba(244, 244, 244, 1);
          margin-bottom: rem(33);
          padding: rem(15) rem(30);
          img {
            width: rem(60);
            margin-right: rem(20);
          }
          span {
            font-size: rem(32);
            color: rgba(51, 51, 51, 1);
            vertical-align: middle;
          }
        }
        .text {
          text-align: right;
          font-size: rem(26);
          color: rgba(153, 153, 153, 1);
          float: right;
        }
      }
    }

    .tool-tip {
      position: fixed;
      top: 20%;
      left: 50%;
      z-index: 999999999999;
      transform: translateX(-50%);
      width: rem(420);
      padding: rem(32);
      background: rgba(0, 0, 0, 0.7);
      border-radius: rem(10);
      font-size: rem(28);
      color: rgba(255, 255, 255, 1);
      line-height: rem(40);
      text-align: center;
    }

    .wechat-tip-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 99999999999999999999;
      background: rgba(0, 0, 0, 0.5);
      .content {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        width: rem(480);
        background: #ffffff;
        border-radius: rem(10);
        padding: rem(55) rem(40);
        p {
          font-size: rem(32);
          color: rgba(51, 51, 51, 1);
          line-height: rem(54);
          margin-bottom: rem(40);
        }
        a {
          float: right;
          font-size: rem(26);
          color: rgba(36, 107, 255, 1);
        }
      }
    }

    .loading-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 99999999999999999999;
      background: rgba(0, 0, 0, 0.5);
      .content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: rem(380);
        height: rem(242);
        background: #ffffff;
        border-radius: rem(10);
        text-align: center;
        box-sizing: border-box;
        padding-top: rem(64);
        img {
          display: inline-block;
          width: rem(55);
          margin: 0 auto;
          animation: rotate1 2s linear infinite;
        }
        p {
          color: rgba(51, 51, 51, 1);
          font-size: rem(30);
          padding: rem(25) rem(20) 0;
        }
      }
    }

    .service-model {
      .content {
        position: absolute;
        left: rem(45);
        right: rem(45);
        top: rem(45);
        bottom: rem(45);
        width: auto;
        transform: none;
        .title {
          font-size: rem(36);
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
          line-height: rem(50);
        }
        .wrap {
          position: absolute;
          top: rem(147);
          bottom: rem(120);
          left: 0;
          right: 0;
          padding: 0 rem(38);
          font-size: rem(28);
          color: rgba(51, 51, 51, 1);
          line-height: rem(46);
          p {
            margin-bottom: rem(30);
            text-align: justify;
          }
        }
        .confirm-btn {
          width: rem(228);
          height: rem(72);
          background: rgba(13, 93, 254, 1);
          border-radius: rem(36);
          border: none;
          font-size: rem(30);
          color: #ffffff;
          position: absolute;
          bottom: rem(30);
          left: 50%;
          transform: translateX(-50%);
        }
      }

    }

    .code7003-model {
      .content {
        width: rem(480);
        padding: rem(55) rem(40);
        text-align: center;
        h3 {
          font-size: rem(32);
          font-weight: bolder;
          color: #333333;
          margin-bottom: rem(20);
        }
        p {
          font-size: rem(26);
          color: #666666;
          margin-bottom: rem(40);
        }
      }
    }

    .sensitive-tip{
      .content{
        h3{
          text-align: center;
          font-size:rem(32);
          font-weight:bolder;
          color:rgba(51,51,51,1);
          margin-bottom: rem(30);
        }
      }
    }

    .normal-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 999;
      .model {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .content {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 1);
        border-radius: rem(10);
        padding: rem(40) rem(32);
        width: rem(486);
        .close {
          width: rem(52);
          height: rem(52);
          background: url("./assets/images/close.png") no-repeat center/rem(32);
          position: absolute;
          right: rem(30);
          top: rem(30);
        }
        .title {
          font-size: rem(36);
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
          line-height: rem(50);
          padding-bottom: rem(20);
        }
        .btns{
          text-align: center;
          button+button{
            margin-left: rem(20);
          }
        }
      }
    }

    .btn2 {
      display: inline-block;
      text-align: center;
      width: rem(228);
      height: rem(72);
      line-height: rem(72);
      background: rgba(13, 93, 254, 1);
      border-radius: rem(36);
      border: none;
      font-size: rem(30);
      color: #ffffff;
    }
    .btn3 {
      display: inline-block;
      text-align: center;
      width: rem(228);
      height: rem(72);
      line-height: rem(72);
      background: #ffffff;
      border-radius: rem(36);
      border: 1px solid rgba(204, 204, 204, 1);
      font-size: rem(30);
      color: rgba(102, 102, 102, 1);
    }
  }

  @keyframes rotate1 {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }

  .router-fade-enter, .router-fade-leave-to {
    opacity: 0;
  }
</style>
