const templates = [
  {
    'name': '新闻',
    'list': [
      // {
      //   'name': '水灾新闻',
      //   'desc': '适用于写水灾新闻，包括水灾概况、影响和抢险情况。',
      //   'inputType': '输入类型：地名，例如桂林，广西',
      //   'img': require('../images/templates/news/water.jpg')
      // },
      // {
      //   'name': '地震新闻',
      //   'desc': '适用于写地震新闻，包括地震情况、影响和抢险情况。',
      //   'inputType': '输入类型：地名，例如汶川，内江',
      //   'img': require('../images/templates/news/earthquake.jpg')
      // },
      {
        'name': '娱乐八卦',
        'desc': '适用于写娱乐八卦，包括某热门事件、恋情、个人作品、奖项和故事。',
        'inputType': '输入类型：人名，例如范冰冰，迪丽热巴，热巴',
        'img': require('../images/templates/news/entertainment.jpg')
      },
      {
        'name': '科技新闻',
        'desc': '适用于写科技新闻，包括关于某应用领域、发展历程、特点特征、面临的挑战。',
        'inputType': '输入类型：技术名，例如区块链，人工智能',
        'img': require('../images/templates/news/science.jpg')
      },
      {
        'name': '热点事件介绍',
        'desc': '适用于写近期热点事件文章。',
        'inputType': '输入类型：事件主角，例如乔碧萝',
        'img': require('../images/templates/news/hots.jpg')
      }, {
        'name': '商业人物传记',
        'desc': '适用于商界人物的相关介绍。',
        'inputType': '输入类型：人名，例如马云',
        'img': require('../images/templates/news/person.jpg')
      }, {
        'name': '电影影评',
        'desc': '适用于电影的相关介绍及评论。',
        'inputType': '输入类型：电影名，例如哪吒',
        'img': require('../images/templates/news/movie.jpg')
      }, {
        'name': '退役新闻',
        'desc': '适用于写体育类退役新闻，包括某正式退役，退役的原因。荣誉和对某退役的感慨。',
        'inputType': '输入类型：人名，例如科比，帕克',
        'img': require('../images/templates/news/sports.jpg')
      }, {
        'name': '更多提纲',
        'desc': '敬请期待',
        'inputType': '',
        'img': require('../images/templates/news/more_templates.png')
      }
    ]
  }
  // {
  //   'name': '评测',
  //   'list': [
  //     {
  //       'name': '手机评测',
  //       'desc': '适用于写手机评测文章，包括某新品发布、价格、硬件性能、软件性能和外观设计。',
  //       'inputType': '输入类型：手机型号，例如iphone11，三星Note10',
  //       'img': require('../images/templates/pingce/mobile.jpg')
  //     },
  //     {
  //       'name': '游戏评测',
  //       'desc': '适用于写游戏测评类文章，包括某款游戏介绍、游戏特色、游戏系统和评测综述。',
  //       'inputType': '输入类型：游戏名，例如王者荣耀，龙族幻想',
  //       'img': require('../images/templates/pingce/game.jpg')
  //     },
  //     // {
  //     //   'name': '桌游测评',
  //     //   'desc': '适用于写桌游测评类文章。',
  //     //   'inputType': '输入类型：桌游游戏名，例如大富翁',
  //     //   'img': require('../images/templates/pingce/deskgame.jpg')
  //     // },
  //     {
  //       'name': '智能硬件介绍',
  //       'desc': '适用于写智能硬件类文章。',
  //       'inputType': '输入类型：智能硬件名称，例如智能手表，智能家居',
  //       'img': require('../images/templates/pingce/hardware.jpg')
  //     }
  //   ]
  // },
  // {
  //   'name': '攻略',
  //   'list': [
  //     {
  //       'name': '减肥攻略',
  //       'desc': '适用于写减肥攻略类文章，包括肥胖的烦扰、瘦身的方法、瘦身的注意事项和心得体会。',
  //       'inputType': '输入类型：身体部位，例如腹部，腿部',
  //       'img': require('../images/templates/gonlve/losesweight.jpg')
  //     }, {
  //       'name': '健身塑形攻略',
  //       'desc': '适用于写健身塑形类文章，包括各类健身的好处、目标、计划定制和注意事项。',
  //       'inputType': '输入类型：运动方式，例如慢跑，骑行',
  //       'img': require('../images/templates/gonlve/jiansheng.jpg')
  //     }, {
  //       'name': '海岛旅游攻略',
  //       'desc': '适用于写海岛旅游攻略方面的文章，包括海岛的介绍、特点、美食、住宿、交通和注意事项。',
  //       'inputType': '输入类型：地名，例如普吉岛，巴厘岛',
  //       'img': require('../images/templates/gonlve/island.jpg')
  //     }, {
  //       'name': '户外运动攻略',
  //       'desc': '适用于写户外运动攻略方面的文章，包括户外类运动的小知识、运动装备、运行训练方法和注意事项。',
  //       'inputType': '输入类型：运动类型，例如登山',
  //       'img': require('../images/templates/gonlve/outdoor.jpg')
  //     }, {
  //       'name': '亚洲自助游',
  //       'desc': '适用于写亚洲地区自助游。',
  //       'inputType': '输入类型：地名，例如日本，韩国',
  //       'img': require('../images/templates/gonlve/asian.jpg')
  //     }, {
  //       'name': '国外自助游',
  //       'desc': '适用于写国外自助游。',
  //       'inputType': '输入类型：地名，例如澳大利亚，新西兰',
  //       'img': require('../images/templates/gonlve/oversea.jpg')
  //     }
  //   ]
  // }
  //  {
  //   'name': '美妆',
  //   'list': [
  //     {
  //       'name': '美妆经验',
  //       'desc': '适用于写美妆护肤经验。',
  //       'inputType': '输入类型：美妆问题，例如皮肤干燥，黑眼圈',
  //       'img': require('../images/templates/meizhuan/meizhuan.jpg')
  //     },
  //     // {
  //     //   'name': '妆容介绍',
  //     //   'desc': '适用于写妆容介绍。例如：新娘妆',
  //     //   'inputType': '输入类型，例如少女妆',
  //     //   'img': require('../images/templates/meizhuan/face.jpg')
  //     // },
  //     {
  //       'name': '服装搭配',
  //       'desc': '适用于写服装搭配的文章。',
  //       'inputType': '输入类型：季节，例如春季，夏季',
  //       'img': require('../images/templates/meizhuan/cloth.jpg')
  //     }, {
  //       'name': '发型介绍',
  //       'desc': '适用于写发型介绍的文章。',
  //       'inputType': '输入类型：脸型，例如圆脸，方脸',
  //       'img': require('../images/templates/meizhuan/hairintroduce.jpg')
  //     }
  //   ]
  // }
]

export default {
  templates
}
