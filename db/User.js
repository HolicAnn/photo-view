const mongoose = require("mongoose");

//定义数据库骨架（字段名，字段类型，是否默认值）
var schema = mongoose.Schema({
    username: { //tel
        type: String,
    },
    password: {
        type: String,
    },
}, {
    versionKey: false //版本号不更新

});
module.exports = mongoose.model("User", schema, "User");