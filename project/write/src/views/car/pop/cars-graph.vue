<template>
    <div id="cars-graph" v-loading="loading">
      <div class="graph">
        <div class="input">
                <span>
                  <img class="img1" src="./../../../images/car/fodder-input-1-1.png">
                  <b>车系</b>
                </span>
          <el-select v-model="carTypeCheck3"
                     @change="carGraphInt()"
                     @clear="fodderCarTypeClear('carTypeList3')"
                     size="medium"
                     filterable
                     remote
                     clearable
                     :reserve-keyword="false"
                     :remote-method="remoteMethod3"
                     :selectLoading="selectLoading"
                     placeholder="请输入车系关键词检索">
            <el-option
              v-for="item in carTypeList3"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div id="echart-graph" class="echart" v-show="graphEchartShow"></div>

        <p class="echart-show-btn" v-show="cloundGraph">
          <a href="javascript:;" @click="graphEchartShow =!graphEchartShow">
            <span v-if="graphEchartShow"><i class="el-icon-arrow-up"></i>收起图谱</span>
            <span v-if="!graphEchartShow"><i class="el-icon-arrow-down"></i>展开图谱</span>
          </a>
        </p>

        <div class="graph-tab" :class="{'graph-tab-2':!graphEchartShow}">
          <el-tabs class="el-tabs-children">

            <el-tab-pane label="参数配置">
              <div class="graph-item graph-config" v-show="!graphConfigLoading && graphConfigData.length>0">
                <div class="table-left-header" id="table-left-header">
                  <table>
                    <tbody>
                    <tr class="header">
                      <td>车型名称</td>
                      <td v-for="item in graphConfigData">{{item.p_chexingmingcheng}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="table-left" id="table-left">
                  <table>
                    <tbody>
                    <tr class="header">
                      <td>车型名称</td>
                      <td v-for="item in graphConfigData">{{item.p_chexingmingcheng}}</td>
                    </tr>
                    <tr>
                      <td>品牌</td>
                      <td v-for="item in graphConfigData">{{item.p_pinpai}}</td>
                    </tr>
                    <tr>
                      <td>车系</td>
                      <td v-for="item in graphConfigData">{{item.p_chexi}}</td>
                    </tr>
                    <tr>
                      <td>厂商</td>
                      <td v-for="item in graphConfigData">{{item.p_changshang}}</td>
                    </tr>
                    <tr>
                      <td>年款</td>
                      <td v-for="item in graphConfigData">{{item.p_niankuan}}</td>
                    </tr>
                    <tr>
                      <td>更新时间</td>
                      <td v-for="item in graphConfigData">{{item.p_gengxinshijian}}</td>
                    </tr>
                    <tr>
                      <td>上市时间</td>
                      <td v-for="item in graphConfigData">{{item.p_shangshishijian}}</td>
                    </tr>
                    <tr>
                      <td>厂商指导价</td>
                      <td v-for="item in graphConfigData">{{item.p_changshangzhidaojia_yuan}}</td>
                    </tr>
                    <tr>
                      <td>级别</td>
                      <td v-for="item in graphConfigData">{{item.p_jibie}}</td>
                    </tr>
                    <tr>
                      <td>发动机</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongji}}</td>
                    </tr>
                    <tr>
                      <td>变速箱</td>
                      <td v-for="item in graphConfigData">{{item.p_biansuxiang}}</td>
                    </tr>
                    <tr>
                      <td>长*宽*高</td>
                      <td v-for="item in graphConfigData">{{item.p_chang_kuan_gao_mm}}</td>
                    </tr>
                    <tr>
                      <td>车身结构</td>
                      <td v-for="item in graphConfigData">{{item.p_cheshenjiegou}}</td>
                    </tr>
                    <tr>
                      <td>最高车速</td>
                      <td v-for="item in graphConfigData">{{item.p_zuigaochesu_km_h}}</td>
                    </tr>
                    <tr>
                      <td>官方0-100km/h加速</td>
                      <td v-for="item in graphConfigData">{{item.p_guanfang0_100km_hjiasu_s}}</td>
                    </tr>
                    <tr>
                      <td>实测0-100km/h加速</td>
                      <td v-for="item in graphConfigData">{{item.p_shice0_100km_hjiasu_s}}</td>
                    </tr>
                    <tr>
                      <td>实测100-0km/h制动</td>
                      <td v-for="item in graphConfigData">{{item.p_shice100_0km_hzhidong_m}}</td>
                    </tr>
                    <tr>
                      <td>实测离地间隙</td>
                      <td v-for="item in graphConfigData">{{item.p_shicelidijianxi_mm}}</td>
                    </tr>
                    <tr>
                      <td>工信部综合油耗</td>
                      <td v-for="item in graphConfigData">{{item.p_gongxinbuzongheyouhao_l_100km}}</td>
                    </tr>
                    <tr>
                      <td>实测油耗</td>
                      <td v-for="item in graphConfigData">{{item.p_shiceyouhao_l_100km}}</td>
                    </tr>
                    <tr>
                      <td>整车质保</td>
                      <td v-for="item in graphConfigData">{{item.p_zhengchezhibao}}</td>
                    </tr>
                    <tr>
                      <td>轴距</td>
                      <td v-for="item in graphConfigData">{{item.p_zhouju_mm}}</td>
                    </tr>
                    <tr>
                      <td>前轮距</td>
                      <td v-for="item in graphConfigData">{{item.p_qianlunju_mm}}</td>
                    </tr>
                    <tr>
                      <td>后轮距</td>
                      <td v-for="item in graphConfigData">{{item.p_houlunju_mm}}</td>
                    </tr>
                    <tr>
                      <td>最小离地间隙</td>
                      <td v-for="item in graphConfigData">{{item.p_zuixiaolidijianxi_mm}}</td>
                    </tr>
                    <tr>
                      <td>车门数</td>
                      <td v-for="item in graphConfigData">{{item.p_chemenshu_ge}}</td>
                    </tr>
                    <tr>
                      <td>座位数</td>
                      <td v-for="item in graphConfigData">{{item.p_zuoweishu_ge}}</td>
                    </tr>
                    <tr>
                      <td>油箱容积</td>
                      <td v-for="item in graphConfigData">{{item.p_youxiangrongji_l}}</td>
                    </tr>
                    <tr>
                      <td>行李厢容积</td>
                      <td v-for="item in graphConfigData">{{item.p_hanglixiangrongji_l}}</td>
                    </tr>
                    <tr>
                      <td>后排车门开启方式</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaichemenkaiqifangshi}}</td>
                    </tr>
                    <tr>
                      <td>货箱尺寸</td>
                      <td v-for="item in graphConfigData">{{item.p_huoxiangchicun_mm}}</td>
                    </tr>
                    <tr>
                      <td>整备质量</td>
                      <td v-for="item in graphConfigData">{{item.p_zhengbeizhiliang_kg}}</td>
                    </tr>
                    <tr>
                      <td>发动机型号</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongjixinghao}}</td>
                    </tr>
                    <tr>
                      <td>排量</td>
                      <td v-for="item in graphConfigData">{{item.p_pailiang_ml}}</td>
                    </tr>
                    <tr>
                      <td>进气形式</td>
                      <td v-for="item in graphConfigData">{{item.p_jinqixingshi}}</td>
                    </tr>
                    <tr>
                      <td>气缸排列形式</td>
                      <td v-for="item in graphConfigData">{{item.p_qigangpailiexingshi}}</td>
                    </tr>
                    <tr>
                      <td>气缸数</td>
                      <td v-for="item in graphConfigData">{{item.p_qigangshu_ge}}</td>
                    </tr>
                    <tr>
                      <td>每缸气门数</td>
                      <td v-for="item in graphConfigData">{{item.p_meigangqimenshu_ge}}</td>
                    </tr>
                    <tr>
                      <td>压缩比</td>
                      <td v-for="item in graphConfigData">{{item.p_yasuobi}}</td>
                    </tr>
                    <tr>
                      <td>配气机构</td>
                      <td v-for="item in graphConfigData">{{item.p_peiqijigou}}</td>
                    </tr>
                    <tr>
                      <td>缸径</td>
                      <td v-for="item in graphConfigData">{{item.p_gangjing_mm}}</td>
                    </tr>
                    <tr>
                      <td>行程</td>
                      <td v-for="item in graphConfigData">{{item.p_xingcheng_mm}}</td>
                    </tr>
                    <tr>
                      <td>最大马力</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidamali_ps}}</td>
                    </tr>
                    <tr>
                      <td>最大功率</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidagongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>最大功率转速</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidagongshuaizhuansu_rpm}}</td>
                    </tr>
                    <tr>
                      <td>最大扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidaniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>最大扭矩转速</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidaniujuzhuansu_rpm}}</td>
                    </tr>
                    <tr>
                      <td>发动机特有技术</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongjiteyoujishu}}</td>
                    </tr>
                    <tr>
                      <td>燃料形式</td>
                      <td v-for="item in graphConfigData">{{item.p_ranliaoxingshi}}</td>
                    </tr>
                    <tr>
                      <td>燃油标号</td>
                      <td v-for="item in graphConfigData">{{item.p_ranyoubiaohao}}</td>
                    </tr>
                    <tr>
                      <td>供油方式</td>
                      <td v-for="item in graphConfigData">{{item.p_gongyoufangshi}}</td>
                    </tr>
                    <tr>
                      <td>缸盖材料</td>
                      <td v-for="item in graphConfigData">{{item.p_ganggaicailiao}}</td>
                    </tr>
                    <tr>
                      <td>缸体材料</td>
                      <td v-for="item in graphConfigData">{{item.p_gangticailiao}}</td>
                    </tr>
                    <tr>
                      <td>环保标准</td>
                      <td v-for="item in graphConfigData">{{item.p_huanbaobiaozhun}}</td>
                    </tr>
                    <tr>
                      <td>电机类型</td>
                      <td v-for="item in graphConfigData">{{item.p_dianjileixing}}</td>
                    </tr>
                    <tr>
                      <td>电动机总功率</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongjizonggongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>电动机总扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongjizongniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>前电动机最大功率</td>
                      <td v-for="item in graphConfigData">{{item.p_qiandiandongjizuidagongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>前电动机最大扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_qiandiandongjizuidaniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>后电动机最大功率</td>
                      <td v-for="item in graphConfigData">{{item.p_houdiandongjizuidagongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>后电动机最大扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_houdiandongjizuidaniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>系统综合功率</td>
                      <td v-for="item in graphConfigData">{{item.p_xitongzonghegongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>系统综合扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_xitongzongheniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>驱动电机数</td>
                      <td v-for="item in graphConfigData">{{item.p_qudongdianjishu}}</td>
                    </tr>
                    <tr>
                      <td>电机布局</td>
                      <td v-for="item in graphConfigData">{{item.p_dianjibuju}}</td>
                    </tr>
                    <tr>
                      <td>电池类型</td>
                      <td v-for="item in graphConfigData">{{item.p_dianchileixing}}</td>
                    </tr>
                    <tr>
                      <td>能源类型</td>
                      <td v-for="item in graphConfigData">{{item.p_nengyuanleixing}}</td>
                    </tr>
                    <tr>
                      <td>纯电续航里程</td>
                      <td v-for="item in graphConfigData">{{item.p_chundianxuhanglicheng}}</td>
                    </tr>
                    <tr>
                      <td>快充电量百分比</td>
                      <td v-for="item in graphConfigData">{{item.p_kuaichongdianliangbaifenbi}}</td>
                    </tr>
                    <tr>
                      <td>工信部续航</td>
                      <td v-for="item in graphConfigData">{{item.p_gongxinbuxuhanglicheng_km}}</td>
                    </tr>
                    <tr>
                      <td>电池容量</td>
                      <td v-for="item in graphConfigData">{{item.p_dianchirongliang_kwh}}</td>
                    </tr>
                    <tr>
                      <td>百公里耗电量</td>
                      <td v-for="item in graphConfigData">{{item.p_baigonglihaodianliang_kwh_100km}}</td>
                    </tr>
                    <tr>
                      <td>电池组质保</td>
                      <td v-for="item in graphConfigData">{{item.p_dianchizuzhibao}}</td>
                    </tr>
                    <tr>
                      <td>电池充电时间</td>
                      <td v-for="item in graphConfigData">{{item.p_dianchichongdianshijian}}</td>
                    </tr>
                    <tr>
                      <td>快充电量</td>
                      <td v-for="item in graphConfigData">{{item.p_kuaichongdianliang}}</td>
                    </tr>
                    <tr>
                      <td>充电桩价格</td>
                      <td v-for="item in graphConfigData">{{item.p_chongdianzhuangjiage}}</td>
                    </tr>
                    <tr>
                      <td>挡位个数</td>
                      <td v-for="item in graphConfigData">{{item.p_dangweigeshu}}</td>
                    </tr>
                    <tr>
                      <td>变速箱类型</td>
                      <td v-for="item in graphConfigData">{{item.p_biansuxiangleixing}}</td>
                    </tr>
                    <tr>
                      <td>简称</td>
                      <td v-for="item in graphConfigData">{{item.p_jiancheng}}</td>
                    </tr>
                    <tr>
                      <td>驱动方式</td>
                      <td v-for="item in graphConfigData">{{item.p_qudongfangshi}}</td>
                    </tr>
                    <tr>
                      <td>前悬架类型</td>
                      <td v-for="item in graphConfigData">{{item.p_qianxuanjialeixing}}</td>
                    </tr>
                    <tr>
                      <td>后悬架类型</td>
                      <td v-for="item in graphConfigData">{{item.p_houxuanjialeixing}}</td>
                    </tr>
                    <tr>
                      <td>助力类型</td>
                      <td v-for="item in graphConfigData">{{item.p_zhulileixing}}</td>
                    </tr>
                    <tr>
                      <td>车体结构</td>
                      <td v-for="item in graphConfigData">{{item.p_chetijiegou}}</td>
                    </tr>
                    <tr>
                      <td>前制动器类型</td>
                      <td v-for="item in graphConfigData">{{item.p_qianzhidongqileixing}}</td>
                    </tr>
                    <tr>
                      <td>后制动器类型</td>
                      <td v-for="item in graphConfigData">{{item.p_houzhidongqileixing}}</td>
                    </tr>
                    <tr>
                      <td>驻车制动类型</td>
                      <td v-for="item in graphConfigData">{{item.p_zhuchezhidongleixing}}</td>
                    </tr>
                    <tr>
                      <td>前轮胎规格</td>
                      <td v-for="item in graphConfigData">{{item.p_qianluntaiguige}}</td>
                    </tr>
                    <tr>
                      <td>后轮胎规格</td>
                      <td v-for="item in graphConfigData">{{item.p_houluntaiguige}}</td>
                    </tr>
                    <tr>
                      <td>备胎规格</td>
                      <td v-for="item in graphConfigData">{{item.p_beitaiguige}}</td>
                    </tr>
                    <tr>
                      <td>主/副驾驶座安全气囊</td>
                      <td v-for="item in graphConfigData">{{item.p_zhu_fujiashizuoanquanqinang}}</td>
                    </tr>
                    <tr>
                      <td>前/后排侧气囊</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaiceqinang}}</td>
                    </tr>
                    <tr>
                      <td>前/后排头部气囊</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaitoubuqinang_qilian}}</td>
                    </tr>
                    <tr>
                      <td>膝部气囊</td>
                      <td v-for="item in graphConfigData">{{item.p_xibuqinang}}</td>
                    </tr>
                    <tr>
                      <td>胎压监测装置</td>
                      <td v-for="item in graphConfigData">{{item.p_taiyajiancezhuangzhi}}</td>
                    </tr>
                    <tr>
                      <td>零胎压继续行驶</td>
                      <td v-for="item in graphConfigData">{{item.p_lingtaiyajixuhangshi}}</td>
                    </tr>
                    <tr>
                      <td>安全带未系提示</td>
                      <td v-for="item in graphConfigData">{{item.p_anquandaiweixitishi}}</td>
                    </tr>
                    <tr>
                      <td>ISOFIX儿童座椅接口</td>
                      <td v-for="item in graphConfigData">{{item.p_isofixertongzuoyijiekou}}</td>
                    </tr>
                    <tr>
                      <td>ABS防抱死</td>
                      <td v-for="item in graphConfigData">{{item.p_absfangbaosi}}</td>
                    </tr>
                    <tr>
                      <td>制动力分配</td>
                      <td v-for="item in graphConfigData">{{item.p_zhidonglifenpei_ebd_cbcdeng}}</td>
                    </tr>
                    <tr>
                      <td>刹车辅助</td>
                      <td v-for="item in graphConfigData">{{item.p_chachefuzhu_eba_bas_badeng}}</td>
                    </tr>
                    <tr>
                      <td>牵引力控制</td>
                      <td v-for="item in graphConfigData">{{item.p_qianyinlikongzhi_asr_tcs_trcdeng}}</td>
                    </tr>
                    <tr>
                      <td>车身稳定控制</td>
                      <td v-for="item in graphConfigData">{{item.p_cheshenwendingkongzhi_esc_esp_dscdeng}}</td>
                    </tr>
                    <tr>
                      <td>并线辅助</td>
                      <td v-for="item in graphConfigData">{{item.p_bingxianfuzhu}}</td>
                    </tr>
                    <tr>
                      <td>车道偏离预警系统</td>
                      <td v-for="item in graphConfigData">{{item.p_chedaopianliyujingxitong}}</td>
                    </tr>
                    <tr>
                      <td>主动刹车/主动安全系统</td>
                      <td v-for="item in graphConfigData">{{item.p_zhudongchache_zhudonganquanxitong}}</td>
                    </tr>
                    <tr>
                      <td>夜视系统</td>
                      <td v-for="item in graphConfigData">{{item.p_yeshixitong}}</td>
                    </tr>
                    <tr>
                      <td>疲劳驾驶提示</td>
                      <td v-for="item in graphConfigData">{{item.p_pilaojiashitishi}}</td>
                    </tr>
                    <tr>
                      <td>前/后驻车雷达</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houzhucheleida}}</td>
                    </tr>
                    <tr>
                      <td>倒车视频影像达</td>
                      <td v-for="item in graphConfigData">{{item.p_daocheshipinyingxiang}}</td>
                    </tr>
                    <tr>
                      <td>全景摄像头</td>
                      <td v-for="item in graphConfigData">{{item.p_quanjingshexiangtou}}</td>
                    </tr>
                    <tr>
                      <td>定速巡航</td>
                      <td v-for="item in graphConfigData">{{item.p_dingsuxunhang}}</td>
                    </tr>
                    <tr>
                      <td>自适应巡航</td>
                      <td v-for="item in graphConfigData">{{item.p_zishiyingxunhang}}</td>
                    </tr>
                    <tr>
                      <td>自动泊车入位</td>
                      <td v-for="item in graphConfigData">{{item.p_zidongbocheruwei}}</td>
                    </tr>
                    <tr>
                      <td>发动机启停技术</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongjiqitingjishu}}</td>
                    </tr>
                    <tr>
                      <td>自动驾驶技术</td>
                      <td v-for="item in graphConfigData">{{item.p_zidongjiashijishu}}</td>
                    </tr>
                    <tr>
                      <td>上坡辅助</td>
                      <td v-for="item in graphConfigData">{{item.p_shangpofuzhu}}</td>
                    </tr>
                    <tr>
                      <td>自动驻车</td>
                      <td v-for="item in graphConfigData">{{item.p_zidongzhuche}}</td>
                    </tr>
                    <tr>
                      <td>陡坡缓降</td>
                      <td v-for="item in graphConfigData">{{item.p_doupohuanjiang}}</td>
                    </tr>
                    <tr>
                      <td>可变悬架</td>
                      <td v-for="item in graphConfigData">{{item.p_kebianxuanjia}}</td>
                    </tr>
                    <tr>
                      <td>空气悬架</td>
                      <td v-for="item in graphConfigData">{{item.p_kongqixuanjia}}</td>
                    </tr>
                    <tr>
                      <td>电磁感应悬架</td>
                      <td v-for="item in graphConfigData">{{item.p_dianciganyingxuanjia}}</td>
                    </tr>
                    <tr>
                      <td>可变转向比</td>
                      <td v-for="item in graphConfigData">{{item.p_kebianzhuanxiangbi}}</td>
                    </tr>
                    <tr>
                      <td>前桥限滑差速器/差速锁</td>
                      <td v-for="item in graphConfigData">{{item.p_qianqiaoxianhuachasuqi_chasusuo}}</td>
                    </tr>
                    <tr>
                      <td>中央差速器锁止功能</td>
                      <td v-for="item in graphConfigData">{{item.p_zhongyangchasuqisuozhigongneng}}</td>
                    </tr>
                    <tr>
                      <td>后桥限滑差速器/差速锁</td>
                      <td v-for="item in graphConfigData">{{item.p_houqiaoxianhuachasuqi_chasusuo}}</td>
                    </tr>
                    <tr>
                      <td>整体主动转向系统</td>
                      <td v-for="item in graphConfigData">{{item.p_zhengtizhudongzhuanxiangxitong}}</td>
                    </tr>
                    <tr>
                      <td>电动天窗</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongtianchuang}}</td>
                    </tr>
                    <tr>
                      <td>全景天窗</td>
                      <td v-for="item in graphConfigData">{{item.p_quanjingtianchuang}}</td>
                    </tr>
                    <tr>
                      <td>运动外观套件</td>
                      <td v-for="item in graphConfigData">{{item.p_yundongwaiguantaojian}}</td>
                    </tr>
                    <tr>
                      <td>铝合金轮圈</td>
                      <td v-for="item in graphConfigData">{{item.p_lvhejinlunquan}}</td>
                    </tr>
                    <tr>
                      <td>电动吸合门</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongxihemen}}</td>
                    </tr>
                    <tr>
                      <td>侧滑门</td>
                      <td v-for="item in graphConfigData">{{item.p_cehuamen}}</td>
                    </tr>
                    <tr>
                      <td>电动后备厢</td>
                      <td v-for="item in graphConfigData">{{item.p_diandonghoubeixiang}}</td>
                    </tr>
                    <tr>
                      <td>感应后备厢</td>
                      <td v-for="item in graphConfigData">{{item.p_ganyinghoubeixiang}}</td>
                    </tr>
                    <tr>
                      <td>车顶行李架</td>
                      <td v-for="item in graphConfigData">{{item.p_chedinghanglijia}}</td>
                    </tr>
                    <tr>
                      <td>发动机电子防盗</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongjidianzifangdao}}</td>
                    </tr>
                    <tr>
                      <td>车内中控锁</td>
                      <td v-for="item in graphConfigData">{{item.p_cheneizhongkongsuo}}</td>
                    </tr>
                    <tr>
                      <td>遥控钥匙</td>
                      <td v-for="item in graphConfigData">{{item.p_yaokongyuechi}}</td>
                    </tr>
                    <tr>
                      <td>无钥匙启动系统</td>
                      <td v-for="item in graphConfigData">{{item.p_wuyuechiqidongxitong}}</td>
                    </tr>
                    <tr>
                      <td>无钥匙进入系统</td>
                      <td v-for="item in graphConfigData">{{item.p_wuyuechijinruxitong}}</td>
                    </tr>
                    <tr>
                      <td>远程启动</td>
                      <td v-for="item in graphConfigData">{{item.p_yuanchengqidong}}</td>
                    </tr>
                    <tr>
                      <td>皮质方向盘</td>
                      <td v-for="item in graphConfigData">{{item.p_pizhifangxiangpan}}</td>
                    </tr>
                    <tr>
                      <td>方向盘调节</td>
                      <td v-for="item in graphConfigData">{{item.p_fangxiangpantiaojie}}</td>
                    </tr>
                    <tr>
                      <td>方向盘电动调节</td>
                      <td v-for="item in graphConfigData">{{item.p_fangxiangpandiandongtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>多功能方向盘</td>
                      <td v-for="item in graphConfigData">{{item.p_duogongnengfangxiangpan}}</td>
                    </tr>
                    <tr>
                      <td>方向盘换挡</td>
                      <td v-for="item in graphConfigData">{{item.p_fangxiangpanhuandang}}</td>
                    </tr>
                    <tr>
                      <td>方向盘记忆</td>
                      <td v-for="item in graphConfigData">{{item.p_fangxiangpanjiyi}}</td>
                    </tr>
                    <tr>
                      <td>行车电脑显示屏</td>
                      <td v-for="item in graphConfigData">{{item.p_hangchediannaoxianshiping}}</td>
                    </tr>
                    <tr>
                      <td>全液晶仪表盘</td>
                      <td v-for="item in graphConfigData">{{item.p_quanyejingyibiaopan}}</td>
                    </tr>
                    <tr>
                      <td>HUD抬头数字显示</td>
                      <td v-for="item in graphConfigData">{{item.p_hudtaitoushuzixianshi}}</td>
                    </tr>
                    <tr>
                      <td>内置行车记录仪</td>
                      <td v-for="item in graphConfigData">{{item.p_neizhihangchejiluyi}}</td>
                    </tr>
                    <tr>
                      <td>主动降噪</td>
                      <td v-for="item in graphConfigData">{{item.p_zhudongjiangzao}}</td>
                    </tr>
                    <tr>
                      <td>手机无线充电</td>
                      <td v-for="item in graphConfigData">{{item.p_shoujiwuxianchongdian}}</td>
                    </tr>
                    <tr>
                      <td>座椅材质</td>
                      <td v-for="item in graphConfigData">{{item.p_zuoyicaizhi}}</td>
                    </tr>
                    <tr>
                      <td>运动风格座椅</td>
                      <td v-for="item in graphConfigData">{{item.p_yundongfenggezuoyi}}</td>
                    </tr>
                    <tr>
                      <td>座椅高低调节</td>
                      <td v-for="item in graphConfigData">{{item.p_zuoyigaoditiaojie}}</td>
                    </tr>
                    <tr>
                      <td>腰部支撑调节</td>
                      <td v-for="item in graphConfigData">{{item.p_yaobuzhichengtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>肩部支撑调节</td>
                      <td v-for="item in graphConfigData">{{item.p_jianbuzhichengtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>主/副驾驶座电动调节</td>
                      <td v-for="item in graphConfigData">{{item.p_zhu_fujiashizuodiandongtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>第二排靠背角度调节</td>
                      <td v-for="item in graphConfigData">{{item.p_dierpaikaobeijiaodutiaojie}}</td>
                    </tr>
                    <tr>
                      <td>第二排座椅移动</td>
                      <td v-for="item in graphConfigData">{{item.p_dierpaizuoyiyidong}}</td>
                    </tr>
                    <tr>
                      <td>后排座椅电动调节</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaizuoyidiandongtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>电动座椅记忆</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongzuoyijiyi}}</td>
                    </tr>
                    <tr>
                      <td>前/后排座椅加热</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaizuoyijiare}}</td>
                    </tr>
                    <tr>
                      <td>前/后排座椅通风</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaizuoyitongfeng}}</td>
                    </tr>
                    <tr>
                      <td>前/后排座椅按摩</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaizuoyianmo}}</td>
                    </tr>
                    <tr>
                      <td>第二排独立座椅</td>
                      <td v-for="item in graphConfigData">{{item.p_dierpaidulizuoyi}}</td>
                    </tr>
                    <tr>
                      <td>第三排座椅</td>
                      <td v-for="item in graphConfigData">{{item.p_disanpaizuoyi}}</td>
                    </tr>
                    <tr>
                      <td>后排座椅放倒方式</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaizuoyifangdaofangshi}}</td>
                    </tr>
                    <tr>
                      <td>前/后中央扶手</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houzhongyangfushou}}</td>
                    </tr>
                    <tr>
                      <td>后排杯架</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaibeijia}}</td>
                    </tr>
                    <tr>
                      <td>可加热/制冷杯架</td>
                      <td v-for="item in graphConfigData">{{item.p_kejiare_zhilengbeijia}}</td>
                    </tr>
                    <tr>
                      <td>GPS导航系统</td>
                      <td v-for="item in graphConfigData">{{item.p_gpsdaohangxitong}}</td>
                    </tr>
                    <tr>
                      <td>定位互动服务</td>
                      <td v-for="item in graphConfigData">{{item.p_dingweihudongfuwu}}</td>
                    </tr>
                    <tr>
                      <td>中控台彩色大屏</td>
                      <td v-for="item in graphConfigData">{{item.p_zhongkongtaicaisedaping}}</td>
                    </tr>
                    <tr>
                      <td>中控台彩色大屏尺寸</td>
                      <td v-for="item in graphConfigData">{{item.p_zhongkongtaicaisedapingchicun}}</td>
                    </tr>
                    <tr>
                      <td>中控液晶屏分屏显示</td>
                      <td v-for="item in graphConfigData">{{item.p_zhongkongyejingpingfenpingxianshi}}</td>
                    </tr>
                    <tr>
                      <td>蓝牙/车载电话</td>
                      <td v-for="item in graphConfigData">{{item.p_lanya_chezaidianhua}}</td>
                    </tr>
                    <tr>
                      <td>手机互联/映射</td>
                      <td v-for="item in graphConfigData">{{item.p_shoujihulian_yingshe}}</td>
                    </tr>
                    <tr>
                      <td>车联网</td>
                      <td v-for="item in graphConfigData">{{item.p_chelianwang}}</td>
                    </tr>
                    <tr>
                      <td>车载电视</td>
                      <td v-for="item in graphConfigData">{{item.p_chezaidianshi}}</td>
                    </tr>
                    <tr>
                      <td>后排液晶屏</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaiyejingping}}</td>
                    </tr>
                    <tr>
                      <td>220V/230V电源</td>
                      <td v-for="item in graphConfigData">{{item.p_220v_230vdianyuan}}</td>
                    </tr>
                    <tr>
                      <td>外接音源接口</td>
                      <td v-for="item in graphConfigData">{{item.p_waijieyinyuanjiekou}}</td>
                    </tr>
                    <tr>
                      <td>CD/DVD</td>
                      <td v-for="item in graphConfigData">{{item.p_cd_dvd}}</td>
                    </tr>
                    <tr>
                      <td>扬声器品牌</td>
                      <td v-for="item in graphConfigData">{{item.p_yangshengqipinpai}}</td>
                    </tr>
                    <tr>
                      <td>扬声器数量</td>
                      <td v-for="item in graphConfigData">{{item.p_yangshengqishuliang}}</td>
                    </tr>
                    <tr>
                      <td>近光灯</td>
                      <td v-for="item in graphConfigData">{{item.p_jinguangdeng}}</td>
                    </tr>
                    <tr>
                      <td>远光灯</td>
                      <td v-for="item in graphConfigData">{{item.p_yuanguangdeng}}</td>
                    </tr>
                    <tr>
                      <td>LED日间行车灯</td>
                      <td v-for="item in graphConfigData">{{item.p_ledrijianhangchedeng}}</td>
                    </tr>
                    <tr>
                      <td>自适应远近光</td>
                      <td v-for="item in graphConfigData">{{item.p_zishiyingyuanjinguang}}</td>
                    </tr>
                    <tr>
                      <td>自动头灯</td>
                      <td v-for="item in graphConfigData">{{item.p_zidongtoudeng}}</td>
                    </tr>
                    <tr>
                      <td>转向辅助灯</td>
                      <td v-for="item in graphConfigData">{{item.p_zhuanxiangfuzhudeng}}</td>
                    </tr>
                    <tr>
                      <td>转向头灯</td>
                      <td v-for="item in graphConfigData">{{item.p_zhuanxiangtoudeng}}</td>
                    </tr>
                    <tr>
                      <td>前雾灯</td>
                      <td v-for="item in graphConfigData">{{item.p_qianwudeng}}</td>
                    </tr>
                    <tr>
                      <td>大灯高度可调</td>
                      <td v-for="item in graphConfigData">{{item.p_dadenggaoduketiao}}</td>
                    </tr>
                    <tr>
                      <td>大灯清洗装置</td>
                      <td v-for="item in graphConfigData">{{item.p_dadengqingxizhuangzhi}}</td>
                    </tr>
                    <tr>
                      <td>车内氛围灯</td>
                      <td v-for="item in graphConfigData">{{item.p_cheneifenweideng}}</td>
                    </tr>
                    <tr>
                      <td>前/后电动车窗</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houdiandongchechuang}}</td>
                    </tr>
                    <tr>
                      <td>车窗一键升降</td>
                      <td v-for="item in graphConfigData">{{item.p_chechuangyijianshengjiang}}</td>
                    </tr>
                    <tr>
                      <td>车窗防夹手功能</td>
                      <td v-for="item in graphConfigData">{{item.p_chechuangfangjiashougongneng}}</td>
                    </tr>
                    <tr>
                      <td>防紫外线/隔热玻璃</td>
                      <td v-for="item in graphConfigData">{{item.p_fangziwaixian_gereboli}}</td>
                    </tr>
                    <tr>
                      <td>后视镜电动调节</td>
                      <td v-for="item in graphConfigData">{{item.p_houshijingdiandongtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>后视镜加热</td>
                      <td v-for="item in graphConfigData">{{item.p_houshijingjiare}}</td>
                    </tr>
                    <tr>
                      <td>内/外后视镜自动防眩目</td>
                      <td v-for="item in graphConfigData">{{item.p_nei_waihoushijingzidongfangxuanmu}}</td>
                    </tr>
                    <tr>
                      <td>流媒体车内后视镜</td>
                      <td v-for="item in graphConfigData">{{item.p_liumeiticheneihoushijing}}</td>
                    </tr>
                    <tr>
                      <td>后视镜电动折叠</td>
                      <td v-for="item in graphConfigData">{{item.p_houshijingdiandongzhedie}}</td>
                    </tr>
                    <tr>
                      <td>后视镜记忆</td>
                      <td v-for="item in graphConfigData">{{item.p_houshijingjiyi}}</td>
                    </tr>
                    <tr>
                      <td>后风挡遮阳帘</td>
                      <td v-for="item in graphConfigData">{{item.p_houfengdangzheyanglian}}</td>
                    </tr>
                    <tr>
                      <td>后排侧遮阳帘</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaicezheyanglian}}</td>
                    </tr>
                    <tr>
                      <td>后排侧隐私玻璃</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaiceyinsiboli}}</td>
                    </tr>
                    <tr>
                      <td>遮阳板化妆镜</td>
                      <td v-for="item in graphConfigData">{{item.p_zheyangbanhuazhuangjing}}</td>
                    </tr>
                    <tr>
                      <td>后雨刷</td>
                      <td v-for="item in graphConfigData">{{item.p_houyushua}}</td>
                    </tr>
                    <tr>
                      <td>感应雨刷</td>
                      <td v-for="item in graphConfigData">{{item.p_ganyingyushua}}</td>
                    </tr>
                    <tr>
                      <td>空调控制方式</td>
                      <td v-for="item in graphConfigData">{{item.p_kongtiaokongzhifangshi}}</td>
                    </tr>
                    <tr>
                      <td>后排独立空调</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaidulikongtiao}}</td>
                    </tr>
                    <tr>
                      <td>后座出风口</td>
                      <td v-for="item in graphConfigData">{{item.p_houzuochufengkou}}</td>
                    </tr>
                    <tr>
                      <td>温度分区控制</td>
                      <td v-for="item in graphConfigData">{{item.p_wendufenqukongzhi}}</td>
                    </tr>
                    <tr>
                      <td>车内空气调节/花粉过滤</td>
                      <td v-for="item in graphConfigData">{{item.p_cheneikongqitiaojie_huafenguolv}}</td>
                    </tr>
                    <tr>
                      <td>车载空气净化器</td>
                      <td v-for="item in graphConfigData">{{item.p_chezaikongqijinghuaqi}}</td>
                    </tr>
                    <tr>
                      <td>车载冰箱</td>
                      <td v-for="item in graphConfigData">{{item.p_chezaibingxiang}}</td>
                    </tr>
                    <tr>
                      <td>外观颜色</td>
                      <td v-for="item in graphConfigData">{{item.p_waiguanyanse}}</td>
                    </tr>
                    <tr>
                      <td>内饰颜色</td>
                      <td v-for="item in graphConfigData">{{item.p_neishiyanse}}</td>
                    </tr>

                    </tbody>
                  </table>
                </div>
                <div class="table-header" id="table-header">
                  <table>
                    <tbody>
                    <tr class="header">
                      <td>车型名称</td>
                      <td v-for="item in graphConfigData">{{item.p_chexingmingcheng}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="table-content scroll" id="table-content">
                  <table>
                    <tbody>
                    <tr class="header">
                      <td>车型名称</td>
                      <td v-for="item in graphConfigData">{{item.p_chexingmingcheng}}</td>
                    </tr>
                    <tr>
                      <td>品牌</td>
                      <td v-for="item in graphConfigData">{{item.p_pinpai}}</td>
                    </tr>
                    <tr>
                      <td>车系</td>
                      <td v-for="item in graphConfigData">{{item.p_chexi}}</td>
                    </tr>
                    <tr>
                      <td>厂商</td>
                      <td v-for="item in graphConfigData">{{item.p_changshang}}</td>
                    </tr>
                    <tr>
                      <td>年款</td>
                      <td v-for="item in graphConfigData">{{item.p_niankuan}}</td>
                    </tr>
                    <tr>
                      <td>更新时间</td>
                      <td v-for="item in graphConfigData">{{item.p_gengxinshijian}}</td>
                    </tr>
                    <tr>
                      <td>上市时间</td>
                      <td v-for="item in graphConfigData">{{item.p_shangshishijian}}</td>
                    </tr>
                    <tr>
                      <td>厂商指导价</td>
                      <td v-for="item in graphConfigData">{{item.p_changshangzhidaojia_yuan}}</td>
                    </tr>
                    <tr>
                      <td>级别</td>
                      <td v-for="item in graphConfigData">{{item.p_jibie}}</td>
                    </tr>
                    <tr>
                      <td>发动机</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongji}}</td>
                    </tr>
                    <tr>
                      <td>变速箱</td>
                      <td v-for="item in graphConfigData">{{item.p_biansuxiang}}</td>
                    </tr>
                    <tr>
                      <td>长*宽*高</td>
                      <td v-for="item in graphConfigData">{{item.p_chang_kuan_gao_mm}}</td>
                    </tr>
                    <tr>
                      <td>车身结构</td>
                      <td v-for="item in graphConfigData">{{item.p_cheshenjiegou}}</td>
                    </tr>
                    <tr>
                      <td>最高车速</td>
                      <td v-for="item in graphConfigData">{{item.p_zuigaochesu_km_h}}</td>
                    </tr>
                    <tr>
                      <td>官方0-100km/h加速</td>
                      <td v-for="item in graphConfigData">{{item.p_guanfang0_100km_hjiasu_s}}</td>
                    </tr>
                    <tr>
                      <td>实测0-100km/h加速</td>
                      <td v-for="item in graphConfigData">{{item.p_shice0_100km_hjiasu_s}}</td>
                    </tr>
                    <tr>
                      <td>实测100-0km/h制动</td>
                      <td v-for="item in graphConfigData">{{item.p_shice100_0km_hzhidong_m}}</td>
                    </tr>
                    <tr>
                      <td>实测离地间隙</td>
                      <td v-for="item in graphConfigData">{{item.p_shicelidijianxi_mm}}</td>
                    </tr>
                    <tr>
                      <td>工信部综合油耗</td>
                      <td v-for="item in graphConfigData">{{item.p_gongxinbuzongheyouhao_l_100km}}</td>
                    </tr>
                    <tr>
                      <td>实测油耗</td>
                      <td v-for="item in graphConfigData">{{item.p_shiceyouhao_l_100km}}</td>
                    </tr>
                    <tr>
                      <td>整车质保</td>
                      <td v-for="item in graphConfigData">{{item.p_zhengchezhibao}}</td>
                    </tr>
                    <tr>
                      <td>轴距</td>
                      <td v-for="item in graphConfigData">{{item.p_zhouju_mm}}</td>
                    </tr>
                    <tr>
                      <td>前轮距</td>
                      <td v-for="item in graphConfigData">{{item.p_qianlunju_mm}}</td>
                    </tr>
                    <tr>
                      <td>后轮距</td>
                      <td v-for="item in graphConfigData">{{item.p_houlunju_mm}}</td>
                    </tr>
                    <tr>
                      <td>最小离地间隙</td>
                      <td v-for="item in graphConfigData">{{item.p_zuixiaolidijianxi_mm}}</td>
                    </tr>
                    <tr>
                      <td>车门数</td>
                      <td v-for="item in graphConfigData">{{item.p_chemenshu_ge}}</td>
                    </tr>
                    <tr>
                      <td>座位数</td>
                      <td v-for="item in graphConfigData">{{item.p_zuoweishu_ge}}</td>
                    </tr>
                    <tr>
                      <td>油箱容积</td>
                      <td v-for="item in graphConfigData">{{item.p_youxiangrongji_l}}</td>
                    </tr>
                    <tr>
                      <td>行李厢容积</td>
                      <td v-for="item in graphConfigData">{{item.p_hanglixiangrongji_l}}</td>
                    </tr>
                    <tr>
                      <td>后排车门开启方式</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaichemenkaiqifangshi}}</td>
                    </tr>
                    <tr>
                      <td>货箱尺寸</td>
                      <td v-for="item in graphConfigData">{{item.p_huoxiangchicun_mm}}</td>
                    </tr>
                    <tr>
                      <td>整备质量</td>
                      <td v-for="item in graphConfigData">{{item.p_zhengbeizhiliang_kg}}</td>
                    </tr>
                    <tr>
                      <td>发动机型号</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongjixinghao}}</td>
                    </tr>
                    <tr>
                      <td>排量</td>
                      <td v-for="item in graphConfigData">{{item.p_pailiang_ml}}</td>
                    </tr>
                    <tr>
                      <td>进气形式</td>
                      <td v-for="item in graphConfigData">{{item.p_jinqixingshi}}</td>
                    </tr>
                    <tr>
                      <td>气缸排列形式</td>
                      <td v-for="item in graphConfigData">{{item.p_qigangpailiexingshi}}</td>
                    </tr>
                    <tr>
                      <td>气缸数</td>
                      <td v-for="item in graphConfigData">{{item.p_qigangshu_ge}}</td>
                    </tr>
                    <tr>
                      <td>每缸气门数</td>
                      <td v-for="item in graphConfigData">{{item.p_meigangqimenshu_ge}}</td>
                    </tr>
                    <tr>
                      <td>压缩比</td>
                      <td v-for="item in graphConfigData">{{item.p_yasuobi}}</td>
                    </tr>
                    <tr>
                      <td>配气机构</td>
                      <td v-for="item in graphConfigData">{{item.p_peiqijigou}}</td>
                    </tr>
                    <tr>
                      <td>缸径</td>
                      <td v-for="item in graphConfigData">{{item.p_gangjing_mm}}</td>
                    </tr>
                    <tr>
                      <td>行程</td>
                      <td v-for="item in graphConfigData">{{item.p_xingcheng_mm}}</td>
                    </tr>
                    <tr>
                      <td>最大马力</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidamali_ps}}</td>
                    </tr>
                    <tr>
                      <td>最大功率</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidagongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>最大功率转速</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidagongshuaizhuansu_rpm}}</td>
                    </tr>
                    <tr>
                      <td>最大扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidaniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>最大扭矩转速</td>
                      <td v-for="item in graphConfigData">{{item.p_zuidaniujuzhuansu_rpm}}</td>
                    </tr>
                    <tr>
                      <td>发动机特有技术</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongjiteyoujishu}}</td>
                    </tr>
                    <tr>
                      <td>燃料形式</td>
                      <td v-for="item in graphConfigData">{{item.p_ranliaoxingshi}}</td>
                    </tr>
                    <tr>
                      <td>燃油标号</td>
                      <td v-for="item in graphConfigData">{{item.p_ranyoubiaohao}}</td>
                    </tr>
                    <tr>
                      <td>供油方式</td>
                      <td v-for="item in graphConfigData">{{item.p_gongyoufangshi}}</td>
                    </tr>
                    <tr>
                      <td>缸盖材料</td>
                      <td v-for="item in graphConfigData">{{item.p_ganggaicailiao}}</td>
                    </tr>
                    <tr>
                      <td>缸体材料</td>
                      <td v-for="item in graphConfigData">{{item.p_gangticailiao}}</td>
                    </tr>
                    <tr>
                      <td>环保标准</td>
                      <td v-for="item in graphConfigData">{{item.p_huanbaobiaozhun}}</td>
                    </tr>
                    <tr>
                      <td>电机类型</td>
                      <td v-for="item in graphConfigData">{{item.p_dianjileixing}}</td>
                    </tr>
                    <tr>
                      <td>电动机总功率</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongjizonggongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>电动机总扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongjizongniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>前电动机最大功率</td>
                      <td v-for="item in graphConfigData">{{item.p_qiandiandongjizuidagongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>前电动机最大扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_qiandiandongjizuidaniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>后电动机最大功率</td>
                      <td v-for="item in graphConfigData">{{item.p_houdiandongjizuidagongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>后电动机最大扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_houdiandongjizuidaniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>系统综合功率</td>
                      <td v-for="item in graphConfigData">{{item.p_xitongzonghegongshuai_kw}}</td>
                    </tr>
                    <tr>
                      <td>系统综合扭矩</td>
                      <td v-for="item in graphConfigData">{{item.p_xitongzongheniuju_n_m}}</td>
                    </tr>
                    <tr>
                      <td>驱动电机数</td>
                      <td v-for="item in graphConfigData">{{item.p_qudongdianjishu}}</td>
                    </tr>
                    <tr>
                      <td>电机布局</td>
                      <td v-for="item in graphConfigData">{{item.p_dianjibuju}}</td>
                    </tr>
                    <tr>
                      <td>电池类型</td>
                      <td v-for="item in graphConfigData">{{item.p_dianchileixing}}</td>
                    </tr>
                    <tr>
                      <td>能源类型</td>
                      <td v-for="item in graphConfigData">{{item.p_nengyuanleixing}}</td>
                    </tr>
                    <tr>
                      <td>纯电续航里程</td>
                      <td v-for="item in graphConfigData">{{item.p_chundianxuhanglicheng}}</td>
                    </tr>
                    <tr>
                      <td>快充电量百分比</td>
                      <td v-for="item in graphConfigData">{{item.p_kuaichongdianliangbaifenbi}}</td>
                    </tr>
                    <tr>
                      <td>工信部续航</td>
                      <td v-for="item in graphConfigData">{{item.p_gongxinbuxuhanglicheng_km}}</td>
                    </tr>
                    <tr>
                      <td>电池容量</td>
                      <td v-for="item in graphConfigData">{{item.p_dianchirongliang_kwh}}</td>
                    </tr>
                    <tr>
                      <td>百公里耗电量</td>
                      <td v-for="item in graphConfigData">{{item.p_baigonglihaodianliang_kwh_100km}}</td>
                    </tr>
                    <tr>
                      <td>电池组质保</td>
                      <td v-for="item in graphConfigData">{{item.p_dianchizuzhibao}}</td>
                    </tr>
                    <tr>
                      <td>电池充电时间</td>
                      <td v-for="item in graphConfigData">{{item.p_dianchichongdianshijian}}</td>
                    </tr>
                    <tr>
                      <td>快充电量</td>
                      <td v-for="item in graphConfigData">{{item.p_kuaichongdianliang}}</td>
                    </tr>
                    <tr>
                      <td>充电桩价格</td>
                      <td v-for="item in graphConfigData">{{item.p_chongdianzhuangjiage}}</td>
                    </tr>
                    <tr>
                      <td>挡位个数</td>
                      <td v-for="item in graphConfigData">{{item.p_dangweigeshu}}</td>
                    </tr>
                    <tr>
                      <td>变速箱类型</td>
                      <td v-for="item in graphConfigData">{{item.p_biansuxiangleixing}}</td>
                    </tr>
                    <tr>
                      <td>简称</td>
                      <td v-for="item in graphConfigData">{{item.p_jiancheng}}</td>
                    </tr>
                    <tr>
                      <td>驱动方式</td>
                      <td v-for="item in graphConfigData">{{item.p_qudongfangshi}}</td>
                    </tr>
                    <tr>
                      <td>前悬架类型</td>
                      <td v-for="item in graphConfigData">{{item.p_qianxuanjialeixing}}</td>
                    </tr>
                    <tr>
                      <td>后悬架类型</td>
                      <td v-for="item in graphConfigData">{{item.p_houxuanjialeixing}}</td>
                    </tr>
                    <tr>
                      <td>助力类型</td>
                      <td v-for="item in graphConfigData">{{item.p_zhulileixing}}</td>
                    </tr>
                    <tr>
                      <td>车体结构</td>
                      <td v-for="item in graphConfigData">{{item.p_chetijiegou}}</td>
                    </tr>
                    <tr>
                      <td>前制动器类型</td>
                      <td v-for="item in graphConfigData">{{item.p_qianzhidongqileixing}}</td>
                    </tr>
                    <tr>
                      <td>后制动器类型</td>
                      <td v-for="item in graphConfigData">{{item.p_houzhidongqileixing}}</td>
                    </tr>
                    <tr>
                      <td>驻车制动类型</td>
                      <td v-for="item in graphConfigData">{{item.p_zhuchezhidongleixing}}</td>
                    </tr>
                    <tr>
                      <td>前轮胎规格</td>
                      <td v-for="item in graphConfigData">{{item.p_qianluntaiguige}}</td>
                    </tr>
                    <tr>
                      <td>后轮胎规格</td>
                      <td v-for="item in graphConfigData">{{item.p_houluntaiguige}}</td>
                    </tr>
                    <tr>
                      <td>备胎规格</td>
                      <td v-for="item in graphConfigData">{{item.p_beitaiguige}}</td>
                    </tr>
                    <tr>
                      <td>主/副驾驶座安全气囊</td>
                      <td v-for="item in graphConfigData">{{item.p_zhu_fujiashizuoanquanqinang}}</td>
                    </tr>
                    <tr>
                      <td>前/后排侧气囊</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaiceqinang}}</td>
                    </tr>
                    <tr>
                      <td>前/后排头部气囊</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaitoubuqinang_qilian}}</td>
                    </tr>
                    <tr>
                      <td>膝部气囊</td>
                      <td v-for="item in graphConfigData">{{item.p_xibuqinang}}</td>
                    </tr>
                    <tr>
                      <td>胎压监测装置</td>
                      <td v-for="item in graphConfigData">{{item.p_taiyajiancezhuangzhi}}</td>
                    </tr>
                    <tr>
                      <td>零胎压继续行驶</td>
                      <td v-for="item in graphConfigData">{{item.p_lingtaiyajixuhangshi}}</td>
                    </tr>
                    <tr>
                      <td>安全带未系提示</td>
                      <td v-for="item in graphConfigData">{{item.p_anquandaiweixitishi}}</td>
                    </tr>
                    <tr>
                      <td>ISOFIX儿童座椅接口</td>
                      <td v-for="item in graphConfigData">{{item.p_isofixertongzuoyijiekou}}</td>
                    </tr>
                    <tr>
                      <td>ABS防抱死</td>
                      <td v-for="item in graphConfigData">{{item.p_absfangbaosi}}</td>
                    </tr>
                    <tr>
                      <td>制动力分配</td>
                      <td v-for="item in graphConfigData">{{item.p_zhidonglifenpei_ebd_cbcdeng}}</td>
                    </tr>
                    <tr>
                      <td>刹车辅助</td>
                      <td v-for="item in graphConfigData">{{item.p_chachefuzhu_eba_bas_badeng}}</td>
                    </tr>
                    <tr>
                      <td>牵引力控制</td>
                      <td v-for="item in graphConfigData">{{item.p_qianyinlikongzhi_asr_tcs_trcdeng}}</td>
                    </tr>
                    <tr>
                      <td>车身稳定控制</td>
                      <td v-for="item in graphConfigData">{{item.p_cheshenwendingkongzhi_esc_esp_dscdeng}}</td>
                    </tr>
                    <tr>
                      <td>并线辅助</td>
                      <td v-for="item in graphConfigData">{{item.p_bingxianfuzhu}}</td>
                    </tr>
                    <tr>
                      <td>车道偏离预警系统</td>
                      <td v-for="item in graphConfigData">{{item.p_chedaopianliyujingxitong}}</td>
                    </tr>
                    <tr>
                      <td>主动刹车/主动安全系统</td>
                      <td v-for="item in graphConfigData">{{item.p_zhudongchache_zhudonganquanxitong}}</td>
                    </tr>
                    <tr>
                      <td>夜视系统</td>
                      <td v-for="item in graphConfigData">{{item.p_yeshixitong}}</td>
                    </tr>
                    <tr>
                      <td>疲劳驾驶提示</td>
                      <td v-for="item in graphConfigData">{{item.p_pilaojiashitishi}}</td>
                    </tr>
                    <tr>
                      <td>前/后驻车雷达</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houzhucheleida}}</td>
                    </tr>
                    <tr>
                      <td>倒车视频影像达</td>
                      <td v-for="item in graphConfigData">{{item.p_daocheshipinyingxiang}}</td>
                    </tr>
                    <tr>
                      <td>全景摄像头</td>
                      <td v-for="item in graphConfigData">{{item.p_quanjingshexiangtou}}</td>
                    </tr>
                    <tr>
                      <td>定速巡航</td>
                      <td v-for="item in graphConfigData">{{item.p_dingsuxunhang}}</td>
                    </tr>
                    <tr>
                      <td>自适应巡航</td>
                      <td v-for="item in graphConfigData">{{item.p_zishiyingxunhang}}</td>
                    </tr>
                    <tr>
                      <td>自动泊车入位</td>
                      <td v-for="item in graphConfigData">{{item.p_zidongbocheruwei}}</td>
                    </tr>
                    <tr>
                      <td>发动机启停技术</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongjiqitingjishu}}</td>
                    </tr>
                    <tr>
                      <td>自动驾驶技术</td>
                      <td v-for="item in graphConfigData">{{item.p_zidongjiashijishu}}</td>
                    </tr>
                    <tr>
                      <td>上坡辅助</td>
                      <td v-for="item in graphConfigData">{{item.p_shangpofuzhu}}</td>
                    </tr>
                    <tr>
                      <td>自动驻车</td>
                      <td v-for="item in graphConfigData">{{item.p_zidongzhuche}}</td>
                    </tr>
                    <tr>
                      <td>陡坡缓降</td>
                      <td v-for="item in graphConfigData">{{item.p_doupohuanjiang}}</td>
                    </tr>
                    <tr>
                      <td>可变悬架</td>
                      <td v-for="item in graphConfigData">{{item.p_kebianxuanjia}}</td>
                    </tr>
                    <tr>
                      <td>空气悬架</td>
                      <td v-for="item in graphConfigData">{{item.p_kongqixuanjia}}</td>
                    </tr>
                    <tr>
                      <td>电磁感应悬架</td>
                      <td v-for="item in graphConfigData">{{item.p_dianciganyingxuanjia}}</td>
                    </tr>
                    <tr>
                      <td>可变转向比</td>
                      <td v-for="item in graphConfigData">{{item.p_kebianzhuanxiangbi}}</td>
                    </tr>
                    <tr>
                      <td>前桥限滑差速器/差速锁</td>
                      <td v-for="item in graphConfigData">{{item.p_qianqiaoxianhuachasuqi_chasusuo}}</td>
                    </tr>
                    <tr>
                      <td>中央差速器锁止功能</td>
                      <td v-for="item in graphConfigData">{{item.p_zhongyangchasuqisuozhigongneng}}</td>
                    </tr>
                    <tr>
                      <td>后桥限滑差速器/差速锁</td>
                      <td v-for="item in graphConfigData">{{item.p_houqiaoxianhuachasuqi_chasusuo}}</td>
                    </tr>
                    <tr>
                      <td>整体主动转向系统</td>
                      <td v-for="item in graphConfigData">{{item.p_zhengtizhudongzhuanxiangxitong}}</td>
                    </tr>
                    <tr>
                      <td>电动天窗</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongtianchuang}}</td>
                    </tr>
                    <tr>
                      <td>全景天窗</td>
                      <td v-for="item in graphConfigData">{{item.p_quanjingtianchuang}}</td>
                    </tr>
                    <tr>
                      <td>运动外观套件</td>
                      <td v-for="item in graphConfigData">{{item.p_yundongwaiguantaojian}}</td>
                    </tr>
                    <tr>
                      <td>铝合金轮圈</td>
                      <td v-for="item in graphConfigData">{{item.p_lvhejinlunquan}}</td>
                    </tr>
                    <tr>
                      <td>电动吸合门</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongxihemen}}</td>
                    </tr>
                    <tr>
                      <td>侧滑门</td>
                      <td v-for="item in graphConfigData">{{item.p_cehuamen}}</td>
                    </tr>
                    <tr>
                      <td>电动后备厢</td>
                      <td v-for="item in graphConfigData">{{item.p_diandonghoubeixiang}}</td>
                    </tr>
                    <tr>
                      <td>感应后备厢</td>
                      <td v-for="item in graphConfigData">{{item.p_ganyinghoubeixiang}}</td>
                    </tr>
                    <tr>
                      <td>车顶行李架</td>
                      <td v-for="item in graphConfigData">{{item.p_chedinghanglijia}}</td>
                    </tr>
                    <tr>
                      <td>发动机电子防盗</td>
                      <td v-for="item in graphConfigData">{{item.p_fadongjidianzifangdao}}</td>
                    </tr>
                    <tr>
                      <td>车内中控锁</td>
                      <td v-for="item in graphConfigData">{{item.p_cheneizhongkongsuo}}</td>
                    </tr>
                    <tr>
                      <td>遥控钥匙</td>
                      <td v-for="item in graphConfigData">{{item.p_yaokongyuechi}}</td>
                    </tr>
                    <tr>
                      <td>无钥匙启动系统</td>
                      <td v-for="item in graphConfigData">{{item.p_wuyuechiqidongxitong}}</td>
                    </tr>
                    <tr>
                      <td>无钥匙进入系统</td>
                      <td v-for="item in graphConfigData">{{item.p_wuyuechijinruxitong}}</td>
                    </tr>
                    <tr>
                      <td>远程启动</td>
                      <td v-for="item in graphConfigData">{{item.p_yuanchengqidong}}</td>
                    </tr>
                    <tr>
                      <td>皮质方向盘</td>
                      <td v-for="item in graphConfigData">{{item.p_pizhifangxiangpan}}</td>
                    </tr>
                    <tr>
                      <td>方向盘调节</td>
                      <td v-for="item in graphConfigData">{{item.p_fangxiangpantiaojie}}</td>
                    </tr>
                    <tr>
                      <td>方向盘电动调节</td>
                      <td v-for="item in graphConfigData">{{item.p_fangxiangpandiandongtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>多功能方向盘</td>
                      <td v-for="item in graphConfigData">{{item.p_duogongnengfangxiangpan}}</td>
                    </tr>
                    <tr>
                      <td>方向盘换挡</td>
                      <td v-for="item in graphConfigData">{{item.p_fangxiangpanhuandang}}</td>
                    </tr>
                    <tr>
                      <td>方向盘记忆</td>
                      <td v-for="item in graphConfigData">{{item.p_fangxiangpanjiyi}}</td>
                    </tr>
                    <tr>
                      <td>行车电脑显示屏</td>
                      <td v-for="item in graphConfigData">{{item.p_hangchediannaoxianshiping}}</td>
                    </tr>
                    <tr>
                      <td>全液晶仪表盘</td>
                      <td v-for="item in graphConfigData">{{item.p_quanyejingyibiaopan}}</td>
                    </tr>
                    <tr>
                      <td>HUD抬头数字显示</td>
                      <td v-for="item in graphConfigData">{{item.p_hudtaitoushuzixianshi}}</td>
                    </tr>
                    <tr>
                      <td>内置行车记录仪</td>
                      <td v-for="item in graphConfigData">{{item.p_neizhihangchejiluyi}}</td>
                    </tr>
                    <tr>
                      <td>主动降噪</td>
                      <td v-for="item in graphConfigData">{{item.p_zhudongjiangzao}}</td>
                    </tr>
                    <tr>
                      <td>手机无线充电</td>
                      <td v-for="item in graphConfigData">{{item.p_shoujiwuxianchongdian}}</td>
                    </tr>
                    <tr>
                      <td>座椅材质</td>
                      <td v-for="item in graphConfigData">{{item.p_zuoyicaizhi}}</td>
                    </tr>
                    <tr>
                      <td>运动风格座椅</td>
                      <td v-for="item in graphConfigData">{{item.p_yundongfenggezuoyi}}</td>
                    </tr>
                    <tr>
                      <td>座椅高低调节</td>
                      <td v-for="item in graphConfigData">{{item.p_zuoyigaoditiaojie}}</td>
                    </tr>
                    <tr>
                      <td>腰部支撑调节</td>
                      <td v-for="item in graphConfigData">{{item.p_yaobuzhichengtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>肩部支撑调节</td>
                      <td v-for="item in graphConfigData">{{item.p_jianbuzhichengtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>主/副驾驶座电动调节</td>
                      <td v-for="item in graphConfigData">{{item.p_zhu_fujiashizuodiandongtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>第二排靠背角度调节</td>
                      <td v-for="item in graphConfigData">{{item.p_dierpaikaobeijiaodutiaojie}}</td>
                    </tr>
                    <tr>
                      <td>第二排座椅移动</td>
                      <td v-for="item in graphConfigData">{{item.p_dierpaizuoyiyidong}}</td>
                    </tr>
                    <tr>
                      <td>后排座椅电动调节</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaizuoyidiandongtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>电动座椅记忆</td>
                      <td v-for="item in graphConfigData">{{item.p_diandongzuoyijiyi}}</td>
                    </tr>
                    <tr>
                      <td>前/后排座椅加热</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaizuoyijiare}}</td>
                    </tr>
                    <tr>
                      <td>前/后排座椅通风</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaizuoyitongfeng}}</td>
                    </tr>
                    <tr>
                      <td>前/后排座椅按摩</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houpaizuoyianmo}}</td>
                    </tr>
                    <tr>
                      <td>第二排独立座椅</td>
                      <td v-for="item in graphConfigData">{{item.p_dierpaidulizuoyi}}</td>
                    </tr>
                    <tr>
                      <td>第三排座椅</td>
                      <td v-for="item in graphConfigData">{{item.p_disanpaizuoyi}}</td>
                    </tr>
                    <tr>
                      <td>后排座椅放倒方式</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaizuoyifangdaofangshi}}</td>
                    </tr>
                    <tr>
                      <td>前/后中央扶手</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houzhongyangfushou}}</td>
                    </tr>
                    <tr>
                      <td>后排杯架</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaibeijia}}</td>
                    </tr>
                    <tr>
                      <td>可加热/制冷杯架</td>
                      <td v-for="item in graphConfigData">{{item.p_kejiare_zhilengbeijia}}</td>
                    </tr>
                    <tr>
                      <td>GPS导航系统</td>
                      <td v-for="item in graphConfigData">{{item.p_gpsdaohangxitong}}</td>
                    </tr>
                    <tr>
                      <td>定位互动服务</td>
                      <td v-for="item in graphConfigData">{{item.p_dingweihudongfuwu}}</td>
                    </tr>
                    <tr>
                      <td>中控台彩色大屏</td>
                      <td v-for="item in graphConfigData">{{item.p_zhongkongtaicaisedaping}}</td>
                    </tr>
                    <tr>
                      <td>中控台彩色大屏尺寸</td>
                      <td v-for="item in graphConfigData">{{item.p_zhongkongtaicaisedapingchicun}}</td>
                    </tr>
                    <tr>
                      <td>中控液晶屏分屏显示</td>
                      <td v-for="item in graphConfigData">{{item.p_zhongkongyejingpingfenpingxianshi}}</td>
                    </tr>
                    <tr>
                      <td>蓝牙/车载电话</td>
                      <td v-for="item in graphConfigData">{{item.p_lanya_chezaidianhua}}</td>
                    </tr>
                    <tr>
                      <td>手机互联/映射</td>
                      <td v-for="item in graphConfigData">{{item.p_shoujihulian_yingshe}}</td>
                    </tr>
                    <tr>
                      <td>车联网</td>
                      <td v-for="item in graphConfigData">{{item.p_chelianwang}}</td>
                    </tr>
                    <tr>
                      <td>车载电视</td>
                      <td v-for="item in graphConfigData">{{item.p_chezaidianshi}}</td>
                    </tr>
                    <tr>
                      <td>后排液晶屏</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaiyejingping}}</td>
                    </tr>
                    <tr>
                      <td>220V/230V电源</td>
                      <td v-for="item in graphConfigData">{{item.p_220v_230vdianyuan}}</td>
                    </tr>
                    <tr>
                      <td>外接音源接口</td>
                      <td v-for="item in graphConfigData">{{item.p_waijieyinyuanjiekou}}</td>
                    </tr>
                    <tr>
                      <td>CD/DVD</td>
                      <td v-for="item in graphConfigData">{{item.p_cd_dvd}}</td>
                    </tr>
                    <tr>
                      <td>扬声器品牌</td>
                      <td v-for="item in graphConfigData">{{item.p_yangshengqipinpai}}</td>
                    </tr>
                    <tr>
                      <td>扬声器数量</td>
                      <td v-for="item in graphConfigData">{{item.p_yangshengqishuliang}}</td>
                    </tr>
                    <tr>
                      <td>近光灯</td>
                      <td v-for="item in graphConfigData">{{item.p_jinguangdeng}}</td>
                    </tr>
                    <tr>
                      <td>远光灯</td>
                      <td v-for="item in graphConfigData">{{item.p_yuanguangdeng}}</td>
                    </tr>
                    <tr>
                      <td>LED日间行车灯</td>
                      <td v-for="item in graphConfigData">{{item.p_ledrijianhangchedeng}}</td>
                    </tr>
                    <tr>
                      <td>自适应远近光</td>
                      <td v-for="item in graphConfigData">{{item.p_zishiyingyuanjinguang}}</td>
                    </tr>
                    <tr>
                      <td>自动头灯</td>
                      <td v-for="item in graphConfigData">{{item.p_zidongtoudeng}}</td>
                    </tr>
                    <tr>
                      <td>转向辅助灯</td>
                      <td v-for="item in graphConfigData">{{item.p_zhuanxiangfuzhudeng}}</td>
                    </tr>
                    <tr>
                      <td>转向头灯</td>
                      <td v-for="item in graphConfigData">{{item.p_zhuanxiangtoudeng}}</td>
                    </tr>
                    <tr>
                      <td>前雾灯</td>
                      <td v-for="item in graphConfigData">{{item.p_qianwudeng}}</td>
                    </tr>
                    <tr>
                      <td>大灯高度可调</td>
                      <td v-for="item in graphConfigData">{{item.p_dadenggaoduketiao}}</td>
                    </tr>
                    <tr>
                      <td>大灯清洗装置</td>
                      <td v-for="item in graphConfigData">{{item.p_dadengqingxizhuangzhi}}</td>
                    </tr>
                    <tr>
                      <td>车内氛围灯</td>
                      <td v-for="item in graphConfigData">{{item.p_cheneifenweideng}}</td>
                    </tr>
                    <tr>
                      <td>前/后电动车窗</td>
                      <td v-for="item in graphConfigData">{{item.p_qian_houdiandongchechuang}}</td>
                    </tr>
                    <tr>
                      <td>车窗一键升降</td>
                      <td v-for="item in graphConfigData">{{item.p_chechuangyijianshengjiang}}</td>
                    </tr>
                    <tr>
                      <td>车窗防夹手功能</td>
                      <td v-for="item in graphConfigData">{{item.p_chechuangfangjiashougongneng}}</td>
                    </tr>
                    <tr>
                      <td>防紫外线/隔热玻璃</td>
                      <td v-for="item in graphConfigData">{{item.p_fangziwaixian_gereboli}}</td>
                    </tr>
                    <tr>
                      <td>后视镜电动调节</td>
                      <td v-for="item in graphConfigData">{{item.p_houshijingdiandongtiaojie}}</td>
                    </tr>
                    <tr>
                      <td>后视镜加热</td>
                      <td v-for="item in graphConfigData">{{item.p_houshijingjiare}}</td>
                    </tr>
                    <tr>
                      <td>内/外后视镜自动防眩目</td>
                      <td v-for="item in graphConfigData">{{item.p_nei_waihoushijingzidongfangxuanmu}}</td>
                    </tr>
                    <tr>
                      <td>流媒体车内后视镜</td>
                      <td v-for="item in graphConfigData">{{item.p_liumeiticheneihoushijing}}</td>
                    </tr>
                    <tr>
                      <td>后视镜电动折叠</td>
                      <td v-for="item in graphConfigData">{{item.p_houshijingdiandongzhedie}}</td>
                    </tr>
                    <tr>
                      <td>后视镜记忆</td>
                      <td v-for="item in graphConfigData">{{item.p_houshijingjiyi}}</td>
                    </tr>
                    <tr>
                      <td>后风挡遮阳帘</td>
                      <td v-for="item in graphConfigData">{{item.p_houfengdangzheyanglian}}</td>
                    </tr>
                    <tr>
                      <td>后排侧遮阳帘</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaicezheyanglian}}</td>
                    </tr>
                    <tr>
                      <td>后排侧隐私玻璃</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaiceyinsiboli}}</td>
                    </tr>
                    <tr>
                      <td>遮阳板化妆镜</td>
                      <td v-for="item in graphConfigData">{{item.p_zheyangbanhuazhuangjing}}</td>
                    </tr>
                    <tr>
                      <td>后雨刷</td>
                      <td v-for="item in graphConfigData">{{item.p_houyushua}}</td>
                    </tr>
                    <tr>
                      <td>感应雨刷</td>
                      <td v-for="item in graphConfigData">{{item.p_ganyingyushua}}</td>
                    </tr>
                    <tr>
                      <td>空调控制方式</td>
                      <td v-for="item in graphConfigData">{{item.p_kongtiaokongzhifangshi}}</td>
                    </tr>
                    <tr>
                      <td>后排独立空调</td>
                      <td v-for="item in graphConfigData">{{item.p_houpaidulikongtiao}}</td>
                    </tr>
                    <tr>
                      <td>后座出风口</td>
                      <td v-for="item in graphConfigData">{{item.p_houzuochufengkou}}</td>
                    </tr>
                    <tr>
                      <td>温度分区控制</td>
                      <td v-for="item in graphConfigData">{{item.p_wendufenqukongzhi}}</td>
                    </tr>
                    <tr>
                      <td>车内空气调节/花粉过滤</td>
                      <td v-for="item in graphConfigData">{{item.p_cheneikongqitiaojie_huafenguolv}}</td>
                    </tr>
                    <tr>
                      <td>车载空气净化器</td>
                      <td v-for="item in graphConfigData">{{item.p_chezaikongqijinghuaqi}}</td>
                    </tr>
                    <tr>
                      <td>车载冰箱</td>
                      <td v-for="item in graphConfigData">{{item.p_chezaibingxiang}}</td>
                    </tr>
                    <tr>
                      <td>外观颜色</td>
                      <td v-for="item in graphConfigData">{{item.p_waiguanyanse}}</td>
                    </tr>
                    <tr>
                      <td>内饰颜色</td>
                      <td v-for="item in graphConfigData">{{item.p_neishiyanse}}</td>
                    </tr>

                    </tbody>
                  </table>
                </div>
              </div>
              <p class="no-more" v-show="graphConfigLoading">{{graphConfigLoading}}</p>
            </el-tab-pane>
            <el-tab-pane label="图片" >
              <ul class="list list-image graph-item clearfix" v-show="!graphImageLoading">
                <li v-for="item in graphImageData" @click="insertFodderImage(item.imageL)">
                  <div class="img" :style="{backgroundImage: 'url('+ item.imageS +')'}"></div>
                  <h3 :title="item.title">{{item.title}}</h3>
                </li>
              </ul>
              <p class="no-more" v-show="graphImageLoading">{{graphImageLoading}}</p>
            </el-tab-pane>
            <el-tab-pane label="口碑">
              <div class="graph-item" v-show="!graphPraiseLoading">
                <el-tag v-for="item in graphPraiseData" :key="item">{{item}}</el-tag>
              </div>
              <p class="no-more" v-show="graphPraiseLoading">{{graphPraiseLoading}}</p>
            </el-tab-pane>
            <el-tab-pane label="资讯">
              <ul class="graph-item graph-news-list " v-show="!graphNewsLoading">
                <li v-for="item in graphNewsData">
                  <h3>
                    <a href="javascript:;" @click="openNewsDetail(item._id,item.url)">{{item.title}}</a>
                  </h3>
                  <span>{{item.time}}  &nbsp;|&nbsp;  {{item.site == item.from ? item.site : item.site+'-'+item.from}}</span>
                  <p><b>摘要：</b>{{item.summary}}</p>
                </li>
              </ul>
              <p class="no-more" v-show="graphNewsLoading">{{graphNewsLoading}}</p>
            </el-tab-pane>
            <el-tab-pane label="百科">
              <div class="graph-item scroll graph-baike" v-show="!graphBaikeLoading">
                <h3>{{graphBaikeData.title}}</h3>
                <p>{{graphBaikeData.summary}}</p>
              </div>
              <p class="no-more" v-show="graphBaikeLoading">{{graphBaikeLoading}}</p>
            </el-tab-pane>
          </el-tabs>
        </div>

      </div>

      <el-dialog class="detail" :visible.sync="detailShow" width="735px">
        <div class="content scroll">
          <h3>{{detailItem.title}}</h3>
          <div class="info">
            <span>{{detailItem.author}}</span>
            <span>{{detailItem.updateTime}}</span>
            <a class="btn" style="float: right;" v-if="detailItem.url" :href="detailItem.url" target="_blank">查看原文</a>
          </div>
          <div class="article" v-html="detailItem.content"></div>
        </div>
        <div class="btns">
          <button class="btn" type="button" @click="detailShow = false">关闭</button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  var echarts = require('echarts/lib/echarts');
  require('echarts/lib/component/title')
    export default {
        data() {
            return {
              cloundGraph: null,
              carTypeCheck3: '',
              carTypeList3: [],
              graphTabActive: '0',
              graphBaseData: {},
              graphKeywordData: [],


              graphConfigData: [],
              graphConfigLoading: '',
              graphImageData: [],
              graphImageLoading: '',
              graphPraiseData: [],
              graphPraiseLoading: '',
              graphNewsData: [],
              graphNewsLoading: '',
              graphBaikeData: [],
              graphBaikeLoading: '',

              graphEchartShow: true,

              detailShow: false,
              detailItem: {},

              selectLoading: false,
              loading: false,
            }
        },
        created() {
          this.getCardTypeList('', ['carTypeList3']);
        },
        methods: {
          parentClick(idText){
            var self = this;
            self.carTypeCheck3=self.GetId(idText);
            self.carTypeList3=[{
              text:self.GetText(idText),
              id:self.GetId(idText)
            }];
            self.getGraphBaseData();
          },
          //汽车图谱选择车系
          remoteMethod3: function (query) {
            var self = this;
            self.selectLoading = true;
            if (self.timer) clearTimeout(self.timer);
            self.timer = setTimeout(function () {
              self.getCardTypeList(query, 'carTypeList3');
            }, 200)
          },
          //汽车图谱初始化
          carGraphInt: function () {
            var self = this;
            console.log(self.carTypeCheck3);
            self.getGraphBaseData();
          },
          //根据车系获取基本信息
          getGraphBaseData: function () {
            var self = this;
            if (!self.carTypeCheck3) return;
            self.loading = true;
            self.$http({
              url: self.$global.BASEURL + "/car/searchByChexing.do",
              data: {
                chexi_id: self.carTypeCheck3
              },
              success: function (data) {
                self.loading = false;
                if (data.code == 0 && data.data && data.data.data) {
                  self.graphBaseData = data.data.data;
                  self.getGraphKeywordData();

                  self.getGraphNewsData(self.graphBaseData.chexi);
                  self.getGraphConfigData(self.graphBaseData.chexiId, self.graphBaseData.niankuan);
                  self.getGraphPraiseData(self.graphBaseData.chexiId, self.graphBaseData.chexingId);
                  self.getGraphBaikeData(self.graphBaseData.chexi);
                  self.getGraphImageData(self.graphBaseData.chexiId, self.graphBaseData.niankuan);
                } else {
                  self.graphBaseData = {};
                  self.graphKeywordData = [];
                  self.setEchartGraph();
                }
              }
            })
          },
          //根据车系获取图谱关键词
          getGraphKeywordData: function () {
            var self = this;
            self.loading = true;
            self.$http({
              url: self.$global.BASEURL + "/car/knowledge.do",
              data: {
                jibie: self.graphBaseData.jibie,
                zhidaojia: self.graphBaseData.changshangzhidaojia2,
                niankuan: self.graphBaseData.niankuan,
              },
              success: function (data) {
                self.loading = false;
                if (data.code == 0 && data.data && data.data.data) {
                  self.graphKeywordData = data.data.data;
                } else {
                  self.graphKeywordData = []
                }
                self.setEchartGraph();
              }
            })
          },
          setEchartGraph: function () {
            var self = this;
            if (!this.cloundGraph) {
              this.cloundGraph = echarts.init(document.getElementById('echart-graph'));
              this.cloundGraph.on('click', function (params) {
                console.log(params.data)
                if (params.data.chexi) {
                  self.getGraphNewsData(params.data.chexi);
                  self.getGraphConfigData(params.data.chexiId, params.data.niankuan);
                  self.getGraphPraiseData(params.data.chexiId, params.data.chexingId);
                  self.getGraphBaikeData(params.data.chexi);
                  self.getGraphImageData(params.data.chexiId, params.data.niankuan);
                }
              });
            }
            var data = [{
              name: self.graphBaseData.chexi,
              chexi: self.graphBaseData.chexi,
              niankuan: self.graphBaseData.niankuan,
              chexiId: self.graphBaseData.chexiId,
              chexingId: self.graphBaseData.chexingId,
              value: (self.graphKeywordData.length + 1) * (self.graphKeywordData.length + 1)
            }];
            for (var i = 0; i < self.graphKeywordData.length; i++) {
              if (self.graphKeywordData[i].p_chexi != self.graphBaseData.chexi) {
                data.push({
                  name: self.graphKeywordData[i].p_chexi,
                  chexi: self.graphKeywordData[i].p_chexi,
                  niankuan: self.graphKeywordData[i].p_niankuan,
                  chexiId: self.graphKeywordData[i].p_chexi_id,
                  chexingId: self.graphKeywordData[i].p_chexing_id,
                  value: (self.graphKeywordData.length - i) * (self.graphKeywordData.length - i)
                });
              }
            }
            var option = {
              title: {
                text: '同级别车型：',
                left: 10,
                top: 0,
                textStyle: {
                  color: '#333333',
                  fontSize: 14
                }

              },
              tooltip: {
                formatter: "{b}"
              },
              series: [{
                type: 'wordCloud',
                gridSize: 10,
                sizeRange: [12, 30],
                rotationRange: [0, 0],
                shape: 'circle',
                textStyle: {
                  normal: {
                    color: function () {
                      return 'rgb(' + [
                          Math.round(Math.random() * 160),
                          Math.round(Math.random() * 160),
                          Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                  },
                  emphasis: {
                    color: 'red'
                  }
                },
                data: data
              }]
            };
            this.cloundGraph.setOption(option);
          },

          //根据关键词获取资讯
          getGraphNewsData: function (keyword) {
            var self = this;
            self.graphNewsData = [];
            self.graphNewsLoading = '正在加载中…';
            self.$http({
              url: self.$global.BASEURL + "/car/news/search.do",
              data: {
                keyword: keyword
              },
              success: function (data) {
                self.graphNewsLoading = '';
                if (data.code == 0 && data.data && data.data.data) {
                  self.graphNewsData = data.data.data;
                }
                if (self.graphNewsData.length == 0) self.graphNewsLoading = '暂无数据！';
              },
              error(){
                self.graphNewsLoading = '暂无数据！';
              }
            })
          },
          //中文资讯查看详情
          openNewsDetail: function (id, url) {
            var self = this;
            self.loading = true;
            self.$http({
              url: self.$global.BASEURL + "/news/detail.do",
              data: {
                type: 'zh',
                nid: id
              },
              success: function (data) {
                self.loading = false;
                if (data.code == 0 && data.data) {
                  self.detailShow = true;
                  self.detailItem = {
                    id: id,
                    title: data.data.title,
                    title2: data.data.title,
                    author: data.data.site == data.data.from ? data.data.site : data.data.site + '-' + data.data.from,
                    updateTime: data.data.time,
                    content: data.data.article,
                    url: url,
                  };
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
          //根据关键词获取参数配置
          getGraphConfigData: function (id, niankuan) {
            var self = this;
            self.graphConfigData = [];
            self.graphConfigLoading = '正在加载中…';
            self.$http({
              url: self.$global.BASEURL + "/car/seriesInfo.do",
              data: {
                id: id,
                niankuan: niankuan
              },
              success: function (data) {
                self.graphConfigLoading = '';
                if (data.code == 0 && data.data && data.data.data) {
                  self.graphConfigData = data.data.data;
                  self.$nextTick(function () {
                    document.getElementById("table-content").onscroll = function () {
                      document.getElementById("table-left").scrollTop = this.scrollTop;
                      document.getElementById("table-header").scrollLeft = this.scrollLeft;
                    }
                  })
                }
                if (self.graphConfigData.length == 0) self.graphConfigLoading = '暂无数据！';
              },
              error(){
                self.graphConfigLoading = '暂无数据！';
              }
            })
          },
          //根据关键词获取图片
          getGraphImageData: function (chexiId, niankuan) {
            var self = this;
            self.graphImageData = [];
            self.graphImageLoading = '正在加载中…';
            self.$http({
              url: self.$global.BASEURL + "/media/list.do",
              data: {
                type:'0',
                element:'',
                chexi_id: chexiId+'_'+niankuan,
                pageNo: 1,
                pageSize: 50
              },
              success: function (data) {
                self.graphImageLoading = '';
                if (data.code == 0 && data.data && data.data.data) {
                  self.graphImageData = data.data.data;
                }
                if (self.graphImageData.length == 0) self.graphImageLoading = '暂无数据！';
              },
              error(){
                self.graphImageLoading = '暂无数据！';
              }
            })
          },
          insertFodderImage(url){
            this.$emit('insertImageToEditor',url)
          },
          //根据关键词获取口碑
          getGraphPraiseData: function (chexiId, chexingId) {
            var self = this;
            self.graphPraiseData = [];
            self.graphPraiseLoading = '正在加载中…';
            self.$http({
              url: self.$global.BASEURL + "/car/koubei.do",
              data: {
                chexiId: chexiId,
                chexingId: chexingId
              },
              success: function (data) {
                self.graphPraiseLoading = '';
                if (data.code == 0 && data.data && data.data.data && data.data.data.keywords) {
                  self.graphPraiseData = data.data.data.keywords.split(',');
                }
                if (self.graphPraiseData.length == 0) self.graphPraiseLoading = '暂无数据！';
              },
              error(){
                self.graphPraiseLoading = '暂无数据！';
              }
            })
          },
          //根据关键词获取百科
          getGraphBaikeData: function (keyword) {
            var self = this;
            self.graphBaikeData = {};
            self.graphBaikeLoading = '正在加载中…';
            self.$http({
              url: self.$global.BASEURL + "/car/baike.do",
              data: {
                keyword: keyword
              },
              success: function (data) {
                self.graphBaikeLoading = '';
                if (data.code == 0 && data.data && data.data.data) {
                  self.graphBaikeData = data.data.data;
                }
                if (!self.graphBaikeData.title) self.graphBaikeLoading = '暂无数据！';
              },
              error(){
                self.graphBaikeLoading = '暂无数据！';
              }
            })
          },


          //选项被清空时
          fodderCarTypeClear: function (carTypeList) {
            this.getCardTypeList('', carTypeList);
          },
          //搜索车系
          getCardTypeList: function (query, carTypeList) {
            var self = this;
            self.selectLoading = true;
            self.$http({
              url: self.$global.BASEURL + "/media/complete/search.do",
              data: {
                q: query
              },
              success: function (data) {
                if (typeof (carTypeList) == 'object') {
                  for (var i = 0; i < carTypeList.length; i++) {
                    if (data.code == 0 && data.data) {
                      self[carTypeList[i]] = data.data;
                    } else {
                      self[carTypeList[i]] = [];
                    }
                  }
                } else {
                  if (data.code == 0 && data.data) {
                    self[carTypeList] = data.data;
                  } else {
                    self[carTypeList] = [];
                  }
                }

                self.selectLoading = false;
              }
            })
          },
        }
    }
</script>

<style>
  #car-edit #cars-graph .graph .echart {
    width: 440px;
    height: 232px;
  }

  #car-edit #cars-graph .graph .echart-show-btn {
    text-align: center;
    box-sizing: content-box;
    font-size:14px;
    color:rgba(51,51,51,1);
    padding-bottom: 20px;
  }
  #car-edit #cars-graph .graph .echart-show-btn i{
    color: #0E5DFF;
    font-size: 18px;
    font-weight: bolder;
    margin-right: 5px;
  }
  #car-edit #cars-graph .el-tabs-children > .el-tabs__header .el-tabs__nav .el-tabs__item{
    width: 80px;
  }
  #car-edit #cars-graph .graph-tab .el-tabs__content {
    padding: 0;
  }

  #car-edit #cars-graph .graph .graph-item {
    padding: 14px;
    box-sizing: content-box;
    background:rgba(238,244,254,1);
    border-radius:4px;
    min-height: 300px;
  }

  #car-edit #cars-graph .graph .graph-news-list > li {
    background:rgba(255,255,255,1);
    border-radius:4px;
    padding:14px;
    margin-bottom: 14px;
  }
  #car-edit #cars-graph .graph .graph-news-list > li h3 {
    font-size:18px;
    font-weight:600;
    color:rgba(51,51,51,1);
    margin-bottom: 10px;
  }

  #car-edit #cars-graph .graph .graph-news-list > li > span {
    display: block;
    font-size:12px;
    color:rgba(153,153,153,1);
    margin-bottom: 10px;
  }

  #car-edit #cars-graph .graph .graph-news-list > li p {
    font-size:14px;
    color:rgba(51,51,51,1);
    line-height:24px;
  }

  #car-edit #cars-graph .graph .graph-config {
    white-space: nowrap;
    height: 340px;
    position: relative;
    padding: 14px 0 0 14px;
  }

  #car-edit #cars-graph .graph .graph-tab-2 .graph-config {
    height: 572px;
  }

  #car-edit #cars-graph .graph .graph-config table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    min-width: 447px;
  }

  #car-edit #cars-graph .graph .graph-config td {
    width: 120px;
    padding:10px;
    white-space: normal;
    font-size: 14px;
    color: #333333;
    box-sizing: content-box;
  }
  #car-edit #cars-graph .graph .graph-config tr:nth-child(2n+1) td{
    background:rgba(245,251,255,1);
  }
  #car-edit #cars-graph .graph .graph-config tr:nth-child(2n) td{
    background: #ffffff;
  }
  #car-edit #cars-graph .graph .graph-config tr.header td {
    font-weight: bolder;
    background: #ffffff;
    border-bottom: 1px solid #E5E5E5;
  }

  #car-edit #cars-graph .graph .graph-config .table-left,
  #car-edit #cars-graph .graph .graph-config .table-header,
  #car-edit #cars-graph .graph .graph-config .table-left-header {
    position: absolute;
    left: 14px;
    top: 14px;
    overflow: hidden;
  }

  #car-edit #cars-graph .graph .graph-config .table-left-header {
    width: 142px;
    z-index: 3;
    background-color: #ffffff;
  }

  #car-edit #cars-graph .graph .graph-config .table-left {
    width: 142px;
    height: 322px;
  }

  #car-edit #cars-graph .graph .graph-tab-2 .graph-config .table-left {
    height: 555px;
  }

  #car-edit #cars-graph .graph .graph-config .table-left td {
    color: transparent;
  }
  #car-edit #cars-graph .graph .graph-config .table-left td:first-child {
    color: #333333;
  }

  #car-edit #cars-graph .graph .graph-config .table-header {
    width: 416px;
    background-color: #ffffff;
  }
  #car-edit #cars-graph .graph .graph-config .table-content {
    height: 100%;
    padding: 0;
    box-sizing: border-box;
  }

  #car-edit #cars-graph .graph .list-image {
    box-sizing: content-box;
  }

  #car-edit #cars-graph .graph .el-tag {
    margin: 0 10px 10px 0;
  }

  #car-edit #cars-graph .graph .graph-baike h3 {
    font-size: 18px;
    color:rgba(51,51,51,1);
    font-weight: bolder;
    margin-bottom: 10px;
  }

  #car-edit #cars-graph .graph .graph-baike p {
    font-size:14px;
    color:rgba(51,51,51,1);
    line-height:24px;
  }

  #car-edit #cars-graph .graph .no-more {
    text-align: center;
    padding-top: 20px;
  }

</style>
