const router = require('koa-router')()
const User = require("../../db/User");
const Product = require("../../db/Product");
const crypto = require("crypto");
const jwt = require("jwt-simple");
const uuid = require("uuid");
const getUserInfo = require("../../util/getUserInfo");
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

//新建上传
router.post("/upload", async (ctx, next) => {
    let {
        name,//名称
        memo,//描述
        seq,//序号,数字越大越靠前
        filepath//图片路径
    } = ctx.request.body;
    let creator = await getUserInfo(ctx, jstSecret, "propduct");//获取token
    if (creator) {
        let user = await User.findOne({
            username: creator.username
        }).then((doc) => {
            return doc;
        })
        if (user.password == creator.password) {
            const qiniu_sdk = require('qiniu')
            const accessKey = 'hngh71R29yRS5QgFJYbm70Ssaao8gcF3jWv--npm';
            const secretKey = 'EOjFL82mNt51W19xtWlIFkgZRDFIR7_1-x4IFbo1';
            const bucket = 'hahaha123123';// 要上传的空间
            const prefix = 'haha/';// 文件前缀
            qiniu_sdk.conf.ACCESS_KEY = accessKey;
            qiniu_sdk.conf.SECRET_KEY = secretKey;
            const token = (bucket, key) => {// 生成上传文件的 token
                const policy = new qiniu_sdk.rs.PutPolicy({ isPrefixalScope: 1, scope: bucket + ':' + key });
                return policy.uploadToken();
            }
            const config = new qiniu_sdk.conf.Config();
            //let file_name = 'qqqqah.jpg';//存储文件名称
            let file_name = uuid.v4() + '.jpg';//只能存储jpeg格式图片
            //let file_path = '/Users/alan/Desktop/xin.jpeg';//图片地址
            let file_path = filepath;
            const upload_file = (file_name, file_path) => {
                const file_save_path = prefix + file_name;// 保存到七牛的地址
                const up_token = token(bucket, file_save_path); // 七牛上传的token
                const extra = new qiniu_sdk.form_up.PutExtra();
                const formUploader = new qiniu_sdk.form_up.FormUploader(config);
                formUploader.putFile(up_token, file_save_path, file_path, extra, (err, ret) => { // 上传文件
                    if (!err) {
                        let url_ = 'http://mini.sylvia.org.cn/' + ret.key;
                        console.log(url_);// 上传成功， 处理返回值
                    } else {
                        console.error(err);// 上传失败， 处理返回代码
                    }
                })
            }

            upload_file(file_name, file_path);
            let url = 'http://mini.sylvia.org.cn/' + prefix + file_name;
            let product = await new Product({
                name,
                memo,
                seq,
                url
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
    let list = await Product.find({}).sort({ seq: -1 })
        .then((doc) => {
            return doc;
        })

    return (ctx.body = {
        state: 200,
        msg: "获取商品成功",
        list: list
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
    let { id } = ctx.request.body;
    let creator = await getUserInfo(ctx, jstSecret, "propduct");//获取token
    if (creator) {
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
});

router.post('/edit', async (ctx, next) => {
    let {
        id,
        name,
        memo,
        seq,
    } = ctx.request.body;
    let creator = await getUserInfo(ctx, jstSecret, "propduct");//获取token
    if (creator) {
        let result = await Product.findOneAndUpdate({
            _id: id,
        }, {
            name,
            memo,
            seq
        }).then(d => {
            return d;
        })
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
});

module.exports = router