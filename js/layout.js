function setPageSize () {
  if (window.innerWidth == 0) {
    setTimeout(() => {
      setPageSize()
    }, 200);
  } else {
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let fontWidth =  (winWidth * 20) / 1920;
    let fontHeight = (winHeight * 20) / 1080;
    window.document.documentElement.style.width = winWidth + 'px'
    window.document.documentElement.style.height = winHeight + 'px'
    document.documentElement.style.fontSize = (fontWidth > fontHeight ? fontHeight : fontWidth).toFixed(2) + 'px'
  }
}
setPageSize()
window.onload = () => {
  setPageSize()
}
window.onresize = () => {
  setPageSize()
}