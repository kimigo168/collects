const { Map } = require('immutable')
const map1 = Map({a: 1, b:2, c: 3})
const map2 = map1.set('b', 50)
map1.get('b') + 'vs. ' + map2.get('b') // 2 vs 50

fromJS()
// 作用：将一个js数据转换为Immutable类型的数据
// 用法：fromJS(value, convert)
// value是要转变的数据，convert是要做的操作，第二个参数可不填。默认情况会将数组准换为List类型，将对象转换为Map类型，其余不做操作
const obj = Immutable.fromJS({a: '123', b: '234'}, function (key, value, path) {
  console.log(key, value, path)
  return isIndexed(value) ? value.toList() : value.toOrderedMap()
})

toJS()
// 作用：将一个Immutable数据转换为JS类型的数据
// 用法：value.toJS()

is()
// 作用：对两个对象进行比较
// 用法：is(map1, map2)
// 简介：和js中对象的比较不同，在js中比较两个对象比较的是地址，但是在Immutable中比较的是这个对象hashCode和valueOf，只要两个对象的hashCode相等，值就是相同的，避免了深度遍历，提高了性能
import { Map, is } from 'immutable'
const map1 = Map({a: 1, b:2, c: 1})
const map2 = Map({a: 1, b: 1, c: 1})
map1 === map2 // false
Object.is(map1, map2) // false
is(map1, map2) // true