import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { resolve } from 'path'
import { request } from 'https'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: resolve => require(['@/views/login/index'], resolve),
    hidden: true
  },
  {
    path: '*',
    name: '404',
    component: resolve => require(['@/views/error-page/404'], resolve),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/index/index'], resolve),
        name: 'index',
        meta: { title: 'index', icon: 'user', noCache: true }
      }
    ]
  },
  // {
  //   path: '/operations',
  //   component: Layout,
  //   redirect: '/operations/contentMGT',
  //   name: 'operations',
  //   meta: {
  //     title: 'operations',
  //     icon: 'operations',
  //   },
  //   children: [
  //     {
  //       path: 'contentMGT',
  //       component: resolve => require(['@/views/operations/contentMGT'], resolve),
  //       name: 'contentMGT',
  //       meta: { title: 'contentMGT', icon: 'documentation', noCache: true }
  //     },
  //     {
  //       path: 'Topnews',
  //       component: resolve => require(['@/views/operations/Topnews'], resolve),
  //       name: 'Topnews',
  //       meta: { title: 'Topnews', icon: 'form', noCache: true }
  //     },
  //     {
  //       path: 'pushNotification',
  //       component: () => import('@/views/operations/pushNotification'),
  //       name: 'pushNotification',
  //       meta: { title: 'pushNotification', icon: 'documentation' }
  //     },
  //     {
  //       path: 'feedback',
  //       component: resolve => require(['@/views/operations/feedback'], resolve),
  //       name: 'feedback',
  //       meta: { title: 'feedback', icon: 'feedback', noCache: true }
  //     },
  //     {
  //       path: 'Contentrating',
  //       component: resolve => require(['@/views/operations/Contentrating'], resolve),
  //       name: 'Contentrating',
  //       meta: { title: 'Contentrating', icon: 'class', noCache: true }
  //     },
  //     {
  //       path: 'Grabsource',
  //       component: resolve => require(['@/views/operations/Grabsource'], resolve),
  //       name: 'Grabsource',
  //       meta: { title: 'Grabsource', icon: 'Grabsource', noCache: true }
  //     },
  //   ]
  // },
  // {
  //   path: '/Statistic',
  //   component: Layout,
  //   redirect: '/Statistic/Noonaforms',
  //   name: 'Statistic',
  //   meta: {
  //     title: 'Statistic',
  //     icon: 'documentation',
  //   },
  //   children: [
  //     {
  //       path: 'Noonaforms',
  //       component: resolve => require(['@/views/Statistic/Noonaforms'], resolve),
  //       name: 'Noonaforms',
  //       meta: { title: 'Noonaforms', icon: 'documentation', noCache: true }
  //     },
  //     {
  //       path: 'Operatingstatistics',
  //       component: resolve => require(['@/views/Statistic/Operatingstatistics'], resolve),
  //       name: 'Operatingstatistics',
  //       meta: { title: 'Operatingstatistics', icon: 'form', noCache: true }
  //     },
  //     {
  //       path: 'Noonahot',
  //       component: () => import('@/views/Statistic/Noonahot'),
  //       name: 'Noonahot',
  //       meta: { title: 'Noonahot', icon: 'documentation' }
  //     }
  //   ]
  // },
  // {
  //   path: '/originalInformation',
  //   component: Layout,
  //   redirect: '/originalInformation/Newusers',
  //   name: 'originalInformation',
  //   meta: {
  //     title: 'originalInformation',
  //     icon: 'statistical-statement',
  //   },
  //   children: [
  //     {
  //       path: 'Newusers',
  //       component: resolve => require(['@/views/originalInformation/Newusers'], resolve),
  //       name: 'Newusers',
  //       meta: { title: 'Newusers', icon: 'user', noCache: true }
  //     },
  //     {
  //       path: 'Release',
  //       component: resolve => require(['@/views/originalInformation/Release'], resolve),
  //       name: 'Release',
  //       meta: { title: 'Release', icon: 'form', noCache: true }
  //     },
  //     {
  //       path: 'video',
  //       component: () => import('@/views/originalInformation/video'),
  //       name: 'video',
  //       meta: { title: 'video', icon: 'video' }
  //     },
  //     {
  //       path: 'informationList',
  //       component: () => import('@/views/originalInformation/informationList'),
  //       name: 'informationList',
  //       meta: { title: 'informationList', icon: 'documentation' }
  //     },
  //     {
  //       path: 'category',
  //       component: () => import('@/views/originalInformation/category'),
  //       name: 'category',
  //       meta: { title: 'category', icon: 'class' }
  //     }
  //   ]
  // },
  {
    path: '/couponManagement',
    component: Layout,
    redirect: '/couponManagement/productList',
    name: 'couponManagement',
    meta: {
      title: 'couponManagement',
      icon: 'documentation'
    },
    children: [
      {
        path: 'productList',
        component: resolve => require(['@/views/couponManagement/productList'], resolve),
        name: 'productList',
        meta: { title: 'productList', icon: 'form' }
      },
      {
        path: 'goodsSorting',
        component: resolve => require(['@/views/couponManagement/goodsSorting'], resolve),
        name: 'goodsSorting',
        meta: { title: 'goodsSorting', icon: 'form' }
      },
      {
        path: 'grantRules',
        component: resolve => require(['@/views/couponManagement/grantRules'], resolve),
        name: 'grantRules',
        meta: { title: 'grantRules', icon: 'rules' }
      },
      {
        path: 'operations',
        component: resolve => require(['@/views/couponManagement/operations'], resolve),
        name: 'operations',
        meta: { title: 'operations', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/oneDollar',
    component: Layout,
    redirect: '/oneDollar/productList',
    name: 'oneDollar',
    meta: {
      title: 'oneDollar',
      icon: 'oneDollar'
    },
    children: [
      {
        path: 'productList',
        component: resolve => require(['@/views/couponManagement/productList'], resolve),
        name: 'productList',
        meta: { title: 'productList', icon: 'form' }
      },
      {
        path: 'goodsSorting',
        component: resolve => require(['@/views/couponManagement/goodsSorting'], resolve),
        name: 'goodsSorting',
        meta: { title: 'goodsSorting', icon: 'form' }
      },
      {
        path: 'indianaRules',
        component: resolve => require(['@/views/couponManagement/indianaRules'], resolve),
        name: 'indianaRules',
        meta: { title: 'indianaRules', icon: 'rules' }
      },
      {
        path: 'orderManagement',
        component: resolve => require(['@/views/couponManagement/orderManagement'], resolve),
        name: 'orderManagement',
        meta: { title: 'orderManagement', icon: 'form' }
      },
      {
        path: 'operations',
        component: resolve => require(['@/views/couponManagement/operations'], resolve),
        name: 'operations',
        meta: { title: 'operations', icon: 'peoples' }
      },
      {
        path: 'NBABet',
        component: resolve => require(['@/views/couponManagement/NBABet'], resolve),
        name: 'NBABet',
        meta: { title: 'NBABet', icon: 'NBAbet' }
      }
    ]
  },
  // {
  //   path: '/ABtest',
  //   component: Layout,
  //   redirect: '/ABtest',
  //   name: 'ABtest',
  //   meta: {
  //     title: 'ABtest',
  //     icon: 'dashboard',
  //   },
  //   children: [
  //     {
  //       path: 'ABtest',
  //       component: resolve => require(['@/views/ABtest'], resolve),
  //       name: 'ABtest',
  //       meta: { title: 'ABtest', icon: 'dashboard', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/AdministratorSettings',
  //   component: Layout,
  //   redirect: '/AdministratorSettings/AdministratorList',
  //   name: 'AdministratorSettings',
  //   meta: {
  //     title: 'AdministratorSettings',
  //     icon: 'setting',
  //   },
  //   children: [
  //     {
  //       path: 'AdministratorList',
  //       component: resolve => require(['@/views/AdministratorList'], resolve),
  //       name: 'AdministratorList',
  //       meta: { title: 'AdministratorList', icon: 'form', noCache: true }
  //     },
  //     {
  //       path: 'RoleMGT',
  //       component: resolve => require(['@/views/AdministratorList/RoleMGT'], resolve),
  //       name: 'RoleMGT',
  //       meta: { title: 'RoleMGT', icon: 'user', noCache: true }
  //     },
  //     {
  //       path: 'AuthorityMGT',
  //       component: resolve => require(['@/views/AdministratorList/AuthorityMGT'], resolve),
  //       name: 'AuthorityMGT',
  //       meta: { title: 'AuthorityMGT', icon: 'class', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/RobotMGT',
    component: Layout,
    redirect: '/RobotMGT/regularRobot',
    name: 'RobotMGT',
    meta: {
      title: 'RobotMGT',
      icon: 'Robot',
    },
    children: [
      {
        path: 'regularRobot',
        component: resolve => require(['@/views/RobotMGT/regularRobot'], resolve),
        name: 'regularRobot',
        meta: { title: 'regularRobot', icon: 'Robot', noCache: true }
      }
    ]
  },
  {
    path: '/Financial',
    component: Layout,
    redirect: '/Financial/Application',
    name: 'Financial',
    meta: {
      title: 'Financial',
      icon: 'money',
    },
    children: [
      {
        path: 'Application',
        component: resolve => require(['@/views/Financial/Application'], resolve),
        name: 'Application',
        meta: { title: 'Application', icon: 'withdraw', noCache: true }
      },
      {
        path: 'userRecharge',
        component: resolve => require(['@/views/Financial/userRecharge'], resolve),
        name: 'userRecharge',
        meta: { title: 'userRecharge', icon: 'wallet', noCache: true }
      }
    ]
  }
  // 后续路由添加
  // {
  //   path: '/profile',
  //   component: Layout,
  //   name: 'name',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'name',
  //       meta: { title: 'name', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465

export default router
