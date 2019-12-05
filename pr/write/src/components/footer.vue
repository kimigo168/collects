<template>
  <div class="page-footer">
    <div class="bottom">
      <div class="auto clearfix">
        <nav>
          <ul class="ul clearfix">
            <li>
              <h3>解决方案</h3>
              <dl>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=2">AI+媒体</a></dd>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=3">AI+内容创作</a></dd>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=4">AI+金融</a></dd>
                <dd><a href="http://robot.giiso.com/">Giiso机器人商店</a></dd>
                <!-- <dd><a href="https://profile.giiso.com/dist/index.html#/hot-news">Giiso写作机器人</a></dd> -->
                <dd><a href="https://cworks.giiso.com/manage/dist/index.html?v=1#/login">智书</a></dd>
              </dl>
            </li>
            <li>
              <h3>核心技术</h3>
              <dl>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=6">智能语义</a></dd>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=7">知识图谱</a></dd>
              </dl>
            </li>
            <li>
              <h3>新闻动态</h3>
              <dl>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=9">公司新闻</a></dd>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=10">行业动态</a></dd>
              </dl>
            </li>
            <li>
              <h3>关于我们</h3>
              <dl>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=12">公司介绍</a></dd>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=13">发展历程</a></dd>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=14">联系我们</a></dd>
                <dd><a href="http://profile.giiso.com/plus/list.php?tid=15">加入我们</a></dd>
              </dl>
            </li>
          </ul>
        </nav>
        <div class="QRcode">
          <img src="http://profile.giiso.com/szszsx201903134266/uploads/uploadfiles/Bottom002370-weinxin.png" alt="">
          <span>扫码关注我们</span>
        </div>
        <div class="contact">
          <dl class="tel">
            <dt><i class="tel-icon"></i>商务咨询</dt>
            <dd>0755-8672-0697</dd>
          </dl>
          <p>
            QQ : 2020601975<br>邮箱 ：contact@giiso.com<br>市场合作：0755 2222<span style="white-space:normal;">3970</span><br>媒体合作 ：marketing@giiso.com<br>地址 ：深圳市南山区清华信息港科研楼905室/1010室
          </p>
        </div>
      </div>
    </div>
    <footer class="footer">
    Copyright © 2019 深圳市智搜信息技术有限公司 All Rights Reserved.<a href="http://www.beian.mitt.gov.cn/" target="_blank">
    粤ICP备15085807</a> 公安备案号44030502001017</footer>
  </div>
</template>
<script>
export default {
  name: 'footerBot',
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.page-footer {
  color: #c9c9c9;
  transition: all .3s ease;
  background: #282d3c;
  position: relative;
  z-index: 11;
  .bottom {
    padding: 3% 0 2%;
    .auto {
      max-width: 1300px;
      margin: 0 auto;
      nav {
        width: 50%;
        float: left;
        li {
          width: 21.3334%;
          float: left;
          h3 {
            color: #fff;
            font-size: 16px;
            margin: 0;
            font-weight: normal;
            &::after {
              display: block;
              width: 17px;
              background-color: #575757;
              height: 1px;
              content: "";
              margin-top: 12px;
            }
          }
          dl {
            padding-top: 10px;
            dd {
              padding: 5px 0;
              a {
                color: #c9c9c9;
                transition: all .3s ease;
              }
            }
          }
        }
      }
      .QRcode {
        width: 10%;
        float: right;
        text-align: center;
        span {
          display: block;
          padding-top: 5px;
        }
      }
      .contact {
        width: 32%;
        float: right;
        .tel  {
          dt{
            font-size: 14px;
            .tel-icon {
              width: 18px;
              height: 18px;
              display: inline-block;
              background-image: url('../images/icons/icon_phone.png');
              background-size: 18px 18px;
              background-repeat: no-repeat;
              background-position: left center;
              margin-right: 5px;
              vertical-align: bottom;
            }
          }
          dd {
            font-size: 24px;
            color: #fff;
          }
        }
        p {
          margin: 5px 0 0;
          font-size: 16px;
          line-height: 28px;
        }
      }
    }
  }
}
@media (max-width: 1366px) {
  .page-footer {
    .bottom {
      padding: 3% 2% 2%;
    }
  }
}
  .footer {
    height: 50px;
    width: 100%;
    line-height: 50px;
    text-align: center;
    background-color: #282d3c;
    color: #fff;
    border-top: 1px solid #343a4c;
  }
</style>
