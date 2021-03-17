// 文章分类的路由

// 导入express模块
const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入表单验证规则模块
const { add_artcate_schema, del_artcate_schema, get_artcate_schema, update_artcate_schema } = require('../schema/user.js');
// 导入表单验证模块
const expressJoi = require('@escook/express-joi');
// 导入文章分类处理函数
const { getArtCate, addArtCate, delArtCate, getArtCateById, updateArtCateById } = require('../router_handler/artcate.js');

// 获取文章分类路由
router.get('/cates', getArtCate);
// 新增文章分类路由
router.post('/addcates', expressJoi(add_artcate_schema), addArtCate);
// 删除文章分类路由
router.post('/deletecate/:id', expressJoi(del_artcate_schema), delArtCate);
// 根据id获取文章类别路由
router.get('/cates/:id', expressJoi(get_artcate_schema), getArtCateById);
// 根据id更新文章类别路由
router.post('/updatecate', expressJoi(update_artcate_schema), updateArtCateById);
// 向外暴露路由对象
module.exports = router;