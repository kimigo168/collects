<template>
  <div class="xr-editor">
    <!-- 按钮区 -->
    <div class="nav">
      <button @click="execCommand('bold')">加粗</button>
      <button @click="execCommand('formatBlock', '<p>')">段落</button>
      <button @click="execCommand('formatBlock', '<h1>')">H1</button>
      <button @click="execCommand('formatBlock', '<h2>')">H2</button>
      <button @click="execCommand('formatBlock', '<h3>')">H3</button>
      <button @click="execCommand('formatBlock', '<h4>')">H4</button>
      <button @click="execCommand('formatBlock', '<h5>')">H5</button>
      <button @click="execCommand('formatBlock', '<h6>')">H6</button>
      <button @click="createLink">链接</button>
      <button @click="insertImgLink" class="nav__img">
        图片
        <!-- 这个input是隐藏的 -->
        <input type="file" accept="image/gif,image/jpeg,image/png" @change="insertImg">
      </button>
      <button @click="execCommand('insertUnorderedList')">无序列表</button>
      <button @click="execCommand('insertHorizontalRule')">水平线</button>
      <button @click="execCommand('undo')">后退</button>
      <button @click="execCommand('redo')">前进</button>
    </div>
    <!-- 编辑区 -->
    <div class="row">
      <div class="editor" contenteditable="true" @input="print"></div>
      <div class="content">{{html}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'editor',
  data () {
    return {
      html: '',
      editor: null,
      nowImg: '',
      boxes: [],
      dragBox: '',
      dragStartX: '',
      preDragWidth: ''
    }
  },
  methods: {
    execCommand (name, args = null) {
      document.execCommand(name, false, args)
    },
    print () {
      this.html = document.querySelector('.editor').innerHTML
    },
    createLink () {
      let url = window.prompt('请输入链接地址')
      if (url) this.execCommand('createLink', url)
    },
    insertImgLink () {
      // let url = window.prompt('请输入图片地址')
      // if (url) this.execCommand('insertImage', url)
    },
    insertImg (e) { // 必须保证光标在编辑区，才能插入
      let reader = new FileReader()
      let file = e.target.files[0]
      reader.onload = () => {
        let base64Img = reader.result
        this.execCommand('insertImage', base64Img)
        document.querySelector('.nav__img input').value = '' // 解决同一张图片上传无效的问题
      }
      reader.readAsDataURL(file)
    },
    // 1.判断用户点击的区域是否编辑区里面的图片
    handleClick (e) {
      if (e.target && e.target.tagName && e.target.tagName.toUpperCase() === 'IMG') {
        this.handleClickImg(e.target)
      }
    },
    // 2.在点击的图片上创建个大小一样的div;动态创建一个蒙层（和图片一样大小）以及四个拖拽顶点;
    handleClickImg (img) {
      this.nowImg = img
      this.showOverlay()
    },
    showOverlay () {
      // 添加蒙层
      this.overlay = document.createElement('div')
      this.editor.appendChild(this.overlay)
      // 定位蒙层和大小
      this.repositionOverlay()
    },
    repositionOverlay () {
      let imgRect = this.nowImg.getBoundingClientRect() // 标签到页面上下左右
      let editorRect = this.editor.getBoundingClientRect()
      // 设置蒙层宽高和位置
      Object.assign(this.overlay.style, {
        position: 'absolute',
        top: `${imgRect.top - editorRect.top + this.editor.scrollTop}px`,
        left: `${imgRect.left - editorRect.left - 1 + this.editorRect.scrollLeft}px`,
        width: `${imgRect.width}px`,
        height: `${imgRect.height}px`,
        boxSizing: 'border-box',
        border: '1px dashed red'
      })
      this.createBox() // 添加四个顶点的拖拽框
    },
    createBox () {
      this.boxes = []
      this.addBox('nwse-resize') // top left
      this.addBox('nesw-resize') // top right
      this.addBox('nwse-resize') // bottom right
      this.addBox('nesw-resize') // bottom left
      this.positionBoxes() // 设置四个拖拽框位置
    },
    addBox (cursor) {
      const box = document.createElement('div')
      Object.assign(box.style, {
        position: 'absolute',
        height: '12px',
        width: '12px',
        backgroundColor: 'white',
        border: '1px solid #777',
        boxSizing: 'border-box',
        opacity: '.8'
      })
      box.style.cursor = cursor
      box.addEventListener('mousedown', this.handleMouseDown)
      this.overlay.appendChild(box)
      this.boxes.push(box)
    },
    positionBoxes () {
      let handleXOffset = '-6px'
      let handleYOffset = '-6px'
      let arr = [
        { left: handleXOffset, top: handleYOffset },
        { right: handleXOffset, top: handleYOffset },
        { right: handleXOffset, bottom: handleYOffset },
        { left: handleXOffset, bottom: handleYOffset }
      ]
      arr.forEach((pos, idx) => {
        Object.assign(this.boxes[idx].style, pos)
      })
    },
    handleMouseDown (e) { // 在四个顶点框上添加拖拽事件
      this.dragBox = e.target
      this.dragStartX = e.clientX
      this.preDragWidth = this.nowImg.width
      this.setCursor(this.dragBox.style.cursor)
      document.addEventListener('mousemove', this.handleDrag)
      document.addEventListener('mouseup', this.handleMouseup)
    },
    handleDrag (e) {
      // 计算水平拖动距离
      const deltaX = e.clientX - this.dragStartX
      // 修改图片的大小
      if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) { // 左边两个框
        this.nowImg.width = Math.round(this.preDragWidth - deltaX)
      } else { // 右边两个框
        this.nowImg.width = Math.round(this.preDragWidth + deltaX)
      }
      // 同时修改蒙层大小
      this.repositionOverlay()
    },
    handleMouseup () {
      this.setCursor('')
      // 拖拽结束移出监听事件
      document.removeEventListener('mousemove', this.handleDrag)
      document.removeEventListener('mouseup', this.handleMouseup)
    },
    setCursor (value) { // 设置鼠标样式
      [document.body, this.nowImg].forEach(el => {
        el.style.cursor = value
      })
    }
  },
  mounted () {
    this.editor = document.querySelector('.editor')
    this.editor.addEventListener('click', this.handleClick)
  }
}
</script>
<style lang="scss">
.xr-editor {
  margin: 50px auto;
  width: 1000px;
}
.nav {
  display: flex;
  button {
    cursor: pointer;
    margin-right: 10px;
  }
  &__img {
    position: relative;
    input {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
}

.row {
  display: flex;
  width: 100%;
  height: 300px;
}
.editor {
  min-height: 400px;
  flex: 1;
  position: relative;
  margin-right: 20px;
  margin-top: 10px;
  padding: 10px;
  outline: none;
  border: 1px solid #000;
  overflow-y: scroll;
  img {
    max-width: 300px;
    max-height: 300px;
    vertical-align: middle;
  }
}
.content {
  flex: 1;
  border: 1px solid #000;
  word-break: break-all;
  word-wrap: break-word;
  overflow: scroll;
}
</style>
