//1 nodejs 可以在不增加额外线程情况下，依然可以对任务进行并行处理，node.js是单线程的，
// 它通过事件轮询(event Loop)来实现并行操作 // 尽可能避免阻塞操作，采用回调
//2 Content-Type : MediaType， Internet Media Type,互联网媒体类型，也叫MIME类型，在http协议消息中，使用Content-Type来表示具体请求中的媒体类型信息
// 常见的媒体格式类型如下：

//     text/html ： HTML格式
//     text/plain ：纯文本格式      
//     text/xml ：  XML格式
//     image/gif ：gif图片格式    
//     image/jpeg ：jpg图片格式 
//     image/png：png图片格式

// 以application开头的媒体格式类型：

//    application/xhtml+xml ：XHTML格式
//    application/xml     ： XML数据格式
//    application/atom+xml  ：Atom XML聚合格式    
//    application/json    ： JSON数据格式
//    application/pdf       ：pdf格式  
//    application/msword  ： Word文档格式
//    application/octet-stream ： 二进制流数据（如常见的文件下载）
//    application/x-www-form-urlencoded ： <form encType=””>中默认的encType，form表单数据被编码为         key/value格式发送到服务器（表单默认的提交数据的格式）

// 另外一种常见的媒体格式是上传文件之时使用的：

//     multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式
// 3.创建流
let out = fs.createWriteStream('./log.txt');
out.write(`请求方法：${req.method}`)

// 4.querystring.parse()/querystring.stringify()

//5.
// (1)exports来导出模块的方法或变量，
exports.add = function () {

}
// (2)模块中存在一个module对象，它代表模块自身，exports是它的属性，为了方便，Node为每个模块提供一个exports变量，指向module.exports。
// 等同于 var exports = moudule.exports

/*不能直接将exports变量指向一个值，因为这样等于切断了`exports`与`module.exports`的联系*/

// 导出对象用module.exports,导出多个方法和变量用exports