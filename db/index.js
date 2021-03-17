// 导入mysql模块
const mysql = require('mysql');
// 创建数据库连接对象db
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'my_db_01'
});
// 向外暴露数据库连接对象db
module.exports = db;