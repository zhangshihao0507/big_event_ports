// 导入express模块
const express = require('express');
// 创建express的服务器实例对象
const app = express();
// 导入cors中间件
const cors = require('cors');
// 注册cors全局中间件来解决跨域问题
app.use(cors());
// 配置解析application/x-www-form-urlencoded格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }));
// 声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数,专门用来进行异常处理(在路由之前声明,req,res顺序不能写反)
app.use(function (req, res, next) {
  res.cc = function (err, status = 1) {
    // status默认值为1,表示失败的情况
    // err可能是一个错误对象,也可能是一个错误信息字符串
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  };
  next();
})
// 导入数据验证规则中间件
const joi = require('@hapi/joi');
// 导入全局配置模块,获取里面的jwt秘钥
const { jwtSecretKey } = require('./config.js');
// 导入解析Token字符串的中间件(在导入路由模块之前)
const expressJWT = require('express-jwt');
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: jwtSecretKey }).unless({ path: /^\/api\// }));
// 定义错误级别中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }
  // 身份认证失败
  else if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败!');
  }
  else {
    // 未知错误
    res.cc(err)
  }
})
// 使用express.static()中间件，将upload目录中的图片托管为静态资源
app.use('/upload', express.static('/upload'));
// 导入用户注册登录路由模块
const userRouter = require('./router/user.js');
// 注册用户登录注册路由模块
app.use('/api', userRouter); //以api开头的路由访问不需要Token验证身份
// 导入用户个人信息路由模块
const userinfoRouter = require('./router/userinfo.js');
// 注册用户个人信息路由模块
app.use('/my', userinfoRouter); //以my开头的路由访问需要Token验证身份
// 导入文章分类路由模块
const artCateRouter = require('./router/artcate.js');
// 注册文章分类路由模块
app.use('/my/article', artCateRouter); //以my开头的路由访问需要Token验证身份
// 导入文章管理路由模块
const articleRouter = require('./router/article.js');
// 注册文章管理路由模块
app.use('/my/article', articleRouter);




// 调用app.listen方法,指定端口号并启动web服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007');
})