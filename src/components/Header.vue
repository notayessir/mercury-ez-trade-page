<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const selected_key = ref(['trade']);
const logout_modal_status = ref(false);


const logout_event = () => {
  logout_modal_status.value = true;
};

const do_logout_event = e => {
  localStorage.removeItem('Authorization');
  logout_modal_status.value = false;
  router.push("/").then(() => {
    location.reload();
  });
};




</script>

<template>
    <a-layout-header>
      <!-- <div class="logo" /> -->
      <a-menu
        v-model:selectedKeys="selected_key"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
      <a-menu-item key="icon" :disabled="true">
        <a-avatar src="https://www.antdv.com/assets/logo.1ef800a8.svg" />
      </a-menu-item>
        <a-menu-item key="trade"><router-link to="/">交易</router-link></a-menu-item>
        <a-menu-item key="account"><router-link to="/account">账户</router-link></a-menu-item>
        <a-menu-item key="logout" @click="logout_event()">登出</a-menu-item>
      </a-menu>


      <a-modal v-model:open="logout_modal_status" title="登出提示" centered @ok="do_logout_event">
        <p>确定要退出吗？</p>
      </a-modal>

    </a-layout-header>
</template>


