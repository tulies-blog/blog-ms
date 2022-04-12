import BasicLayout from "../layouts/basic/index.vue";
import UserLayout from "../layouts/UserLayout.vue";
import BlankComponent from "@/components/BlankRouterComponent.vue";
export const constantRouterMap = [
  {
    path: "index",
    component: BlankComponent,
    name: "博文管理",
    icon: "el-icon-s-promotion",
    children: [
      {
        path: "article",
        component: () => import("../pages/blog-main/article/index.vue"),
        name: "文章管理",
      },
      {
        path: "category",
        component: () => import("../pages/blog-main/category/index.vue"),
        name: "分类管理",
      },
      {
        path: "tag",
        component: () => import("../pages/blog-main/tag/index.vue"),
        name: "标签管理",
      },
    ],
  },
  {
    path: "article",
    component: BlankComponent,
    name: "文章",
    icon: "el-icon-reading",
    hidden: true,
    children: [
      {
        path: "write",
        component: () => import("../pages/blog-main/article/write.vue"),
        name: "发表文章",
        meta: {
          activePath: "/index/article",
        },
      },
      {
        path: ":id/edit",
        component: () => import("../pages/blog-main/article/edit.vue"),
        name: "编辑文章",
        meta: {
          activePath: "/index/article",
        },
      },
    ],
  },
  {
    path: "resoure",
    component: BlankComponent,
    name: "素材管理",
    icon: "el-icon-picture",
    children: [
      {
        path: "imgs",
        component: () => import("../pages/resource/imgs/index.vue"),
        name: "图片管理",
      },
    ],
  },
  {
    path: "comment",
    component: BlankComponent,
    name: "评论管理",
    icon: "el-icon-s-comment",
    children: [
      {
        path: "topic",
        component: () => import("../pages/comment/topic/index.vue"),
        name: "评论主题",
      },
      {
        path: "reply",
        component: () => import("../pages/comment/reply/index.vue"),
        name: "评论列表",
      },
      // {
      //   path: 'jubao',
      //   component: ArticlePage,
      //   name: '举报管理'
      // },
      // {
      //   path: 'zan',
      //   component: ArticlePage,
      //   name: '点赞管理'
      // }
    ],
  },
  {
    path: "usermg",
    component: BlankComponent,
    name: "用户管理",
    icon: "el-icon-user-solid",
    children: [
      {
        path: "account",
        component: () => import("../pages/usermg/index.vue"),
        name: "账号管理",
      },
    ],
  },
  {
    path: "exception",
    component: BlankComponent,
    name: "系统异常",
    hidden: true,
    children: [
      {
        path: "403",
        component: () => import("../pages/exception/403.vue"),
        name: "403",
      },
      {
        path: "404",
        component: () => import("../pages/exception/404.vue"),
        name: "404",
      },
      {
        path: "500",
        component: () => import("../pages/exception/500.vue"),
        name: "500",
      },
    ],
  },
];

export default [
  {
    path: "/",
    component: BasicLayout,
    redirect: "/index/article",
    children: constantRouterMap,
  },
  {
    // path: '/app/:id',
    // props: (route) => ({ id: route.query.p }),
    path: "/index",
    component: BasicLayout,
    // component: () => import('../views/todo/todo.vue'), // 异步载入组件，需要安装插件支持，npm i babel-plugin-syntax-dynamic-import； 另外在.babelrc中要把插件加进去
    // component: () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
    // components: {
    //   default: xxxx,
    //   a: Todo,
    // },
    name: "index",
    meta: {
      // 通过.meta拿到
      title: "this is app",
      description: "asass",
    },
    beforeEnter(to, from, next) {
      // console.log('app route before enter')
      next();
    },
    // children:[] // 配置子路由用
  },
  {
    path: "/user",
    component: UserLayout,
    redirect: "/user/login",
    hidden: true,
    children: [
      {
        path: "login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/pages/user/login"),
      },
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import(/* webpackChunkName: "user" */ '@/pages/user/register')
      // },
      // {
      //   path: 'register-result',
      //   name: 'registerResult',
      //   component: () => import(/* webpackChunkName: "user" */ '@/pages/user/registerResult')
      // }
    ],
  },
];
