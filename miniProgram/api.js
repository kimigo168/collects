wx.setStorage()
// 除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB
// data能够通过JSON.stringify()序列化对象
try {
  wx.setStorage({
    key: 'value'
  })
} catch (e) {}