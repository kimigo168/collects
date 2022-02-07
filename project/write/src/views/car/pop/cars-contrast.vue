<template>
  <div id="cars-contrast" v-loading="loading">
    <div class="contrast clearfix">
      <div class="left">
        <div class="input">
                <span>
                  <img class="img1" src="./../../../images/car/fodder-input-1-1.png">
                  <b>车型1</b>
                </span>
          <el-select v-model="carTypeCheck1"
                     @clear="fodderCarTypeClear('carTypeList1')"
                     size="medium"
                     filterable
                     remote
                     clearable
                     :reserve-keyword="false"
                     :remote-method="remoteMethod1"
                     :selectLoading="selectLoading"
                     placeholder="请输入车型关键词检索">
            <el-option
              v-for="item in carTypeList1"
              :key="item.idText"
              :label="item.text"
              :value="item.idText">
            </el-option>
          </el-select>
        </div>
        <div class="input">
                <span>
                  <img class="img1" src="./../../../images/car/fodder-input-1-1.png">
                  <b>车型2</b>
                </span>
          <el-select v-model="carTypeCheck2"
                     @clear="fodderCarTypeClear('carTypeList2')"
                     size="medium"
                     filterable
                     remote
                     clearable
                     :reserve-keyword="false"
                     :remote-method="remoteMethod2"
                     :selectLoading="selectLoading"
                     placeholder="请输入车型关键词检索">
            <el-option
              v-for="item in carTypeList2"
              :key="item.idText"
              :label="item.text"
              :value="item.idText">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="right">
        <el-button @click="clickGetList()">对比</el-button>
      </div>
    </div>

    <div class="contrast-type">
      <span :class="{'active':contrastType == 'picture_comparison'}"
            @click="contrastType='picture_comparison'">图片对比</span>
      <span :class="{'active':contrastType == 'space_comparison'}" @click="contrastType='space_comparison'">空间对比</span>
      <span :class="{'active':contrastType == 'config_comparison'}"
            @click="contrastType='config_comparison'">配置对比</span>
      <span :class="{'active':contrastType == 'power_comparison'}" @click="contrastType='power_comparison'">动力对比</span>
      <span :class="{'active':contrastType == 'koubei_comparison'}"
            @click="contrastType='koubei_comparison'">口碑对比</span>
      <span :class="{'active':contrastType == 'price_comparison'}" @click="contrastType='price_comparison'">价格对比</span>
      <span :class="{'active':contrastType == 'sales_comparison'}" @click="contrastType='sales_comparison'">销量对比</span>
      <span :class="{'active':contrastType == 'paramter_comparison'}"
            @click="contrastType='paramter_comparison'">参数对比</span>

      <!--<span :class="{'active':contrastType == 'youhao_comparison'}" @click="contrastType='youhao_comparison'">油耗对比</span>-->
    </div>

    <div style="position: relative;">
      <div class="contrast-list">

        <div class="contrast-image" v-show="contrastType == 'picture_comparison'">
          <div class="contrast-title" v-show="contrastImageChexing1 && contrastImageChexing2">
            <div class="title-inner">
              <span>{{GetText(contrastImageChexing1)}}</span>
              <span>{{GetText(contrastImageChexing2)}}</span>
            </div>
          </div>
          <div class="item1" v-for="item1 in contrastImageList">
            <h3>{{item1.tupianleixing}}</h3>
            <div class="item2" v-for="item2 in item1.list">
              <div class="clearfix">
                <div class="left">
                  <div class="img" :style="{backgroundImage: 'url('+ item2.imgs[0].url +')'}"></div>
                </div>
                <div class="right">
                  <div class="img" :style="{backgroundImage: 'url('+ item2.imgs[1].url +')'}"></div>
                </div>
              </div>
              <h4>{{item2.tag}}</h4>
              <a class="insert-btn" href="javascript:;" @click="contrastImageInsert(item2)"><span>插入</span></a>
            </div>
          </div>

          <p class="no-data" v-if="contrastImageList.length == 0">
            {{contrastImageChexing1 && contrastImageChexing2 ? '暂无数据' : '请选择2个车型对比'}}</p>

        </div>


        <div class="contrast-config contrast-price" v-show="contrastType == 'price_comparison'">
          <div class="contrast-title" v-show="contrastPriceChexing1 && contrastPriceChexing2">
            <div class="title-inner">
              <span>{{GetText(contrastPriceChexing1)}}</span>
              <span>{{GetText(contrastPriceChexing2)}}</span>
            </div>
          </div>

          <div class="item1" v-for="item in contrastPriceList">
            <div class="price" v-if="item.type == 'table' && item.data.length>0">
              <h4>{{item.data[0][0]}}</h4>
              <p>
                <span :class="item.data[0][3] == 'left' ? 'blue' : ''">{{item.data[0][1]}}</span>
                <span :class="item.data[0][3] == 'right' ? 'blue' : ''">{{item.data[0][2]}}</span>
              </p>
            </div>

            <div class="text" v-if="item.type == 'text'">
              <p>{{item.data}}</p>
              <a class="insert-btn btn2" href="javascript:;" @click="contrastReplaceText(item.data)"><span>替换</span></a>
              <a class="insert-btn" href="javascript:;" @click="contrastPriceInsertText(item.data)"><span>插入</span></a>
            </div>
          </div>

          <p class="no-data" v-if="contrastPriceList.length == 0">
            {{contrastPriceChexing1 && contrastPriceChexing2 ? '暂无数据' : '请选择2个车型对比'}}</p>

        </div>

        <div class="contrast-config contrast-sale" v-show="contrastType == 'sales_comparison'">
          <div class="contrast-title" v-show="contrastSaleChexing1 && contrastSaleChexing2">
            <div class="title-inner">
              <span>{{GetText(contrastSaleChexing1)}}</span>
              <span>{{GetText(contrastSaleChexing2)}}</span>
            </div>
          </div>

          <div class="item1" v-for="item in contrastSaleList">

            <div class="sale" v-if="item.type == 'chart' && item.data">
              <h4>
                <span>销量对比</span>
                <p class="show-btn">
                  <i class="num" :class="{'active': contrastSaleShowBtn == 1 }" @click="contrastSaleShowBtn = 1"></i>
                  <i class="tu" :class="{'active': contrastSaleShowBtn == 2 }" @click="contrastSaleShowBtn = 2"></i>
                </p>
              </h4>
              <div v-show="contrastSaleShowBtn == 1">
                <div class="month">
                  <b>月份</b>
                  <span :class="{'active': contrastSaleMonth == $index }" @click="contrastSaleMonth = $index"
                        v-for="(month,$index) in item.data.month">{{month}}</span>
                </div>
                <div class="sale-num">
                  <span
                    :class="{'blue':item.data.chexing1[contrastSaleMonth]>item.data.chexing2[contrastSaleMonth]}">{{item.data.chexing1[contrastSaleMonth]}}</span>
                  <span
                    :class="{'blue':item.data.chexing1[contrastSaleMonth]<item.data.chexing2[contrastSaleMonth]}">{{item.data.chexing2[contrastSaleMonth]}}</span>
                </div>
              </div>
              <div class="echart-box" v-show="contrastSaleShowBtn == 2">
                <div class="echart-sale" id="echart-sale">echart</div>
                <a class="insert-btn" href="javascript:;" @click="contrastSaleInsertEchart()"><span>插入</span></a>
              </div>
            </div>

            <div class="text" v-if="item.type == 'text'">
              <p>{{item.data}}</p>
              <a class="insert-btn btn2" href="javascript:;" @click="contrastReplaceText(item.data)"><span>替换</span></a>
              <a class="insert-btn" href="javascript:;" @click="contrastSaleInsertText(item.data)"><span>插入</span></a>
            </div>
          </div>

          <p class="no-data" v-if="contrastSaleList.length == 0">
            {{contrastSaleChexing1 && contrastSaleChexing2 ? '暂无数据' : '请选择2个车型对比'}}</p>


        </div>

        <div class="contrast-koubei" v-show="contrastType == 'koubei_comparison'">
          <div class="contrast-title" v-show="contrastKoubeiChexing1 && contrastKoubeiChexing2">
            <div class="title-inner">
              <span>{{GetText(contrastKoubeiChexing1)}}</span>
              <span>{{GetText(contrastKoubeiChexing2)}}</span>
            </div>
          </div>
          <div class="koubei clearfix" v-show="contrastKoubeiList[0].length > 0 || contrastKoubeiList[1].length > 0">
            <div class="left">
              <span v-for="item in contrastKoubeiList[0]">{{item}}</span>
              <p class="no-data" v-if="contrastKoubeiList[0].length == 0">暂无数据</p>

            </div>
            <div class="left">
              <span v-for="item in contrastKoubeiList[1]">{{item}}</span>
              <p class="no-data" v-if="contrastKoubeiList[1].length == 0">暂无数据</p>
            </div>
          </div>

          <p class="no-data" v-if="contrastKoubeiList[0].length == 0 && contrastKoubeiList[1].length == 0">
            {{contrastKoubeiChexing1 && contrastKoubeiChexing2 ? '暂无数据' : '请选择2个车型对比'}}</p>

        </div>

        <div class="contrast-config" v-show="contrastType == 'config_comparison'">
          <div class="contrast-title" v-show="contrastConfigChexing1 && contrastConfigChexing2">
            <div class="title-inner">
              <span>{{GetText(contrastConfigChexing1)}}</span>
              <span>{{GetText(contrastConfigChexing2)}}</span>
            </div>
          </div>

          <div class="item1" v-for="item in contrastConfigList">
            <div class="table" v-if="item.type == 'table' && item.data.length>0">
              <h3>{{item.name}}</h3>
              <table>
                <tbody>
                <tr v-for="listChildren in item.data">
                  <td>
                    <el-checkbox v-model="listChildren.checked"></el-checkbox>
                  </td>
                  <td v-for="item in listChildren.row">{{item}}</td>
                </tr>
                </tbody>
              </table>
              <a class="insert-btn" href="javascript:;" @click="contrastConfigInsertTable(item.data)"><span>插入</span></a>
            </div>

            <div class="text" v-if="item.type == 'text'">
              <p>{{item.data}}</p>
              <a class="insert-btn btn2" href="javascript:;" @click="contrastReplaceText(item.data)"><span>替换</span></a>
              <a class="insert-btn" href="javascript:;" @click="contrastConfigInsertText(item.data)"><span>插入</span></a>
            </div>
          </div>

          <p class="no-data" v-if="contrastConfigList.length == 0">
            {{contrastConfigChexing1 && contrastConfigChexing2 ? '暂无数据' : '请选择2个车型对比'}}</p>

        </div>

        <div class="contrast-config contrast-power contrast-space" v-show="contrastType == 'space_comparison'">
          <div class="contrast-title" v-show="contrastSpaceChexing1 && contrastSpaceChexing2">
            <div class="title-inner">
              <span>{{GetText(contrastSpaceChexing1)}}</span>
              <span>{{GetText(contrastSpaceChexing2)}}</span>
            </div>
          </div>

          <div class="item1" v-for="item in contrastSpaceList">
            <div class="chart" v-if="item.type == 'chart' && item.data.length>0">
              <div class="row" v-for="row in item.data">
                <h4>{{row.name}}</h4>
                <div class="line">
                  <i :class="row.position" :style="'width: '+row.rate+'%;'"></i>
                  <span style="left: 8px;">{{row.num1}}</span>
                  <span style="right: 8px;">{{row.num2}}</span>
                </div>
              </div>
              <a class="insert-btn" href="javascript:;" @click="contrastSpaceInsertChart(item.data)"><span>插入</span></a>
            </div>

            <div class="text" v-if="item.type == 'text'">
              <p>{{item.data}}</p>
              <a class="insert-btn btn2" href="javascript:;" @click="contrastReplaceText(item.data)"><span>替换</span></a>
              <a class="insert-btn" href="javascript:;" @click="contrastSpaceInsertText(item.data)"><span>插入</span></a>
            </div>
          </div>

          <p class="no-data" v-if="contrastSpaceList.length == 0">
            {{contrastSpaceChexing1 && contrastSpaceChexing2 ? '暂无数据' : '请选择2个车型对比'}}</p>

        </div>

        <div class="contrast-config contrast-fuel" v-show="contrastType == 'youhao_comparison'">
          <div class="contrast-title" v-show="contrastFuelChexing1 && contrastFuelChexing2">
            <div class="title-inner">
              <span>{{GetText(contrastFuelChexing1)}}</span>
              <span>{{GetText(contrastFuelChexing2)}}</span>
            </div>
          </div>

          <div class="item1" v-for="item in contrastFuelList">
            <div class="table" v-if="item.type == 'table' && item.data.length>0">
              <h3>{{item.name}}</h3>
              <table>
                <tbody>
                <tr v-for="listChildren in item.data">
                  <td>
                    <el-checkbox v-model="listChildren.checked"></el-checkbox>
                  </td>
                  <td v-for="item in listChildren.row">{{item}}</td>
                </tr>
                </tbody>
              </table>
              <a class="insert-btn" href="javascript:;" @click="contrastFuelInsertTable(item.data)"><span>插入</span></a>
            </div>

            <div class="text" v-if="item.type == 'text'">
              <p>{{item.data}}</p>
              <a class="insert-btn btn2" href="javascript:;" @click="contrastReplaceText(item.data)"><span>替换</span></a>
              <a class="insert-btn" href="javascript:;" @click="contrastFuelInsertText(item.data)"><span>插入</span></a>
            </div>
          </div>

          <p class="no-data" v-if="contrastFuelList.length == 0">
            {{contrastFuelChexing1 && contrastFuelChexing2 ? '暂无数据' : '请选择2个车型对比'}}</p>

        </div>

        <div class="contrast-config contrast-power" v-show="contrastType == 'power_comparison'">
          <div class="contrast-title" v-show="contrastPowerChexing1 && contrastPowerChexing2">
            <div class="title-inner">
              <span>{{GetText(contrastPowerChexing1)}}</span>
              <span>{{GetText(contrastPowerChexing2)}}</span>
            </div>
          </div>

          <div class="item1" v-for="item in contrastPowerList">
            <div class="chart" v-if="item.type == 'chart' && item.data.length>0">
              <div class="row" v-for="row in item.data">
                <h4>{{row.name}}</h4>
                <div class="line">
                  <i :class="row.position" :style="'width: '+row.rate+'%;'"></i>
                  <span style="left: 8px;">{{row.num1}}</span>
                  <span style="right: 8px;">{{row.num2}}</span>
                </div>
              </div>
              <a class="insert-btn" href="javascript:;" @click="contrastPowerInsertChart(item.data)"><span>插入</span></a>
            </div>

            <div class="table" v-if="item.type == 'table' && item.data.length>0">
              <h3>{{item.name}}</h3>
              <table>
                <tbody>
                <tr v-for="listChildren in item.data">
                  <td>
                    <el-checkbox v-model="listChildren.checked"></el-checkbox>
                  </td>
                  <td v-for="item in listChildren.row">{{item}}</td>
                </tr>
                </tbody>
              </table>
              <a class="insert-btn" href="javascript:;" @click="contrastPowerInsertTable(item.data)"><span>插入</span></a>
            </div>

            <div class="text" v-if="item.type == 'text'">
              <p>{{item.data}}</p>
              <a class="insert-btn btn2" href="javascript:;" @click="contrastReplaceText(item.data)"><span>替换</span></a>
              <a class="insert-btn" href="javascript:;" @click="contrastPowerInsertText(item.data)"><span>插入</span></a>
            </div>
          </div>

          <p class="no-data" v-if="contrastPowerList.length == 0">
            {{contrastPowerChexing1 && contrastPowerChexing2 ? '暂无数据' : '请选择2个车型对比'}}</p>

        </div>

        <div class="contrast-parameter scroll" style="height: 500px;"
             v-show="contrastParameterList.length>0 && contrastType == 'paramter_comparison'">
          <div class="table-header">
            <table v-if="contrastParameterList.length>0">
              <tbody>
              <tr>
                <td></td>
                <td v-for="item in contrastParameterList[0].row">{{item}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <table v-if="contrastParameterList.length>0">
            <tbody>
            <tr v-for="listChildren in contrastParameterList">
              <td>
                <el-checkbox v-model="listChildren.checked"></el-checkbox>
              </td>
              <td v-for="item in listChildren.row">{{item}}</td>
            </tr>
            </tbody>
          </table>

          <a class="insert-btn" href="javascript:;" @click="contrastParameterInsert()"><span>插入</span></a>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  var echarts = require('echarts/lib/echarts');

  export default {
    data() {
      return {
        uploadUrl: this.$global.BASEURL + '/common/uploadFile.do',

        carTypeCheck1: '',
        carTypeList1: [],
        carTypeCheck2: '',
        carTypeList2: [],

        chexing1: '',
        chexing2: '',

        contrastType: 'picture_comparison',

        contrastImageChexing1: '',
        contrastImageChexing2: '',
        contrastImageList: [],

        contrastPriceChexing1: '',
        contrastPriceChexing2: '',
        contrastPriceList: [],

        contrastSaleChexing1: '',
        contrastSaleChexing2: '',
        contrastSaleList: [],
        contrastSaleShowBtn: 1,
        contrastSaleMonth: 5,

        contrastKoubeiChexing1: '',
        contrastKoubeiChexing2: '',
        contrastKoubeiList: [[], []],

        contrastConfigChexing1: '',
        contrastConfigChexing2: '',
        contrastConfigList: [],

        contrastSpaceChexing1: '',
        contrastSpaceChexing2: '',
        contrastSpaceList: [],

        contrastFuelChexing1: '',
        contrastFuelChexing2: '',
        contrastFuelList: [],

        contrastPowerChexing1: '',
        contrastPowerChexing2: '',
        contrastPowerList: [],

        contrastParameterChexing1: '',
        contrastParameterChexing2: '',
        contrastParameterList: [],

        loading: false,
        selectLoading: false,
      }
    },
    watch: {
      contrastType() {
        this.getList();
      },
      contrastSaleShowBtn(val) {
        if (val == 2) this.contrastSaleEchartInit();
      }
    },
    created() {
      this.getCardTypeList('', ['carTypeList1', 'carTypeList2']);
    },
    methods: {

      //车系远程搜索多选
      remoteMethod1: function (query) {
        var self = this;
        if (query) {
          self.selectLoading = true;
          if (self.timer) clearTimeout(self.timer);
          self.timer = setTimeout(function () {
            self.getCardTypeList(query, 'carTypeList1');
          }, 200)
        } else {
          self.carTypeList1 = [];
        }
      },
      remoteMethod2: function (query) {
        var self = this;
        if (query) {
          self.selectLoading = true;
          if (self.timer) clearTimeout(self.timer);
          self.timer = setTimeout(function () {
            self.getCardTypeList(query, 'carTypeList2');
          }, 200)
        } else {
          self.carTypeList2 = [];
        }
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
            q: query,
            type: 1
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              for (var i = 0; i < data.data.length; i++) {
                data.data[i].idText = data.data[i].id + '&' + data.data[i].text
              }
              if (typeof (carTypeList) == 'object') {
                for (var i = 0; i < carTypeList.length; i++) {
                  self[carTypeList[i]] = data.data;
                }
              } else {
                self[carTypeList] = data.data;
              }

            } else {
              if (typeof (carTypeList) == 'object') {
                self[carTypeList[i]] = [];
              } else {
                self[carTypeList] = [];
              }
            }
            self.selectLoading = false;
          }
        })
      },


      parentClick(chexing1, chexing2, materialType) {
        var self = this;
        this.carTypeCheck1 = chexing1;
        self.carTypeList1 = [{
          text: self.GetText(chexing1),
          id: self.GetId(chexing1),
          idText: chexing1
        }];
        this.carTypeCheck2 = chexing2;
        self.carTypeList2 = [{
          text: self.GetText(chexing2),
          id: self.GetId(chexing2),
          idText: chexing2
        }];
        if (materialType) this.contrastType = materialType;
        this.chexing1 = this.carTypeCheck1;
        this.chexing2 = this.carTypeCheck2;
        this.getList();
      },
      clickGetList() {
        if (!this.carTypeCheck1 || !this.carTypeCheck2) {
          this.$alert('请选择2个车型对比！', '提示', {
            type: 'warning'
          });
          return
        }
        this.chexing1 = this.carTypeCheck1;
        this.chexing2 = this.carTypeCheck2;
        this.getList(true);
      },
      getList(isClick) {
        if (this.contrastType == 'picture_comparison') {
          this.getContrastImageListData(isClick);
        } else if (this.contrastType == 'price_comparison') {
          this.getContrastPriceListData(isClick);
        } else if (this.contrastType == 'sales_comparison') {
          this.getContrastSaleListData(isClick);
        } else if (this.contrastType == 'koubei_comparison') {
          this.getContrastKoubeiListData(isClick);
        } else if (this.contrastType == 'config_comparison') {
          this.getContrastConfigListData(isClick);
        } else if (this.contrastType == 'space_comparison') {
          this.getContrastSpaceListData(isClick);
        } else if (this.contrastType == 'youhao_comparison') {
          this.getContrastFuelListData(isClick);
        } else if (this.contrastType == 'power_comparison') {
          this.getContrastPowerListData(isClick);
        } else if (this.contrastType == 'paramter_comparison') {
          this.getContrastParameterListData(isClick);
        }
        this.$nextTick(function () {
          $('#cars-contrast-scroll').scrollTop(0);
        })
      },
      //获取图片对比列表
      getContrastImageListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastImageChexing1 || self.chexing2 != self.contrastImageChexing2) {
          self.contrastImageChexing1 = self.chexing1;
          self.contrastImageChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/picture.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {
                self.contrastImageList = data.data;
              } else {
                self.contrastImageList = [];
              }
            }
          })
        }
      },
      contrastImageInsert(item2) {
        var content = '<p></p><section chexing1="' + item2.imgs[0].chexing + '" chexing_id1="' + item2.imgs[0].chexing_id + '" chexing2="' + item2.imgs[1].chexing + '" chexing_id2="' + item2.imgs[1].chexing_id + '" material_type="picture_comparison" ' +
          'style="padding:15px;margin:10px auto;text-align: center;">' +
          '<section style="float: left;width:48%;">' +
          '<section chexi="' + item2.imgs[0].chexi + '" chexi_id="' + item2.imgs[0].chexi_id + '" chexing="' + item2.imgs[0].chexing + '" yuansu="' + item2.imgs[0].element + '" ctype="two_cars_contrast_img">' +
          '<img style="height: 200px;width: 100%;object-fit: cover;" src="' + item2.imgs[0].url + '">' +
          '</section>' +
          '<span>' + item2.imgs[0].chexing + '</span>' +
          '</section>' +
          '<section style="float: right;width:48%;">' +
          '<section chexi="' + item2.imgs[1].chexi + '" chexi_id="' + item2.imgs[1].chexi_id + '" chexing="' + item2.imgs[1].chexing + '" yuansu="' + item2.imgs[1].element + '" ctype="two_cars_contrast_img">' +
          '<img style="height: 200px;width: 100%;object-fit: cover;" src="' + item2.imgs[1].url + '">' +
          '</section>' +
          '<span>' + item2.imgs[1].chexing + '</span>' +
          '</section>' +
          '<section style="clear:both;height: 0;"></section>' +
          '</section>' +
          '<p><br></p>';
        this.$emit('insertTextToEditor', content)
      },


      //获取价格对比列表
      getContrastPriceListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastPriceChexing1 || self.chexing2 != self.contrastPriceChexing2) {
          self.contrastPriceChexing1 = self.chexing1;
          self.contrastPriceChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/price.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {
                var list = data.data;
                for (var k = 0; k < list.length; k++) {
                  if (list[k].type == 'table') {
                    var num1 = list[k].data[0][1].replace('万', '') * 1;
                    var num2 = list[k].data[0][2].replace('万', '') * 1;
                    if (num1 == NaN || num2 == NaN || num1 == num2) {
                      list[k].data[0][3] = '';
                    } else if (num1 > num2) {
                      list[k].data[0][3] = 'right';
                    } else if (num1 < num2) {
                      list[k].data[0][3] = 'left';
                    }
                  }
                }
                self.contrastPriceList = list;
              } else {
                self.contrastPriceList = [];
              }
            }
          })
        }
      },
      contrastPriceInsertText(text) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastPriceChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastPriceChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastPriceChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastPriceChexing2) + '" ' +
          'material_type="price_comparison">' +
          '<p>' + text + '</p>' +
          '</section>' +
          '<p><br></p>';
        this.$emit('insertTextToEditor', content)
      },


      //获取销量对比列表
      getContrastSaleListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastSaleChexing1 || self.chexing2 != self.contrastSaleChexing2) {
          self.contrastSaleChexing1 = self.chexing1;
          self.contrastSaleChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/sales.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {
                self.contrastSaleList = data.data;
                self.contrastSaleMonth = 0;
                if (self.contrastSaleShowBtn == 2) self.contrastSaleEchartInit();
              } else {
                self.contrastSaleList = [];
              }
            }
          })
        }
      },
      contrastSaleEchartInit() {
        var self = this;
        self.$nextTick(function () {
          if (!self.echartSale) {
            self.echartSale = echarts.init(document.getElementById('echart-sale'));
          }
          var legend = [self.GetText(self.contrastSaleChexing1), self.GetText(self.contrastSaleChexing2)];
          var xAxis = [];
          var series1 = [];
          var series2 = [];

          for (var i = 0; i < self.contrastSaleList.length; i++) {
            if (self.contrastSaleList[i].type == 'chart') {
              var chartObj = self.contrastSaleList[i].data;
              xAxis = JSON.parse(JSON.stringify(chartObj.month)).reverse();
              series1 = JSON.parse(JSON.stringify(chartObj.chexing1)).reverse();
              series2 = JSON.parse(JSON.stringify(chartObj.chexing2)).reverse();
              break
            }
          }
          var option = {
            title: {
              text: '销量对比',
              top: 15,
              textStyle: {
                color: '#0E5DFF',
                fontSize: 16,
              },
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              top: 15,
              left: 'center',
              textStyle: {
                fontSize: 11,
              },
              data: legend
            },
            grid: {
              top: 85
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              axisLine: {
                lineStyle: {
                  color: "#999"
                }
              },
              data: xAxis
            },
            yAxis: {
              type: 'value',
              name: '单位：辆',
              axisLine: {
                lineStyle: {
                  color: "#999"
                }
              }
            },
            series: [
              {
                name: self.GetText(self.contrastSaleChexing1),
                type: 'line',
                color: '#0E5DFF',
                symbolSize: 8,
                itemStyle: {
                  normal: {
                    borderWidth: 2,
                  }
                },
                data: series1
              },
              {
                name: self.GetText(self.contrastSaleChexing2),
                type: 'line',
                color: "#999FAD",
                symbolSize: 8,
                itemStyle: {
                  normal: {
                    borderWidth: 2,
                  }
                },
                data: series2
              }
            ]
          };
          self.echartSale.setOption(option);
          console.log('opention')
        })
      },
      contrastSaleInsertEchart() {
        var self = this;
        if (this.echartSale) {
          var base64Url = this.echartSale.getDataURL({
            type: 'jpeg',
            pixelRatio: 3,
            backgroundColor: '#fff'
          });

          function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type: mime});
          }

          var file = dataURLtoBlob(base64Url);
          self.loading = true;
          var formData = new FormData();
          formData.append("file", file);
          var request = new XMLHttpRequest();
          request.open("POST", self.uploadUrl);
          request.send(formData);
          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              self.loading = false;
              if (request.status == 200) {
                var data = JSON.parse(request.response);
                if (data.data && data.data.Limage) {
                  var content = '<p></p><section ' +
                    'chexing1="' + self.GetText(self.contrastSaleChexing1) + '" ' + 'chexing_id1="' + self.GetId(self.contrastSaleChexing1) + '" ' +
                    'chexing2="' + self.GetText(self.contrastSaleChexing2) + '" ' + 'chexing_id2="' + self.GetId(self.contrastSaleChexing2) + '" ' +
                    'material_type="sales_comparison">' +
                    '<img src="' + data.data.Limage + '">' +
                    '</section>' +
                    '<p><br></p>';
                  self.$emit('insertTextToEditor', content)
                } else {
                  self.$message({
                    showClose: true,
                    message: '图片上传失败,请重试',
                    type: 'error'
                  });
                }
              } else {
                self.$message({
                  showClose: true,
                  message: '图片上传失败,请重试',
                  type: 'error'
                });
              }
            }
          };


        }
      },
      contrastSaleInsertText(text) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastSaleChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastSaleChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastSaleChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastSaleChexing2) + '" ' +
          'material_type="sales_comparison">' +
          '<p>' + text + '</p>' +
          '</section>' +
          '<p><br></p>';
        this.$emit('insertTextToEditor', content)
      },


      //获取口碑对比列表
      getContrastKoubeiListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastKoubeiChexing1 || self.chexing2 != self.contrastKoubeiChexing2) {
          self.contrastKoubeiChexing1 = self.chexing1;
          self.contrastKoubeiChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/koubei.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {
                self.contrastKoubeiList = data.data;
              } else {
                self.contrastKoubeiList = [[], []];
              }
            }
          })
        }
      },


      //获取配置对比列表
      getContrastConfigListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastConfigChexing1 || self.chexing2 != self.contrastConfigChexing2) {
          self.contrastConfigChexing1 = self.chexing1;
          self.contrastConfigChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/config.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {

                var list = data.data;
                for (var k = 0; k < list.length; k++) {
                  if (list[k].type == 'table') {
                    var arr = [];
                    for (var i = 0; i < list[k].data.length; i++) {
                      arr.push({
                        checked: true,
                        row: list[k].data[i]
                      })
                    }
                    list[k].data = arr;
                  }
                }

                self.contrastConfigList = list;

              } else {
                self.contrastConfigList = [];
              }
            }
          })
        }
      },
      contrastConfigInsertTable(arr) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastConfigChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastConfigChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastConfigChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastConfigChexing2) + '" ' +
          'material_type="config_comparison">' +
          '<table style="width:100%;margin:10px auto;text-align: center;"><tbody>' +
          '<tr><td>车型名称</td><td>' + this.GetText(this.contrastConfigChexing1) + '</td><td>' + this.GetText(this.contrastConfigChexing2) + '</td></tr>';
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            content += '<tr>';
            for (var k = 0; k < arr[i].row.length; k++) {
              content += '<td>' + arr[i].row[k] + '</td>';
            }
            content += '</tr>';
          }
        }
        content += '</tbody></table></section><p><br></p>';
        this.$emit('insertTextToEditor', content)
      },
      contrastConfigInsertText(text) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastConfigChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastConfigChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastConfigChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastConfigChexing2) + '" ' +
          'material_type="config_comparison">' +
          '<p>' + text + '</p>' +
          '</section>' +
          '<p><br></p>';
        this.$emit('insertTextToEditor', content)
      },


      //获取空间对比列表
      getContrastSpaceListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastSpaceChexing1 || self.chexing2 != self.contrastSpaceChexing2) {
          self.contrastSpaceChexing1 = self.chexing1;
          self.contrastSpaceChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/space.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {
                var list = data.data;
                for (var k = 0; k < list.length; k++) {
                  if (list[k].type == 'chart') {
                    var arr = [];
                    for (var i = 0; i < list[k].data.length; i++) {
                      var row = {
                        name: list[k].data[i][0],
                        num1: list[k].data[i][1] * 1,
                        num2: list[k].data[i][2] * 1,
                      };
                      if (row.num1 == 0 && row.num2 == 0) {
                        row.rate = 50;
                        row.position = '';
                      } else if (row.num1 == row.num2) {
                        row.rate = 50;
                        row.position = '';
                      } else if (row.num1 > row.num2) {
                        row.rate = row.num1 / (row.num1 + row.num2) * 100;
                        row.position = 'left';
                      } else {
                        row.rate = row.num2 / (row.num1 + row.num2) * 100;
                        row.position = 'right';
                      }
                      if (row.rate > 92) row.rate = 92;
                      arr.push(row)
                    }
                    list[k].data = arr;
                  }
                }
                self.contrastSpaceList = list;
              } else {
                self.contrastSpaceList = [];
              }
            }
          })
        }
      },
      contrastSpaceInsertChart(arr) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastSpaceChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastSpaceChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastSpaceChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastSpaceChexing2) + '" ' +
          'material_type="space_comparison">' +
          '<section style="position: relative;margin: 10px auto;">' +
          '<p style="text-align: center;">' +
          '<span style="display: inline-block;width: 45%;vertical-align: top;">' + this.contrastSpaceChexing1 + '</span>' +
          '<span style="display: inline-block;width: 45%;vertical-align: top;">' + this.contrastSpaceChexing2 + '</span>' +
          '</p>';

        for (var i = 0; i < arr.length; i++) {
          content += '<section style="padding-bottom: 10px;">' +
            '<h4 style="font-size: 12px;color: #999999;line-height: 20px;text-align: center;">' + arr[i].name + '</h4> ' +
            '<section style="height: 14px;background: #B6D1FF;border-radius: 7px;position: relative;overflow: hidden;">';

          if (arr[i].position == 'left') {
            content += '<i style="position: absolute;top:0;left: 0;border-right: 1px solid #FFFFFF;height: 100%;width:' + arr[i].rate + '%;background: #3C7CFF;"></i> ';
          } else if (arr[i].position == 'right') {
            content += '<i style="position: absolute;top:0;right: 0;border-left: 1px solid #FFFFFF;height: 100%;width: ' + arr[i].rate + '%;background: #3C7CFF;"></i> ';
          } else {
            content += '<i style="position: absolute;top:0;right: 0;border-left: 1px solid #FFFFFF;height: 100%;width: ' + arr[i].rate + '%;"></i> ';
          }

          content += '<span style="left: 8px;position: absolute;top:0;z-index: 1;font-size: 12px;color: #FFFFFF;line-height: 14.5px;transform: scale(0.8);">' + arr[i].num1 + '</span> ' +
            '<span style="right: 8px;position: absolute;top:0;z-index: 1;font-size: 12px;color: #FFFFFF;line-height: 14.5px;transform: scale(0.8);">' + arr[i].num2 + '</span>' +
            '</section>' +
            '</section>';
        }

        content += '</section></section><p><br></p>';

        this.$emit('insertTextToEditor', content)
      },
      contrastSpaceInsertText(text) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastSpaceChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastSpaceChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastSpaceChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastSpaceChexing2) + '" ' +
          'material_type="space_comparison">' +
          '<p>' + text + '</p>' +
          '</section>' +
          '<p><br></p>';
        this.$emit('insertTextToEditor', content)
      },


      //获取油耗对比列表
      getContrastFuelListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastFuelChexing1 || self.chexing2 != self.contrastFuelChexing2) {
          self.contrastFuelChexing1 = self.chexing1;
          self.contrastFuelChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/youhao.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {

                var list = data.data;
                for (var k = 0; k < list.length; k++) {
                  if (list[k].type == 'table') {
                    var arr = [];
                    for (var i = 0; i < list[k].data.length; i++) {
                      arr.push({
                        checked: true,
                        row: list[k].data[i]
                      })
                    }
                    list[k].data = arr;
                  }
                }

                self.contrastFuelList = list;
              } else {
                self.contrastFuelList = [];
              }
            }
          })
        }
      },
      contrastFuelInsertTable(arr) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastFuelChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastFuelChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastFuelChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastFuelChexing2) + '" ' +
          'material_type="youhao_comparison">' +
          '<table style="width:100%;margin:10px auto;text-align: center;"><tbody>' +
          '<tr><td>车型名称</td><td>' + this.GetText(this.contrastFuelChexing1) + '</td><td>' + this.GetText(this.contrastFuelChexing2) + '</td></tr>';
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            content += '<tr>';
            for (var k = 0; k < arr[i].row.length; k++) {
              content += '<td>' + arr[i].row[k] + '</td>';
            }
            content += '</tr>';
          }
        }
        content += '</tbody></table></section><p><br></p>';
        this.$emit('insertTextToEditor', content)
      },
      contrastFuelInsertText(text) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastFuelChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastFuelChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastFuelChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastFuelChexing2) + '" ' +
          'material_type="youhao_comparison">' +
          '<p>' + text + '</p>' +
          '</section>' +
          '<p><br></p>';
        this.$emit('insertTextToEditor', content)
      },


      //获取动力对比列表
      getContrastPowerListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastPowerChexing1 || self.chexing2 != self.contrastPowerChexing2) {
          self.contrastPowerChexing1 = self.chexing1;
          self.contrastPowerChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/power.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {
                var list = data.data;
                for (var k = 0; k < list.length; k++) {
                  if (list[k].type == 'chart') {
                    var arr = [];
                    for (var i = 0; i < list[k].data.length; i++) {
                      var row = {
                        name: list[k].data[i][0],
                        num1: list[k].data[i][1] * 1,
                        num2: list[k].data[i][2] * 1,
                      };
                      if (row.num1 == 0 && row.num2 == 0) {
                        row.rate = 50;
                        row.position = '';
                      } else if (row.num1 == row.num2) {
                        row.rate = 50;
                        row.position = '';
                      } else if (row.num1 > row.num2) {
                        row.rate = row.num1 / (row.num1 + row.num2) * 100;
                        row.position = 'left';
                      } else {
                        row.rate = row.num2 / (row.num1 + row.num2) * 100;
                        row.position = 'right';
                      }
                      if (row.rate > 92) row.rate = 92;
                      if (i == 1) {
                        if (row.position == 'left') {
                          row.position = 'right';
                        } else if (row.position == 'right') {
                          row.position = 'left';
                        }
                      }
                      arr.push(row)
                    }
                    list[k].data = arr;
                  } else if (list[k].type == 'table') {
                    var arr = [];
                    for (var i = 0; i < list[k].data.length; i++) {
                      arr.push({
                        checked: true,
                        row: list[k].data[i]
                      })
                    }
                    list[k].data = arr;
                  }
                }
                self.contrastPowerList = list;
              } else {
                self.contrastPowerList = [];
              }
            }
          })
        }
      },
      contrastPowerInsertChart(arr) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastPowerChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastPowerChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastPowerChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastPowerChexing2) + '" ' +
          'material_type="power_comparison">' +
          '<section style="position: relative;margin: 10px auto;">' +
          '<p style="text-align: center;">' +
          '<span style="display: inline-block;width: 45%;vertical-align: top;">' + this.GetText(this.contrastPowerChexing1) + '</span>' +
          '<span style="display: inline-block;width: 45%;vertical-align: top;">' + this.GetText(this.contrastPowerChexing2) + '</span>' +
          '</p>';

        for (var i = 0; i < arr.length; i++) {
          content += '<section style="padding-bottom: 10px;">' +
            '<h4 style="font-size: 12px;color: #999999;line-height: 20px;text-align: center;">' + arr[i].name + '</h4> ' +
            '<section style="height: 14px;background: #B6D1FF;border-radius: 7px;position: relative;overflow: hidden;">';

          if (arr[i].position == 'left') {
            content += '<i style="position: absolute;top:0;left: 0;border-right: 1px solid #FFFFFF;height: 100%;width:' + arr[i].rate + '%;background: #3C7CFF;"></i> ';
          } else if (arr[i].position == 'right') {
            content += '<i style="position: absolute;top:0;right: 0;border-left: 1px solid #FFFFFF;height: 100%;width: ' + arr[i].rate + '%;background: #3C7CFF;"></i> ';
          } else {
            content += '<i style="position: absolute;top:0;right: 0;border-left: 1px solid #FFFFFF;height: 100%;width: ' + arr[i].rate + '%;"></i> ';
          }

          content += '<span style="left: 8px;position: absolute;top:0;z-index: 1;font-size: 12px;color: #FFFFFF;line-height: 14.5px;transform: scale(0.8);">' + arr[i].num1 + '</span> ' +
            '<span style="right: 8px;position: absolute;top:0;z-index: 1;font-size: 12px;color: #FFFFFF;line-height: 14.5px;transform: scale(0.8);">' + arr[i].num2 + '</span>' +
            '</section>' +
            '</section>';
        }

        content += '</section></section><p><br></p>';

        this.$emit('insertTextToEditor', content)
      },
      contrastPowerInsertTable(arr) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastPowerChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastPowerChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastPowerChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastPowerChexing2) + '" ' +
          'material_type="power_comparison">' +
          '<table style="width:100%;margin:10px auto;text-align: center;"><tbody>' +
          '<tr><td>车型名称</td><td>' + this.GetText(this.contrastPowerChexing1) + '</td><td>' + this.GetText(this.contrastPowerChexing2) + '</td></tr>';
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            content += '<tr>';
            for (var k = 0; k < arr[i].row.length; k++) {
              content += '<td>' + arr[i].row[k] + '</td>';
            }
            content += '</tr>';
          }
        }
        content += '</tbody></table></section><p><br></p>';
        this.$emit('insertTextToEditor', content)
      },
      contrastPowerInsertText(text) {
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastPowerChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastPowerChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastPowerChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastPowerChexing2) + '" ' +
          'material_type="power_comparison">' +
          '<p>' + text + '</p>' +
          '</section>' +
          '<p><br></p>';
        this.$emit('insertTextToEditor', content)
      },


      //获取参数对比列表
      getContrastParameterListData(isClick) {
        var self = this;
        if (isClick || self.chexing1 != self.contrastParameterChexing1 || self.chexing2 != self.contrastParameterChexing2) {
          self.contrastParameterChexing1 = self.chexing1;
          self.contrastParameterChexing2 = self.chexing2;
          self.loading = true;
          self.$http({
            url: self.$global.BASEURL + "/car/contrast/parameter.do",
            type: 'GET',
            data: {
              chexing_id: self.GetId(self.chexing1) + ';' + self.GetId(self.chexing2)
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data && data.data.length > 0) {
                var arr = [];
                for (var i = 0; i < data.data.length; i++) {
                  arr.push({
                    checked: i < 11,
                    row: data.data[i]
                  })
                }
                self.contrastParameterList = arr;
              } else {
                self.contrastParameterList = [];
              }
            }
          })
        }
      },
      contrastParameterInsert() {
        if (this.contrastParameterList.length == 0) return;
        var arr = this.contrastParameterList;
        var content = '<p></p><section ' +
          'chexing1="' + this.GetText(this.contrastParameterChexing1) + '" ' + 'chexing_id1="' + this.GetId(this.contrastParameterChexing1) + '" ' +
          'chexing2="' + this.GetText(this.contrastParameterChexing2) + '" ' + 'chexing_id2="' + this.GetId(this.contrastParameterChexing2) + '" ' +
          'material_type="paramter_comparison">' +
          '<table style="width:100%;margin:10px auto;text-align: center;"><tbody>';
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            content += '<tr>';
            for (var k = 0; k < arr[i].row.length; k++) {
              content += '<td>' + arr[i].row[k] + '</td>';
            }
            content += '</tr>';
          }
        }
        content += '</tbody></table></section><p><br></p>';
        this.$emit('insertTextToEditor', content)
      },

      //通用文本<span>替换</span>
      contrastReplaceText(text) {
        this.$emit('replaceTextToEditor', text)
      },
    }
  }
