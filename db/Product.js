const mongoose = require("mongoose");

//定义数据库骨架（字段名，字段类型，是否默认值）
var schema = mongoose.Schema({
    name: String,
    seq: Number,
    url: String,
    text: String
}, {
    versionKey: false //版本号不更新
});
module.exports = mongoose.model("Product", schema, "Product");