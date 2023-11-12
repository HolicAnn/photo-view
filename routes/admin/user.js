const router = require('koa-router')()
const User = require("../../db/User");
const Product = require("../../db/Product");
const crypto = require("crypto");
const jwt = require("jwt-simple");
const uuid = require("uuid");
const getUserInfo = require("../../util/getUserInfo");
const fs = require("fs")
const path = require("path")
// router.prefix('/user')
const {
    jstSecret
} = require('../../util/secret.js')

router.post("/login", async ctx => {
    let {
        username,
        password
    } = ctx.request.body;

    if (!username) {
        return ctx.body = {
            state: 201,
            msg: "账号不能为空"
        }
    } else if (!password) {
        return ctx.body = {
            state: 201,
            msg: "密码不能为空"
        }
    } else {
        let hash = crypto.createHash("md5");
        hash.update(password);
        let str = hash.digest('hex');
        let pwd = str.toUpperCase();

        let result = await User.findOne({
            username,
            password: pwd,
        }).then((doc) => {
            return doc;
        });
        if (result) {
            ctx.cookies.set('propduct', jwt.encode(result._id, jstSecret), {
                httpOnly: false
            });
            return ctx.body = {
                state: 200,
                msg: "登录成功"
            }
        } else {
            return ctx.body = {
                state: 201,
                msg: "登录失败"
            }
        }
    }
});

//上传
router.post("/upload", async (ctx, next) => {
    let {
        filepath,
        newFilename,
        originalFilename //图片路径
    } = ctx.request.files.filepath;
   // console.log("222", ctx.request.files.filepath)
    let creator = await getUserInfo(ctx, jstSecret, "propduct"); //获取token
    if (creator) {
        let user = await User.findOne({
            username: creator.username
        }).then((doc) => {
            return doc;
        })
        if (user.password == creator.password) {
            const randomNum = new Date().getHours() + "" + new Date().getMinutes() + Math.random() * 999999;
            const reader = fs.createReadStream(filepath);
            let cfilePath = path.join(__dirname, '../../public/upload/image/') + `${randomNum}_${originalFilename}`;
            // let filePath = path.join(__dirname, '../public/upload/image/user/') + `/${element[1].name}`; 斜杆问题注意一下
            // 创建可写流
            const upStream = fs.createWriteStream(cfilePath);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
            return (ctx.body = {
                state: 200,
                msg: "上传成功",
                url: '/upload/image/' + `${randomNum}_${originalFilename}`,
            });
        } else {
            return (ctx.body = {
                state: 201,
                msg: "权限错误,请登录管理员账号!",
            });
        }
    } else {
        return (ctx.body = {
            state: 201,
            msg: "请登录后重试！",
        });
    }
});

//新建
router.post("/add", async (ctx, next) => {
    let {
        name, //名称
        text, //描述
        seq, //序号,数字越大越靠前
        filepath //图片路径
    } = ctx.request.body;
    let creator = await getUserInfo(ctx, jstSecret, "propduct"); //获取token
    if (creator) {
        let user = await User.findOne({
            username: creator.username
        }).then((doc) => {
            return doc;
        })
        if (user.password == creator.password) {
            let product = await new Product({
                name,
                text,
                seq,
                url: filepath
            });
            let data = await product.save().then((doc) => {
                return doc;
            });
            if (data) {
                return (ctx.body = {
                    state: 200,
                    msg: "创建成功",
                    data: data,
                });
            } else {
                return (ctx.body = {
                    state: 201,
                    msg: "创建失败",
                });
            }
        } else {
            return (ctx.body = {
                state: 201,
                msg: "权限错误,请登录管理员账号!",
            });
        }
    } else {
        return (ctx.body = {
            state: 201,
            msg: "请登录后重试！",
        });
    }
});

router.get("/list", async ctx => {
    let list = await Product.find({}).sort({
            seq: -1
        })
        .then((doc) => {
            return doc;
        })

    return (ctx.body = {
        state: 200,
        msg: "获取商品成功",
        list: list,
        title: "---三月---"

    });
});

router.get("/detail", async ctx => {
    let {
        id
    } = ctx.request.query;

    let data = await Product.findById({
        _id: id
    }).then((doc) => {
        return doc;
    })
    if (data) {
        return ctx.body = {
            state: 200,
            data: data,
        }
    } else {
        return ctx.body = {
            state: 201,
            msg: "错误，商品不存在",
        }
    }
});

router.post("/delete", async (ctx) => {
    let {
        id
    } = ctx.request.body;
    let creator = await getUserInfo(ctx, jstSecret, "propduct"); //获取token
    if (creator) {
        let user = await User.findOne({
            username: creator.username
        }).then((doc) => {
            return doc;
        })
        if (user.password == creator.password) {

            let result = await Product.findByIdAndDelete({
                _id: id,
            });

            if (result) {
                return (ctx.body = {
                    state: 200,
                    msg: "删除成功",
                });
            } else {
                return (ctx.body = {
                    state: 201,
                    msg: "操作失败",
                });
            }
        } else {
            return (ctx.body = {
                state: 201,
                msg: "无权限,请登录管理员账号",
            });
        }
    } else {
        return (ctx.body = {
            state: 201,
            msg: "请登录后重试！",
        });
    }
});

router.post('/edit', async (ctx, next) => {
    let {
        _id,
        name,
        text,
        seq,
        filepath
    } = ctx.request.body;
    let creator = await getUserInfo(ctx, jstSecret, "propduct"); //获取token
    if (creator) {
        let user = await User.findOne({
            username: creator.username
        }).then((doc) => {
            return doc;
        })
        if (user.password == creator.password) {

            let result = await Product.findByIdAndUpdate(_id, {
                name,
                text,
                seq,
                url: filepath
            }).then(d => {
                return d;
            })
            console.log(result)
            if (result) {
                return ctx.body = {
                    state: 200,
                    msg: '编辑成功',
                }
            } else {
                return ctx.body = {
                    state: 201,
                    msg: '编辑失败',
                }
            }
        } else {
            return (ctx.body = {
                state: 201,
                msg: "无权限,请登录管理员账号",
            });
        }
    } else {
        return (ctx.body = {
            state: 201,
            msg: "请登录后重试!",
        });
    }
});

module.exports = router