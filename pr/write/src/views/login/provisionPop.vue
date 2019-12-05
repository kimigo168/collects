<template>
  <el-dialog id="provisionPop" title="写作机器人服务协议" :visible.sync="showModel" top="12vh" width="1200px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap scroll">
      <p class="dear">欢迎您使用写作机器人服务！</p>
      <p class="tip">为使用写作机器人服务，您应当阅读并充分理解《<b>写作机器人</b>服务协议》（下简称“本协议”），尤其是免除或者限制<b>写作机器人</b>责任的条款及对用户权利的限制。除非您已充分阅读、完全理解并接受本协议所有条款，否则您无权使用<b>写作机器人</b>的写作服务。您点击“同意”或“下一步”，或您使用本平台服务，或者以其他任何明示或者默示方式表示接受本协议的，均视为您已阅读并同意签署本协议。本协议即在您与智搜公司之间产生法律效力，成为对双方均具有约束力的法律文件。</p>
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
      <p class="tip1">4.2用户在使用中，享受有限的免费体验次数。当免费体验次数达上限后，如需继续使用写作机器人服务，用户需在线付费开通会员服务。完成会员服务升级后，方可继续对文章进行编辑、保存、下载等。</p>
      <p class="tip1">4.3Giiso写作机器人PC端、手机端属于相同VIP服务体系，只需要在一个平台开通VIP后，在有效期内可以在两个不同平台享受相关服务。</p>
      <p class="tip1">4.4在线购买后，如果用户需要开具发票，请与我们联系。联系方式：0755 8672 0697。                          我们将在30个工作日内处理并以快递到付的方式寄出发票或者向您发送电子发票。</p>
      <p class="tip1">4.5会员服务期限届满后，若用户未选择续费，账户将自动变成普通账户，不再享有VIP特权。</p>
      <p class="tip1">
        4.6选择本服务系用户自愿行为，且智搜以合理的收费标准为用户提供服务，智搜保留不对已付费用户提供退费或者费用调整之权利。
      </p>
      <p class="index">五、【结束本服务的方式】</p>
      <p class="tip1">5.1VIP有效期满后，用户需要及时在线续费才可以继续使用VIP服务。如续费时智搜对产品名称、服务或价格进行了调整，双方同意按照续约当时有效的新的产品名称、服务和价格由智搜提供服务。</p>
      <p class="tip1">5.2其他收费方式：以该具体服务项目网页公布的消费信息提醒及金额为准。</p>
      <p class="tip1">5.3用户充分了解智搜的所有赠送服务项目和涉及价格的活动均为在正常服务价格之外的一次性特别优惠，优惠内容不包括赠送服务项目的修改、更新和维护费用，并且赠送服务项目不可折价冲抵服务价格、不可兑换现金。</p>
      <p class="index">六、【服务更变的方式】</p>
      <p class="tip1">6.1如因系统维护或升级的需要而暂停本服务的，智搜将尽可能事先在本站进行通告。</p>
      <p class="tip1">6.2如由于用户的软件异常出现任何影响到本服务的正常运行情况，可能造成重大网络安全问题而影响到其他用户时，智搜有权暂停用户对本服务的使用。</p>
      <p class="tip1">6.3如用户的行为违反本协议中明确约定或属智搜事先明确告知的应被终止服务的禁止性行为，智搜有权立即终止对用户提供服务并不退还任何款项。</p>
      <p class="tip1">6.4一旦智搜通过内部检测程序发现或经其他机构或用户举报而发现用户有可能正在从事违反法律、行政法规禁止性规定或本协议约定的行为时，智搜有权做出独立的判断并采取相应措施，包括但不限于限制账号的登录、暂停服务使用、终止服务不退还任何款项并要求用户赔偿因从事上述行为而给智搜造成的损失。</p>
      <p class="index">七、【知识产权&版权声明】</p>
      <p class="tip1">7.1智搜公司在本服务中提供的写作机器人的知识产权归属智搜公司所有。本服务所有内容，包括但不限于数据库、网站设计、文字和图表、软件、照片、录像、音乐、声音及前述组合，软件编译、相关源代码和软件 (包括小应用程序和脚本)，均由智搜或智搜关联企业依法拥有其知识产权，包括但不限于商标权、专利权、著作权、商业秘密等。非经智搜或智搜关联企业书面同意，任何人不得擅自使用、修改、复制、传播、改变、散布、发行或公开发表本服务程序或内容。</p>
      <p class="tip1">
        7.2Giiso写作机器人作为一款新闻的AI辅助创作工具，仅作为工具为用户提供服务。平台上提供的文章、图片等所有素材来源于网络抓取的第三方素材，均不提供版权服务。若因该些素材侵犯他人合法权益造成您被权利人追责的，您应当自行向权利人承担责任。
      </p>
      <p class="tip1">7.3知识产权政策是对符合《信息网络传播权保护条例》和其它适用的知识产权法律规定的声称侵权之通告进行回复和处理。任何单位或个人认为通过写作机器人写作智能成文引擎获得的文字内容或者用户自行编辑的内容可能涉嫌侵犯其合法权益的，应该及时向智搜公司书面反馈，并请同时提供身份证明、权属证明及详细侵权情况证明。</p>
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
      <p class="tip1">8.2如果您在使用本服务过程中违反了相关法律法规或本协议约定，相关国家机关或机构可能会对您提起诉讼、罚款或采取其他制裁措施，并要求智搜给予协助。因此给您或者他人造成损害的，您应自行承担全部责任，智搜不承担任何责任。</p>
      <p class="tip1"> 8.3如果您违反本协议约定，智搜有权进行独立判断并采取相应措施，采取包括但不限于暂停或终止向您提供服务，限制、中止、冻结或终止您对写作机器人账号的使用，追究法律责任等措施。</p>
      <p class="tip1">8.4您违反本协议约定，导致任何主体损失的，您应当独立承担责任；智搜因此遭受损失的，您也应当一并赔偿。</p>
      <p class="tip">
        本产品“写作机器人”版权归属深圳市智搜信息技术有限公司所有，本声明的所有内容最终解释权归智搜。
      </p>
      <div class="bot-btns">
        <!-- <button class="close-btn" @click="beforeClose">关闭</button> -->
        <button class="confirm-btn" @click="acceptFun">我接受</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { setTimeout } from 'timers'
