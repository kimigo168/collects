let city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        if(!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(this.cardNum)) {
          this.$message({message: '身份证号码格式错误!',duration:'2000'});
          return;
        } else if(!city[this.cardNum.substr(0,2)]) {
          this.$message({message: '身份证号码格式错误!',duration:'2000'});
          return;
        } 
        // 如果当前身份证出生年月大于当前时间 
        let idNum = this.cardNum;
        let year = idNum.substr(6,4);
        let month = idNum.substr(10,2);
        let day = idNum.substr(12, 2);
        let birth = year+'-'+month+'-'+day;
        let isBig = this.$GetDateDiff(new Date(birth).format('YYYY-MM-DD'), new Date().format('YYYY-MM-DD'),'day') <= 0;
        if(isBig) {
          this.$message({message: '请输入正确的身份证号码！',duration:'2000'});
          return;
        }
        
 var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则  最前面的1表示只能是以1开头,这点毋庸置疑，[3|4|5|7|8]表示手机号的第二位可以是3、4、5、7、8当中的任意一位，
      //  如果以后出来了11、12或者16、19开头的手机号则只需要将其改为 [1|2|3|4|5|6|7|8|9]即可，这块主要是对手机号的第二位数据进行验证，接下来的[0-9]{9}表示后面的9位
      var flag = reg.test(phoneNum); //true
