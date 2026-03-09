<template>
  <div class="layout-container">
    <!-- 顶部导航 -->
    <header class="layout-header">
      <div class="header-content">
        <div class="logo" @click="router.push('/')">
          <span class="logo-icon"><LogoIcon /></span>
          <span class="logo-text">VTable</span>
        </div>
        <nav class="nav-menu">
          <router-link to="/api" class="nav-item" active-class="nav-item-active">
            API 文档
          </router-link>
          <router-link to="/examples" class="nav-item" active-class="nav-item-active">
            示例集合
          </router-link>
          <router-link to="/comprehensive" class="nav-item" active-class="nav-item-active">
            综合示例
          </router-link>

          <a
            href="https://github.com/aimerthyr/virtual-table"
            target="_blank"
            class="nav-item nav-item-external"
          >
            <GithubOutlined />
            GitHub
          </a>
        </nav>
      </div>
    </header>

    <!-- 内容区域 -->
    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { GithubOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'Layout' })

const router = useRouter()
</script>

<style scoped lang="less">
.layout-container {
  display: flex;
  background-color: #f0f2f5;
}

.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1392px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;

  .logo-icon {
    font-size: 24px;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }

  &-active {
    color: #1890ff;
    font-weight: 500;
  }

  &-external {
    color: rgba(0, 0, 0, 0.65);
  }
}

.layout-main {
  max-width: 1392px;
  margin: 80px auto 16px;
  width: 1392px;
}
</style>
