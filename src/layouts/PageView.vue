<template>
  <div>
    <!-- :style=" !$route.meta.hiddenHeaderContent ? 'margin: -24px -24px 0px;' :
    null " -->
    <!-- pageHeader , route meta :true on hide -->
    <!-- v-if="!$route.meta.hiddenHeaderContent" -->

    <page-header
      :title="pageTitle"
      :logo="logo"
      :avatar="avatar"
      :handle-date="handleDate"
    >
      <slot slot="headerAction" name="headerAction"></slot>
      <div v-if="!this.$slots.headerContent && description" slot="content">
        <p style="font-size: 14px; color: rgba(0, 0, 0, 0.65)">
          {{ description }}
        </p>
        <div class="link">
          <a v-for="(link, index) in linkList" :key="index" :href="link.href">
            <a-icon :type="link.icon" />
            <span>{{ link.title }}</span>
          </a>
        </div>
      </div>
    </page-header>
    <div class="content">
      <div class="page-view-index-wide">
        <slot> </slot>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";

export default {
  name: "PageView",

  components: {
    PageHeader,
  },
  props: {
    avatar: {
      type: String,
      default: null,
    },
    title: {
      type: [String, Boolean],
      default: true,
    },
    logo: {
      type: String,
      default: null,
    },
    directTabs: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageTitle: null,
      description: null,
      linkList: [],
      extraImage: "",
      search: false,
      tabs: {},
    };
  },
  methods: {
    handleDate(date) {
      this.$emit("handleDate", date);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin: 20px 20px 0;
  .link {
    margin-top: 16px;
    &:not(:empty) {
      margin-bottom: 16px;
    }
    a {
      margin-right: 32px;
      height: 24px;
      line-height: 24px;
      display: inline-block;
      i {
        font-size: 24px;
        margin-right: 8px;
        vertical-align: middle;
      }
      span {
        height: 24px;
        line-height: 24px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
.page-menu-search {
  text-align: center;
  margin-bottom: 16px;
}
.page-menu-tabs {
  margin-top: 48px;
}

.extra-img {
  margin-top: -60px;
  text-align: center;
  width: 195px;

  img {
    width: 100%;
  }
}

.mobile {
  .extra-img {
    margin-top: 0;
    text-align: center;
    width: 96px;

    img {
      width: 100%;
    }
  }
}
</style>
