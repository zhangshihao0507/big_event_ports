// 文章管理的路由
// 注意:使用express.urlencoded()中间件无法解析multipart/form-data格式的请求体数据。

// 导入express模块
const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入处理form-data格式数据的模块
const multer = require('multer');
// 导入处理路径的模块
const path = require('path');
// 创建multer的实例对象,通过dest属性指定服务器保存客户端发送过来的文件的路径
const upload = multer({ dest: path.join(__dirname, '../upload') });


// 导入文章管理处理函数模块
const { addArticle, getArtList } = require('../router_handler/article.js');
// 导入表单验证规则模块
const { add_article_schema } = require('../schema/user.js');
// 导入表单验证模块
const expressJoi = require('@escook/express-joi');
// 定义获取文章列表的路由
router.get('/list', getArtList);
// 定义发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), addArticle);

// 向外暴露路由
module.exports = router;