import { mapMutations } from 'vuex'
export default {
  name: 'provisionPop',
  data () {
    return {
      showModel: false
    }
  },
  methods: {
    ...mapMutations(['TOGGLE_PROVISION', 'ACCEPT_PROVISION']),
    beforeClose () {
      this.TOGGLE_PROVISION(false)
    },
    acceptFun () {
      this.ACCEPT_PROVISION(true)
      this.TOGGLE_PROVISION(false)
    }
  },
  created () {
    setTimeout(() => {
      this.showModel = true
    }, 200)
  }
}
</script>
<style scoped>
  .wrap {
    width: 100%;
    height: 600px;
    position: relative;
    padding-right: 20px;
    margin-bottom: 40px;
    /* border-top: 1px solid #E5E5E5; */
    /* text-align: center; */
    padding-bottom: 10px;
  }
  .wrap .dear{
    font-size: 16px;
    color: #333;
  }
  .wrap h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    margin-top: 38px;
  }
  .wrap .tip {
    /* width: 320px; */
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    margin:10px auto 0 auto;
    text-indent: 34px;
  }
  .wrap .tip1 {
    /* width: 320px; */
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    margin:10px auto 0 auto;
  }
  .wrap .index {
    margin-top: 20px;
  }
  .wrap .asign {
    text-align: right;
    font-size: 16px;
    color: #333333;
    line-height: 26px;
    margin-top: 30px;
  }
  .wrap .tip a {
    color: #397AFF;
    padding: 0 6px;
  }
  .wrap .bot-btns {
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin-top: 20px;
  }
  .wrap .bot-btns button {
    width: 120px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 16px;
    font-size: 16px;
    background-color: #fff;
  }
  .wrap .bot-btns .close-btn {
    border: 1px solid #DEDEDE;
    color: #999999;
    margin-right: 40px;
  }
  .wrap .bot-btns .confirm-btn {
    color: #fff;
    background-color: #0E5DFF;
    outline: none;
    border: 0;
  }
</style>
<style>
  #provisionPop .el-dialog {
    border-radius: 16px;
    overflow: hidden;
  }
  #provisionPop .el-dialog__title {
    font-size: 28px;
    font-weight: bold;
    color: #333333;
  }
  #provisionPop .el-dialog__header {
    text-align: center;
    padding: 40px 20px 10px;
  }

  #provisionPop .el-dialog__headerbtn {
    font-size: 26px;
  }
  #provisionPop .el-dialog__body {
    padding: 26px 40px 0 60px;
  }
</style>