</script>

<style lang="scss">

  #car-edit {
    #cars-contrast .contrast{
      position: relative;
      .left {
        width: 390px;
        border-radius:10px 0px 0px 10px;
        border:1px solid rgba(229,229,229,1);
        overflow: hidden;
        .input {
          margin-bottom: 0;
          &+.input{
            border-top: 1px solid rgba(229,229,229,1);;
          }
          .el-select input {
            border-radius: 0;
            border: none;
          }
        }
      }
      .right{
        position: absolute;
        right: 0;
        top:0;
        .el-button {
          width:50px;
          height:75px;
          background:rgba(137,150,179,1);
          border-radius:0px 10px 10px 0px;
          padding:0;
          color: #FFFFFF;
        }
      }
    }
    #cars-contrast .contrast-type {
      padding: 15px 0 5px;
    }
    #cars-contrast .contrast-type span {
      display: inline-block;
      max-width: 100%;
      text-align: center;
      font-size:14px;
      color:rgba(153,153,153,1);
      line-height: 28px;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;
      width:88px;
      height:30px;
      background:rgba(241,247,255,1);
      border-radius:15px;
      margin: 0 14px 5px 0;
    }

    #cars-contrast .contrast-type span.active {
      background-color: #004EFF;
      color: #ffffff;
    }

    #cars-contrast .contrast-list {
      padding:14px;
      min-height: 500px;
      background-color: #EEF4FE;
    }

    #cars-contrast .contrast-list .contrast-title {
      width: 100%;
      padding:9px 14px;
      box-sizing: content-box;
      margin: -14px 0 0 -14px;
      background:rgba(137,150,179,1);
      border-radius:4px 4px 0px 0px;
    }

    #cars-contrast .contrast-list .contrast-title .title-inner {
      text-align: center;
    }

    #cars-contrast .contrast-list .contrast-title span {
      display: inline-block;
      width: 49%;
      vertical-align: top;
      word-break: break-all;
      text-align: left;
      font-size:14px;
      color:rgba(255,255,255,1);
      line-height:21px;
      box-sizing: border-box;
      padding:0 14px 0 0;
    }
    #cars-contrast .contrast-list .contrast-title span+span{
      padding:0 0 0 14px;
      border-left: 1px solid #FFFFFF;
    }

    #cars-contrast .contrast-list table {
      table-layout: fixed;
      width: 395px;
      white-space: normal;
      font-size: 12px;
      border-collapse: collapse;
    }

    #cars-contrast .contrast-list table td {
      width: 111px;
      word-break: break-all;
      background-color: #FFFFFF;
      font-size:14px;
      color:rgba(51,51,51,1);
      line-height:20px;
      padding:10px;
      box-sizing: border-box;
      border:none;
    }
    #cars-contrast .contrast-list table td:first-child {
      width: 30px;
      padding-left: 14px;
    }
    #cars-contrast .contrast-list table tr:nth-child(2n+1) td{
      background-color: #FFFFFF;
    }
    #cars-contrast .contrast-list table tr:nth-child(2n) td{
      background-color: #F5FBFF;
    }

    #cars-contrast .contrast-list .contrast-image .item1 {
      padding: 15px 0 0;
    }

    #cars-contrast .contrast-list .contrast-image .item1 h3 {
      text-align: center;
      font-size: 15px;
      color: #333333;
      font-weight: bolder;
      padding-bottom: 5px;
    }

    #cars-contrast .contrast-list .contrast-image .item2 {
      background-color: #FFFFFF;
      padding: 14px;
      margin-bottom: 12px;
      position: relative;
      text-align: center;
      border-radius:4px;
    }

    #cars-contrast .contrast-list .contrast-image .item2 .left,
    #cars-contrast .contrast-list .contrast-image .item2 .right {
      width: 180px;
    }

    #cars-contrast .contrast-list .contrast-image .item2 .img {
      height: 120px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    #cars-contrast .contrast-list .contrast-image .item2 > h4 {
      text-align: left;
      font-size: 13px;
      line-height: 18px;
      font-weight: normal;
      margin-top: 10px;
    }

    #cars-contrast .contrast-list .contrast-image .item2:hover {
      box-shadow: 0 0 0 1px #85c9ff;
    }

    #cars-contrast .contrast-list .contrast-image .item2:hover .insert-btn {
      display: block;
    }

    #cars-contrast .contrast-list .contrast-price .price h4 {
      font-size: 14px;
      color: #333333;
      line-height: 39px;
      margin: 0 14px;
      border-bottom: 1px solid #E5E5E5;
    }
    #cars-contrast .contrast-list .contrast-price .price p {
      text-align: center;
      padding:30px 0;
    }
    #cars-contrast .contrast-list .contrast-price .price p span {
      display: inline-block;
      width: 49%;
      font-size:26px;
      color:rgba(51,51,51,1);
      line-height:37px;
      font-weight: bolder;
    }
    #cars-contrast .contrast-list .contrast-price .price p span.blue{
      color: #004EFF;
    }


    #cars-contrast .contrast-list .contrast-sale .sale {
      position: relative;
      margin: 15px 0;
    }
    #cars-contrast .contrast-list .contrast-sale .sale>h4{
      font-size:14px;
      color:rgba(51,51,51,1);
      margin: 0 14px;
      border-bottom:1px solid #E5E5E5;
      line-height: 39px;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .show-btn {
      position: absolute;
      right: 10px;
      top: 8px;
      z-index: 1;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .show-btn > i {
      display: block;
      width: 24px;
      height: 24px;
      float: left;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .show-btn > i.num {
      background-image: url("./../../../images/car/cars_contrast_sale_icon_1.png");
    }
    #cars-contrast .contrast-list .contrast-sale .sale .show-btn > i.num.active {
      background-image: url("./../../../images/car/cars_contrast_sale_icon_1-2.png");
    }
    #cars-contrast .contrast-list .contrast-sale .sale .show-btn > i.tu {
      margin-left: 10px;
      background-image: url("./../../../images/car/cars_contrast_sale_icon_2.png");
    }
    #cars-contrast .contrast-list .contrast-sale .sale .show-btn > i.tu.active {
      background-image: url("./../../../images/car/cars_contrast_sale_icon_2-2.png");
    }
    #cars-contrast .contrast-list .contrast-sale .sale .month{
      padding:10px 14px 0;
      line-height: 24px;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .month b {
      font-size:14px;
      color:rgba(153,153,153,1);
      margin-right: 15px;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .month span {
      display: inline-block;
      max-width: 100%;
      box-sizing: border-box;
      padding: 0 8px;
      font-size: 14px;
      color: #333333;
      white-space: nowrap;
      margin: 0 5px 0 0;
      cursor: pointer;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .month span.active {
      color: #004EFF;
      font-weight: bolder;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .sale-num {
      text-align: center;
      padding:30px 0;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .sale-num span {
      display: inline-block;
      width: 49%;
      font-size:26px;
      font-weight:bolder;
      color:rgba(51,51,51,1);
      line-height:37px;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .sale-num span.blue{
      color: #004EFF;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .echart-box {
      position: relative;
      padding:0 14px;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .echart-box:hover .insert-btn {
      display: block;
    }
    #cars-contrast .contrast-list .contrast-sale .sale .echart-sale {
      height: 300px;
      width: 100%;
      margin: 0 auto;
    }


    #cars-contrast .contrast-list .contrast-koubei .koubei {
      padding: 30px 0;
    }
    #cars-contrast .contrast-list .contrast-koubei .koubei .left {
      width: 49%;
      min-height: 100px;
    }
    #cars-contrast .contrast-list .contrast-koubei .koubei .left > span {
      display: inline-block;
      max-width: 100%;
      border-radius: 12px;
      height: 18px;
      padding: 3px 12px;
      font-size: 12px;
      color: #FFFFFF;
      line-height: 17px;
      background: #6B7C92;
      margin: 0 5px 6px 0;
    }

    #cars-contrast .contrast-list .contrast-koubei .koubei .left:nth-child(2) > span {
      background-color: #6a6f97;
    }

    #cars-contrast .contrast-list .contrast-config .item1 {
      margin: 14px 0;
      position: relative;
      background-color: #FFFFFF;
      border-radius:4px;
    }

    #cars-contrast .contrast-list .contrast-config .item1:hover {
      box-shadow: 0 0 0 1px #85c9ff;
    }

    #cars-contrast .contrast-list .contrast-config .item1 h3 {
      font-size: 14px;
      color: #333333;
      font-weight: bolder;
      line-height: 30px;
    }
    #cars-contrast .contrast-list .contrast-config .item1 p{
      font-size:14px;
      color:rgba(34,34,34,1);
      line-height:22px;
    }

    #cars-contrast .contrast-list .contrast-config .item1 .table {
      position: relative;
      padding:0 0 14px;
    }
    #cars-contrast .contrast-list .contrast-config .item1 .table h3{
      border-bottom: 1px solid #E5E5E5;
      line-height: 39px;
      margin: 0 14px;
    }

    #cars-contrast .contrast-list .contrast-config .item1 .text {
      padding: 14px;
      position: relative;
    }

    #cars-contrast .contrast-list .contrast-config .item1:hover .insert-btn {
      display: block;
    }

    #cars-contrast .contrast-list .contrast-config .chart {
      position: relative;
      padding: 14px 14px 25px;
    }

    #cars-contrast .contrast-list .contrast-config .chart .row {
      padding-bottom: 10px;
    }

    #cars-contrast .contrast-list .contrast-config .chart .row h4 {
      font-size: 12px;
      color: #999999;
      line-height: 20px;
      text-align: center;
    }

    #cars-contrast .contrast-list .contrast-config .chart .row .line {
      height: 14px;
      background: #B6D1FF;
      border-radius: 7px;
      position: relative;
      overflow: hidden;
    }

    #cars-contrast .contrast-list .contrast-config .chart .row .line span {
      position: absolute;
      top: 0;
      z-index: 1;
      font-size: 12px;
      color: #FFFFFF;
      line-height: 14.5px;
      transform: scale(0.8);
    }

    #cars-contrast .contrast-list .contrast-config .chart .row .line i {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 50%;
      border-left: 1px solid #FFFFFF;
    }

    #cars-contrast .contrast-list .contrast-config .chart .row .line i.left {
      right: auto;
      left: 0;
      border-left: none;
      border-right: 1px solid #FFFFFF;
      background: #3C7CFF;
    }

    #cars-contrast .contrast-list .contrast-config .chart .row .line i.right {
      right: 0;
      left: auto;
      border-right: none;
      border-left: 1px solid #FFFFFF;
      background: #3C7CFF;
    }
    #cars-contrast .contrast-list .contrast-parameter{
      width: 410px;
    }
    #cars-contrast .contrast-list .contrast-parameter tr:first-child td {
      font-weight: bolder;
    }

    #cars-contrast .contrast-list .contrast-parameter .table-header {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;
      padding: 12px 14px 0;
    }

    #cars-contrast .contrast-list .contrast-parameter .table-header td {
      background-color: #FFFFFF;
    }

    #cars-contrast .contrast-list .contrast-parameter:hover .insert-btn {
      display: block;
    }

    #cars-contrast .contrast-list .insert-btn {
      position: absolute;
      right: 5px;
      bottom: 5px;
      z-index: 9;
      display: none;
      width: 40px;
      height: 28px;
      border-radius: 15px;
      background-color: #fff;
      background-size: 14px 14px;
      background-position: center center;
      background-image: url('./../../../images/icons/icon_insert.png');
      background-repeat: no-repeat;
    }
    #cars-contrast .contrast-list .insert-btn span{
      width: 50px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      display: none;
      border-radius: 6px;
      background: #606670;
      font-size: 12px;
      color: #fff;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
      position: absolute;
      top: -28px;
      left: -5px;
      font-style: normal;
    }
    #cars-contrast .contrast-list .insert-btn:hover{
      transform: translate3d(0, -2px, 0);
      box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
    }
    #cars-contrast .contrast-list .insert-btn:hover span{
      display: block;
    }

    #cars-contrast .contrast-list .insert-btn.btn2 {
      right: 50px;
      background-image: url('./../../../images/icons/icon_change.png');
    }

    #cars-contrast .contrast-list .no-data {
      font-size: 14px;
      color: #999999;
      text-align: center;
      padding: 20px 0;
    }

  }
</style>
