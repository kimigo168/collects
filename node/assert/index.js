const assert = require('assert')
const Todo = require('./Todo')

let todo = new Todo()
let testsComplete = 0;

function deleteTest () {
  todo.add('Delete me')
  assert.deepStrictEqual(todo.getCount(), 1)
  console.log('result1')
  todo.deleteAll()
  assert.notEqual(todo.getCount(), 1, '数组里不该有值')
  testsComplete++
}

function doAsyncTest () { // 断言中的ok方法用于测试异步方法的值是否符合预期
  todo.doAsync((value) => {
    assert.ok(false, '回调函数应该返回true')
  })
}
deleteTest()
doAsyncTest();