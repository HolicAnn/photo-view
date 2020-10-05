const router = require("koa-router")();
const Product = require("../../db/Product");

router.post("/add", async(ctx, next) => {
    let {
        title,
        desc,
        seq,
        parentId,
        background_color,
        thumb,
        url
    } = ctx.request.body;

    let product = new Product({
        title,
        desc,
        seq,
        parentId,
        background_color,
        thumb,
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
});

router.post("/edit", async(ctx, next) => {
    let {
        seq,
        url,
        name,
        memo
    } = ctx.request.body;
    await Product.findByIdAndUpdate(_id, {
        title,
        desc,
        seq,
        background_color,
        thumb,
        url
    }).then((res) => {
        console.log(res);
    });
    return (ctx.body = {
        state: 200,
        msg: "编辑成功",
    });
});

router.post("/del", async(ctx) => {
    let {
        id
    } = ctx.request.body;
    await Product.findByIdAndDelete(id);
    return (ctx.body = {
        state: 200,
        msg: "操作成功",
    });
});

router.get("/list", async(ctx) => {
    let {
        s = 0, n = 10,
            parentId
    } = ctx.request.query;
    if (parentId) {
        let result = await Product.find({
                parentId
            })
            .sort({
                seq: 1,
            })
            .skip(Number.parseInt(s))
            .limit(Number.parseInt(n))
            .then((doc) => {
                return doc;
            });
        return (ctx.body = {
            state: 200,
            data: result,
        });
    } else {
        return ctx.body = {
            state: 200,
            msg: "无效的parentid"
        }
    }

});

module.exports = router;