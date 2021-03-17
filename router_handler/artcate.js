// 处理文章类别路由的函数

// 导入数据库模块
const db = require('../db/index.js');
// 定义并向外暴露获取文章类别的函数
exports.getArtCate = (req, res) => {
  // 定义SQL语句
  const sqlStr = 'select * from ev_article_cate where is_delete=0';
  // 执行SQL语句
  db.query(sqlStr, (err, results) => {
    if (err) {
      res.cc(err);
    }
    else {
      res.send({
        status: 0,
        message: '文章类别获取成功',
        data: results
      });
    }
  })
}
// 定义并向外暴露新增文章分类的函数
exports.addArtCate = (req, res) => {
  // 拿着用户提交到服务器的文章分类名和别名进行数据库查重
  const sqlStr = 'select * from ev_article_cate where name=? or alias=?';
  db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
    if (err) {
      res.cc(err)
    }
    else if (results.length !== 0) {
      res.cc('文章类别或别名重复!')
    }
    else {
      // 文章类别和别名都不重复进行数据插入操作
      const sqlStr = 'insert into ev_article_cate set ?';
      db.query(sqlStr, req.body, (err, results) => {
        if (err) {
          res.cc(err);
        }
        else if (results.affectedRows !== 1) {
          res.cc('新增文章分类失败!');
        }
        else {
          res.cc('新增文章分类成功!', 0);
        }
      })
    }
  })
}
// 定义并向外暴露删除文章分类的函数
exports.delArtCate = (req, res) => {
  const sqlStr = 'update ev_article_cate set is_delete=1 where id=?';
  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) {
      res.cc(err)
    }
    else if (results.affectedRows !== 1) {
      res.cc('删除文章分类失败!');
    }
    else {
      res.cc('删除文章分类成功!', 0);
    }
  })
}
// 定义并向外暴露根据id获取文章分类的函数
exports.getArtCateById = (req, res) => {
  const sqlStr = 'select * from ev_article_cate where id=? and is_delete=0';
  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) {
      res.cc(err)
    }
    else if (results.length !== 1) {
      res.cc('获取文章类别失败！')
    }
    else {
      res.send({
        status: 0,
        message: '获取文章类别成功！',
        data: results[0]
      })
    }
  })
}
// 定义并向外暴露根据id更新文章分类的函数
exports.updateArtCateById = (req, res) => {
  // 拿着用户提交的name和alias先进行数据库查重
  const sqlStr = 'select * from ev_article_cate where name=? or alias=?';
  db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
    if (err) {
      res.cc(err)
    }
    else if (results.length !== 0) {
      res.cc('文章类别或别名重复!')
    }
    else {
      const sqlStr = 'update ev_article_cate set? where id=?';
      db.query(sqlStr, [req.body, req.body.Id], (err, results) => {
        if (err) {
          res.cc(err);
        }
        else if (results.affectedRows !== 1) {
          res.cc('更新文章类别失败！');
        }
        else {
          res.cc('更新文章类别成功！', 0);
        }
      })
    }
  })
}