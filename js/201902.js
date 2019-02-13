// 1. function () {} , prototype来创建一个类，用class
// 2.requestAnimationFrame
window.requestAnimationFrame(callback)
// 取消
window.cancelAnimationFrame()
// requestAnimationFrame不管理回调函数，一帧调用多次，例如：
window.addEventListener('scroll', e => {
  window.requestAnimationFrame(timestamp => {
    Animation(timestamp)
  })
})
// 在上面代码中，scroll 事件可能在一帧内多次触发，所以 animation 函数可能会在一帧内重复绘制，造成不必要的计算和渲染。
// 一般节流函数来解决，因为节流函数是通过时间管理队列的，而 requestAnimationFrame 的触发时间是不固定的，
// 在高刷新频率的显示屏上时间会小于 16.67ms，页面如果被推入后台，时间可能大于 16.67ms。
// 完美的解决方案是通过 requestAnimationFrame 来管理队列，其思路就是保证 requestAnimationFrame 的队列里，同样的回调函数只有一个
const onScroll = e => {
  if (scheduledAnimationFrame) return;
  scheduledAnimationFrame = true;
  window.requestAnimationFrame(timestamp => {
    scheduledAnimationFrame = false
    animation(timestamp)
  })
}
window.addEventListener('scroll', onScroll)

"18_Sfal6VorLiqQ1pym6n8OWb0uVlOZ_YVrY_HMElmybiN2i4jAim-suGrjb4wqfjkza9gSHucXaIxwrn8ST7go8EsXQ0IQuyLPbCG-GszKg6qJmCgLHYn9FyMMTWq8fyr7XRTsw_s8CpvMJJoAFKYdADAVAO"