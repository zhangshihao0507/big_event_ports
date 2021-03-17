// 用户个人信息的路由

// 导入express模块
const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入处理用户信息函数模块
const { getUserInfo, updateUserInfo, updatePassword, updateUserAvatar } = require('../router_handler/userinfo.js');
// 导入验证数据模块
const expressJoi = require('@escook/express-joi');
// 导入表单验证规则模块
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user.js');
// 获取用户基本信息
router.get('/userinfo', getUserInfo);
// 更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), updateUserInfo);
// 重置用户密码
router.post('/updatepwd', expressJoi(update_password_schema), updatePassword);
// 重置用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), updateUserAvatar);
// 向外暴露路由对象
module.exports = router;