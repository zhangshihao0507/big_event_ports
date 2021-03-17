// 在这里定义和用户注册,登录相关的路由处理函数，供 /router/user.js 模块进行调用

// 导入数据库模块
const db = require('../db/index.js');
// 导入bcrypt模块进行密码校验
const bcrypt = require('bcryptjs');
// 导入jsonwebtoken模块来生成JWT令牌字符串
const jwt = require('jsonwebtoken');
// 定义并暴露用户注册处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body;
  // 导入数据库模块
  const db = require('../db/index.js');
  // 定义查询语句判断用户名是否被占用
  const sqlStr = 'select * from ev_users where username=?';
  // 执行sql语句
  db.query(sqlStr, [userinfo.username], function (err, results) {
    // SQL语句查询失败
    if (err) {
      return res.cc(err);
    }
    else if (results.length > 0) {
      // 用户名被占用
      return res.cc('用户名已被占用,请更换其他用户名!');
    }
    // 导入bcryptjs模块
    const bcrypt = require('bcryptjs');
    // 使用bcrypt对用户密码进行加密存储
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    // 将用户信息插入到数据库中
    const sqlStr = 'insert into ev_users set?';
    // 执行SQL语句
    db.query(sqlStr, { username: userinfo.username, password: userinfo.password }, function (err, results) {
      // 执行 SQL 语句失败
      if (err) {
        return res.cc(err);
      }
      // 执行 SQL 语句成功,但影响的行数不为1
      else if (results.affectedRows !== 1) {
        return res.cc('用户注册失败,请稍后再试');
      }
      // 添加到数据库成功,返回结果
      return res.cc('用户注册成功!', 0);
    });
  });

}
// 定义并暴露用户登录处理函数
exports.loginUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body;
  // 定义SQL查询语句
  const sqlStr = 'select * from ev_users where username=?';
  db.query(sqlStr, userinfo.username, function (err, results) {
    // 执行SQL语句失败
    if (err) {
      return res.cc(err);
    }
    // 执行SQL语句成功,但是查询到的数据条数不为1
    else if (results.length !== 1) {
      return res.cc(err);
    }
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('密码错误！');
    }
    // 用户密码验证成功,生成JWT的令牌字符串
    // 在生成Token字符串的时候，一定要剔除密码和头像的值(因为Token字符串根据用户信息生成并且在客户端中保存,所以要去除用户敏感信息)
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    // 通过ES6的高级语法，快速剔除密码和头像的值,拿到用于生成Token字符串的用户信息对象
    // 这个信息对象最后会被express-jwt中间件解析出来挂载到req.user上
    const user = { ...results[0], password: '', user_pic: '' };
    // 从全局配置对象中获取jwt秘钥和Token字符串有效期
    const { jwtSecretKey, expiresIn } = require('../config.js');
    // 拿着jwt秘钥和用户信息来生成Token字符串并发给客户端保存
    const tokenStr = jwt.sign(user, jwtSecretKey, { expiresIn: expiresIn });
    // 登录成功,向客户端发送成功消息,并将Token令牌交给客户端保管
    res.send({
      "status": 0,
      "msg": "登录成功",
      //为了方便客户端使用,直接在token前加'Bearer '字符串(客户端在发起请求时需要在请求头中的authorization属性中添加'Bearer '+token字符串用于服务器验证客户端身份) 
      "token": "Bearer " + tokenStr
    })
  })
}