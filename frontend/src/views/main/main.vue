<template>
  <div class="main-wrapper">
    <main-header
      :height="'70px'"
      @openLoginDialog="onOpenLoginDialog"
      @openRegisterDialog="onOpenRegisterDialog"/>
      
    <div class="main-container">
      <aside class="sidebar hide-on-small" style="width: 240px;">
        <main-sidebar :width="'240px'"/>
      </aside>
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
    <main-footer :height="'110px'"/>
    <login-dialog
      :open="loginDialogOpen"
      @closeLoginDialog="onCloseLoginDialog"/>
    <register-dialog
      :open="registerDialogOpen"
      @closeRegisterDialog="onCloseRegisterDialog"/>  
  </div>
</template>

<style>
@import './main.css';
@import '../../common/css/common.css';

.main-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-container {
  display: flex;
  flex: 1;
}

.sidebar {
  display: flex;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.hide-on-small {
  display: none;
}

@media (min-width: 768px) {
  .hide-on-small {
    display: block;
  }
}
</style>

<script>
import LoginDialog from './components/login-dialog'
import MainHeader from './components/main-header'
import MainSidebar from './components/main-sidebar'
import MainFooter from './components/main-footer'
import RegisterDialog from './components/register-dialog'

export default {
  name: 'Main',
  components: {
    MainHeader,
    MainSidebar,
    MainFooter,
    LoginDialog,
    RegisterDialog,
  },
  data() {
    return {
      loginDialogOpen: false,
      registerDialogOpen: false
    }
  },
  methods: {
    // 로그인 다이얼로그열기기
    onOpenLoginDialog() {
      this.loginDialogOpen = true
    },
    // 로그인 다이얼로그 닫기기
    onCloseLoginDialog() {
      this.loginDialogOpen = false
    },
    // 회원가입 다이얼로그 열기
    onOpenRegisterDialog() {
      this.registerDialogOpen = true
    },
    // 회원가입 다이얼로그 닫기
    onCloseRegisterDialog() {
      this.registerDialogOpen = false
    }
  }
}
</script>
