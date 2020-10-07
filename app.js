
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const koaBody = require("koa-body")
const routes = require("./routes/index")
const router = require('koa-router')()
const fs = require("fs")
const https = require("https")
const path = require("path")
// error handler
onerror(app)
// middlewares
// app.use(bodyparser({
//   enableTypes: ['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/upload'))
app.use(require('koa-static')(__dirname + '/views')) 
app.use(require('koa-static')(__dirname + '/front')) // 
// app.use(require('koa-static')(__dirname + '/views/webapp'))
// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

for (let key in routes) {
    for (let item in routes[key]) {
        router.use(
            "/" + key + "/" + (item.slice(1)).toLocaleLowerCase(),
            routes[key][item].routes(),
            routes[key][item].allowedMethods()
        );
    }
}

app.use(
    koaBody({
        formLimit: "100mb",
        jsonLimit: "100mb",
        textLimit: "100mb",
        multipart: true, // 支持文件上传
        //encoding: 'gzip',
        formidable: {
            uploadDir: path.join(__dirname, './upload/'), // 设置文件上传目录
            keepExtensions: true, // 保持文件的后缀
            maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        },
    })
);
app.use(router.routes())
router.get("/admin", async ctx => {
    let html = fs.readFileSync(__dirname + "/front/admin/index.html", "utf-8")
    ctx.status = 200
    ctx.body = html;
});
router.get("/", async ctx => {
    let html = fs.readFileSync(__dirname + "/views/webapp/index.html", "utf-8")
    ctx.status = 200
    ctx.body = html;
});

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});
//mongoose
mongoose.connect(
    "mongodb://146.56.204.2/shop",
    (err) => {
        if (err) {
            console.log("数据库连接出错");
            console.log(err);
        } else {
            console.log("数据库连接成功");
        }
    }
);

module.exports = app