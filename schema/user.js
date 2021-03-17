// 导入@hapi/joi模块,定义表单数据项验证规则
const joi = require('@hapi/joi');

// 验证规则如下
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名验证规则
const username = joi.string().alphanum().min(1).max(10).required();
// 密码验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
// id验证规则
const id = joi.number().integer().min(1).required();
// 昵称验证规则
const nickname = joi.string().required();
// 邮箱验证规则
const email = joi.string().email().required();
// 头像验证规则
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required();
// 文章类别验证规则
const name = joi.string().required();
// 文章类别别名验证规则
const alias = joi.not(joi.ref('name')).concat(name);
// 定义用户登录和注册表单中的规则验证对象并向外暴露
exports.reg_login_schema = {
  // 表示需要对req.body中的username和password数据进行验证
  body: {
    username,
    password
  }
}
// 定义更新用户信息功能中的表单验证对象并向外暴露
exports.update_userinfo_schema = {
  // 表示需要对req.body中的username和password数据进行验证
  body: {
    nickname,
    email
  }
}
// 定义重置密码的表单验证对象并向外暴露
exports.update_password_schema = {
  body: {
    // 使用password这个规则来验证req.body.oldPwd的值(password规则已经被定义过)
    oldPwd: password,
    // joi.ref('oldPwd')表示值必须和oldPwd的值一致
    // joi.not(joi.ref('oldPwd'))表示值必须和oldPwd不一致
    // .concat用户合并joi.not(joi.ref('oldPwd'))和password两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password)
  }
}
// 定义重置用户头像的表单验证对象并向外暴露
exports.update_avatar_schema = {
  body: {
    avatar
  }
}
// 定义新增文章分类的表单验证对象并向外暴露
exports.add_artcate_schema = {
  body: {
    name,
    alias
  }
}
// 定义删除文章分类的表单验证对象并向外暴露
exports.del_artcate_schema = {
  params: {
    id
  }
}
// 定义根据id获取文章分类的表单验证对象并向外暴露
exports.get_artcate_schema = {
  params: {
    id
  }
}
// 定义根据id获取文章分类的表单验证对象并向外暴露
exports.update_artcate_schema = {
  body: {
    Id: id,
    name,
    alias
  }
}
// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()
// 定义发布新文章的表单验证对象并向外暴露
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state
  }
}