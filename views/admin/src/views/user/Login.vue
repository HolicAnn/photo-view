<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin">
      <a-alert
        v-if="isLoginError"
        type="error"
        showIcon
        style="margin-bottom: 24px;"
        message="账户或密码错误（admin/ant.design )"
      />
      <a-form-item>
        <a-input v-model="form.username" size="large" type="text">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input size="large" v-model="form.password" name="password" type="password" autocomplete="false">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item style="margin-top:24px">
        <a-button size="large" type="primary" @click="submit" class="login-button" :loading="loading">确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
// import { getSmsCaptcha, get2step } from '@/api/login'

export default {
  data() {
    return {
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loading: false,
      isLoginError: false,
      form: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    submit(e) {
      this.$http.post('/admin/user/login', this.form).then(res => {
        if (res) {
          this.$router.push({ path: '/product' })
        }
      })

      console.log(this.form)
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
