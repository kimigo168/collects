// 1.contenteditable = true
<div contenteditable="true">
  <p>这是可编辑的</p>
  <p contenteditable="false">这是不可编辑的</p>
</div>

// 2.document.execCommand(aCommandName, aShowDefaultUI, aValueArgument) // document.execCommand(命令名称，是否展示用户界面，命令需要的额外参数)
// 其中第一个参数就是一些命令名称，具体的可以查看 MDN；第二个参数写死为 false 就行了，因为早前 IE 有这样一个参数，为了兼容吧，不过这个参数在现代浏览器中是没有影响的；第三个参数就是一些命令可能需要额外的参数，比如插入图片就要多传个 url 或 base64 的参数，没有的话传个 null 就行。

// 加粗
document.execCommand('bold', false, null)
// 添加图片
document.execCommand('insertImage', false, url || base64)
// 把一段文字用 p 标签包裹起来
document.execCommand('formatblock', false, '<p>')

// 3.Selection 和 Range对象
let range = window.getSelection().getRangeAt(0)
// {
//   collapsed: true, // 开始和结尾是否重合
//   commonAncestorContainer: p,
//   endContainer: p,
//   endOffset: 26,
//   startContainer: p,
//   startOffset: 26
// }

// Selection 对象还有几个常用的方法， addRange、 removeAllRanges、 collapse 和 collapseToEnd 等等。
// 这个知识点是很重要的，因为它让我们有了操纵光标的能力（比如插入内容之后设置光标的位置）

// 实例：功能实现：加粗，段落，H1,水平线，无序列表，插入链接，插入图片，后退一步，向前一步
{/* <button @click="execCommand('redo')">后退</button> */}
// 注意：1.如果用的不是button,执行命令无效，是因为点击其他标签大多都会造成失去焦点，再执行点击事件，此时没有选区或光标就没有效果
// 2.我们执行的是原生的 document.execCommand 方法，浏览器自身会对 contenteditable 这个可编辑区维护一个 undo 栈和一个 redo 栈，所以我们才能执行前进和后退的操作
// 3.style 里面如果加上 scope 的话，里面的样式对编辑区的内容是不生效的，因为编辑区里面是后来才创建的元素，所以要么删了 scope，要么用 /deep/ 解决（Vue 是这样）。
// 4.操作光标
// 除了不好对图片进行处理外，光标应该也是一大坑，你可能不知道什么时候就失去焦点了，此时再点击按钮执行命令就无效了；有时你又需要还原或设置光标的位置，比如插入图片后，光标要设置到图片后面等等之类的。
// 所以我们需要具有控制光标的能力，具体操作就是在点击按钮之前我们可以先存储当前光标的状态，执行完命令或者在需要的时候后再还原或设置光标的状态即可。由于在 chrome 中，失去焦点并不会清除 Seleciton 对象和 Range 对象

function saveSelection () { // 保存当前Range对象
  let selection = window.getSelection()
  if (selection.rangeCount > 0) {
    return selection.getRangeAt(0)
  }
  return null
}

let selectedRange = saveSelection()
function restoreSelection () {
  let selection = window.getSelection()
  if (selectedRange) {
    selection.removeAllRanges(); // 清空所有range对象
    selection.addRange(selectedRange); // 恢复保存的Range
  }
}