// 在这里定义和用户注册,登录相关的路由处理函数，供 /router/user.js 模块进行调用

// 导入数据库模块
const db = require('../db/index.js');
// 定义并向外暴露获取用户信息的函数
exports.getUserInfo = (req, res) => {
  // 根据用户id查询用户数据
  // 注意：为了防止用户的密码泄露，需要排除 password 字段
  const sqlStr = 'select id, username, nickname, email, user_pic from ev_users where id=?';
  // 执行SQL语句
  // 注意: req对象上的user属性,是Token解析成功,express-jwt中间件挂载上去的
  db.query(sqlStr, req.user.id, function (err, results) {
    if (err) {
      return res.cc(err);
    }
    else if (results.length !== 1) {
      return res.cc('获取用户信息失败!');
    }
    else {
      // 从数据库查询用户信息成功,发送给客户端
      res.send({
        status: 0,
        message: '获取用户信息成功',
        data: results[0]
      })
    }
  })
};
// 定义并向外暴露更新用户信息的函数
exports.updateUserInfo = (req, res) => {
  // 根据 id 来更改用户 nickname 和 email 的值
  const sqlStr = 'update ev_users set? where id=?';
  // 执行 SQL 语句
  db.query(sqlStr, [req.body, req.user.id], (err, results) => {
    if (err) {
      res.cc(err);
    }
    else if (results.affectedRows !== 1) {
      res.cc('修改用户信息失败!')
    }
    else {
      res.send({
        "status": 0,
        "message": "修改用户信息成功!"
      });
    }
  })
}
// 定义并向外暴露重置用户密码的函数
exports.updatePassword = (req, res) => {
  // 获取用户提交到服务器中的数据
  const userinfo = req.body;
  // 根据用户id查询数据
  const sqlStr = 'select * from ev_users where id=?';
  // 执行SQL语句
  db.query(sqlStr, req.user.id, (err, results) => {
    if (err) {
      res.cc(err);
    }
    else if (results.length !== 1) {
      res.cc('密码重置失败!');
    }
    else {
      // 导入bcrypt模块
      const bcrypt = require('bcryptjs');
      // 拿着用户提交的旧密码和数据库保存的密码对比
      const compareResult = bcrypt.compareSync(userinfo.oldPwd, results[0].password);
      if (!compareResult) {
        return res.cc('原密码错误!')
      }
      else {
        // 验证原密码成功
        // 定义新密码(把用户提交过来的新密码进行bcrypt加密处理)
        const newPwd = bcrypt.hashSync(userinfo.newPwd, 10);
        // 对新密码进行bcrypy加密后更新到数据库
        const sqlStr = 'update ev_users set password=? where id=?';
        // 执行SQL语句
        db.query(sqlStr, [newPwd, req.user.id], (err, results) => {
          if (err) {
            res.cc(err);
          }
          else if (results.affectedRows !== 1) {
            res.cc('密码重置失败!');
          }
          else {
            res.send({
              status: 0,
              message: '密码更新成功!'
            })
          }
        });

      }
    }
  })
}
// 定义并向外暴露重置用户头像的函数
exports.updateUserAvatar = (req, res) => {
  // 更新数据库中用户的头像
  const sqlStr = 'update ev_users set user_pic=? where id=?';
  // 执行SQL语句
  db.query(sqlStr, [req.body.avatar, req.user.id], (err, results) => {
    if (err) {
      res.cc(err);
    }
    else if (results.affectedRows !== 1) {
      res.cc('更新用户头像失败');
    }
    else {
      res.send({
        status: 0,
        message: '更新用户头像成功!'
      })
    }
  });
}