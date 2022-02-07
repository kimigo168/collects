exports.install = (Vue) => {
  // 数组去重
  Vue.prototype.$uniqueArr = (arr, key) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j] || arr[i][key] == arr[j][key]) {
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  }
  // 时长显示
  Vue.prototype.$durationDeal = (duration) => {
    if (!duration) return;
    if (duration >= 60) {
      return Math.floor(duration/60)+'分'+duration%60+'秒';
    } else {
      return duration + '秒';
    } 
  }

  // 获取资讯父子频道
  Vue.prototype.$getNewsChannel = function (id) {
    this.$jqAjax({
      url: apiHost + '/user/getNewsChannel',
      type: 'POST',
      data: {
        pid: id
      },
      success: (res) => {
        if (res.code == 0) {
          if (id) { // 请求子频道
            this.newsChildChannelList = res.data;
          } else { // 请求父频道
            this.newsParentChannelList = res.data;
            if (this.newsParentChannelList.length > 0) {
              this.$getNewsChannel(this.newsParentChannelList[0].id);
            }
          }
        }
      },
      error: (err) => {
        this.$message({type: 'warning', message: err.msg, showClose: true});
      }
    });
  }

  // 获取视频父子频道
  Vue.prototype.$getVideoChannel = function (id) {
    this.$jqAjax({
      url: apiHost + '/user/getVideoChannel',
      type: 'POST',
      data: {},
      success: (res) => {
        if (res.code == 0 && res.data) {
          this.videoParentChannelList = res.data;
        }
      },
      error: (err) => {
        this.$message({type: 'warning', message: err.msg, showClose: true});
      }
    });
  }
} 