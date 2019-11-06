import React, { Component } from 'react'
import axios from 'axios'
import Aux from '../Aux'

class MyPic extends Component {
  state = {
    smallSrc: null,
    subject: null
  }
  /**
   * 根据url直接获取到 DataURL
   */
  converImgToDataURLviaCanvas (url, callback, outputFormat) {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // canvas不能处理跨域图片，如果要处理，除了服务端要开启跨域外，执行canvas前也要开启跨域
    img.onload = function () {
      let canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      let dataURL = ''
      canvas.height = this.height
      canvas.width = this.width
      ctx.drawImage(this, 0, 0)
      dataURL = canvas.toDataURL(outputFormat)
      canvas.toBlob(callback)
      canvas = null
    }
    img.src = url
  }

  /**
   * 根据图片URL直接获取到Blob
   */
  convertImgToBlobviaCanvas (url, callback) {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      let canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      let dataURL = ''
      canvas.height = this.height
      canvas.width = this.width
      ctx.drawImage(this, 0, 0)
      canvas.toBlob(callback)
      canvas = null
    }
    img.src = url
  }


  /**
   * 把文件转成 dataURL通过fileReader
   */
  covertFileToDataURLviaFileReader (url, callback) {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.onload = function () {
      const reader = new FileReader()
      reader.onloaded = function () {
        callback(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', url)
    xhr.send()
  }

  /**
   * 把dataURL 转成blob
   */
  dataURLToBlob (dataurl) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  /**
   * 将图片base64转成blob
   */
  
}