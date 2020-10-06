import axios from "axios";
axios.interceptors.request.use(
  config => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  function (res, reject) {
    if (res.data.state == 401) {
      window.location.href = "/#/login";
    } else {
      if (res.data.state == 200) {
        return res.data;
      } else {
        console.log(res.data)

        // Message.closeAll();
        // Message({
        //   showClose: true,
        //   duration: 3000,
        //   message: res.data.message,
        //   type: "error"
        // });
        reject(false);
      }
    }
  },
  function (err) {
    // Message.closeAll();
    // Message({
    //   showClose: true,
    //   duration: 3000,
    //   message: "网络出错！",
    //   type: "error"
    // });
    return false
  }
);
export default axios;