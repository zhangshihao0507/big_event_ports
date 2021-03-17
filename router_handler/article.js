// 导入数据库模块
const db = require('../db/index.js');

// 定义并向外暴露获取文章列表的函数
exports.getArtList = (req, res) => {
  const sqlStr = 'select * from ev_article where is_delete=0'
  db.query(sqlStr, (err, results) => {
    if (err) {
      res.cc('获取文章列表失败!');
    }
    else {
      res.send({
        status: 0,
        message: '获取文章列表成功',
        data: results
      })
    }
  });
}
// 定义并向外暴露发布新文章的函数
exports.addArticle = (req, res) => {
  // 手动验证表单中的文件参数(req.file中的数据)
  if (!req.file || req.file.fieldname !== 'cover_img') {
    res.cc('文章封面是必选参数!');
  }
  else {
    const path = require('path');
    // 整理要插入数据库的文章信息对象：
    const articleInfo = {
      // 标题,内容,状态,所属的分类Id
      ...req.body,
      // 文章封面在服务器端的存放路径
      cover_img: path.join('/upload', req.file.filename),
      // 文章发布时间
      pub_date: new Date(),
      // 文章作者的Id
      author_id: req.user.id
    }
    const sqlStr = 'insert into ev_article set?';
    db.query(sqlStr, articleInfo, (err, results) => {
      if (err) {
        res.cc(err);
      }
      else if (results.affectedRows !== 1) {
        res.cc('发布新文章失败!');
      }
      else {
        res.cc('发布新文章成功!', 0);
      }
    })
  }
}