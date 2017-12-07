// map的回调函数中支持return返回值；return的是啥，相当于把数组中的这一项变为啥（并不影响原来的数组，只是相当于把原数组克隆一份，把克隆的这一份的数组中的对应项改变了
//在vue中清空一个数组
let arr = ['','','',''];
this.arr1 = arr;
this.arr2 = arr;
//以上不行，应该
this.chosedIndexArr.map((value,index) => {
  that.$set(that.checkedCities,index,'');
  that.$set(that.checkedCityKeys,index,'');
});
