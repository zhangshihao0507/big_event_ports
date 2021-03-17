// 用户注册和登录的路由

// 导入路由模块
const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入用户路由处理函数模块
const { regUser, loginUser } = require('../router_handler/user.js');
// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入需要验证规则的对象
const { reg_login_schema } = require('../schema/user.js');
// 用户注册
router.post('/reguser', expressJoi(reg_login_schema), regUser);
// 用户登录
router.post('/login', expressJoi(reg_login_schema), loginUser);
// 向外暴露路由对象
module.exports = router;
