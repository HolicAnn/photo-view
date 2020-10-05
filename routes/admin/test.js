const qiniu_sdk = require('qiniu')
const accessKey = 'hngh71R29yRS5QgFJYbm70Ssaao8gcF3jWv--npm';
const secretKey = 'EOjFL82mNt51W19xtWlIFkgZRDFIR7_1-x4IFbo1';
qiniu_sdk.conf.ACCESS_KEY = accessKey;
qiniu_sdk.conf.SECRET_KEY = secretKey;

const bucket = 'hahaha123123';// 要上传的空间
const prefix = 'girl/';// 文件前缀
const token = (bucket, key) => {// 生成上传文件的 token
    const policy = new qiniu_sdk.rs.PutPolicy({ isPrefixalScope: 1, scope: bucket + ':' + key });
    return policy.uploadToken();
}

const config = new qiniu_sdk.conf.Config();
const upload_file = (file_name, file_path) => {
    const file_save_path = prefix + file_name;// 保存到七牛的地址
    const up_token = token(bucket, file_save_path); // 七牛上传的token
    const extra = new qiniu_sdk.form_up.PutExtra();
    const formUploader = new qiniu_sdk.form_up.FormUploader(config);
    formUploader.putFile(up_token, file_save_path, file_path, extra, (err, ret) => { // 上传文件
        if (!err) {
            console.log('http://mini.sylvia.org.cn/' + ret.key);// 上传成功， 处理返回值
            return 1;
        } else {
            //console.error(err);// 上传失败， 处理返回代码
            return 0;
        }
    });
}

let x = upload_file('123456.jpg', '/Users/alan/Desktop/hah.jpg');
console.log(x);
