<template>
  <aside :class="[
    'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
    {
      'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
      'lg:w-[90px]': !isExpanded && !isHovered,
      'translate-x-0 w-[290px]': isMobileOpen,
      '-translate-x-full': !isMobileOpen,
      'lg:translate-x-0': true,
    },
  ]" @mouseenter="!isExpanded && (isHovered = true)" @mouseleave="isHovered = false">
    <div :class="[
      'py-8 flex',
      !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
    ]">
      <router-link to="/">
        <img v-if="isExpanded || isHovered || isMobileOpen" class="dark:hidden" src="/images/logo/logo.svg" alt="Logo"
          width="150" height="40" />
        <img v-if="isExpanded || isHovered || isMobileOpen" class="hidden dark:block" src="/images/logo/logo-dark.svg"
          alt="Logo" width="150" height="40" />
        <img v-else src="/images/logo/logo-icon.svg" alt="Logo" width="32" height="32" />
      </router-link>
    </div>
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <!-- <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex"> -->
          <h2
            :class="['mb-4 text-xs uppercase flex leading-[20px] text-gray-400', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',]">
            <template v-if="isExpanded || isHovered || isMobileOpen">
              Menu quản trị
            </template>
            <HorizontalDots v-else />
          </h2>
          <ul class="flex flex-col gap-4">
            <li v-for="(item, index) in menuGroups" :key="item.NAME">
              <button v-if="item.subItems" @click="toggleSubmenu(0, index)" :class="[
                'menu-item group w-full',
                {
                  'menu-item-active': isSubmenuOpen(0, index),
                  'menu-item-inactive': !isSubmenuOpen(0, index),
                },
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'lg:justify-start',
              ]">
                <span :class="[
                  isSubmenuOpen(0, index)
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <DynamicIcon :name="item.ICON" prefix="fas" />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.NAME }}</span>
                <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen" :class="[
                  'ml-auto w-5 h-5 transition-transform duration-200',
                  {
                    'rotate-180 text-brand-500': isSubmenuOpen(
                      0,
                      index
                    ),
                  },
                ]" />
              </button>
              <router-link v-else-if="item.HREF" :to="item.HREF" :class="[
                'menu-item group',
                {
                  'menu-item-active': isActive(item.HREF),
                  'menu-item-inactive': !isActive(item.HREF),
                },
              ]">
                <span :class="[
                  isActive(item.HREF)
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive',
                ]">
                  <!-- <component :is="item.ICON" /> -->
                  <!-- <font-awesome-icon :icon="['fab', 'faAngellist']" size="2x" /> -->
                  <DynamicIcon :name="item.ICON" prefix="fas" />
                </span>
                <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.NAME }}</span>
              </router-link>
              <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition"
                @after-leave="endTransition">
                <div v-show="isSubmenuOpen(0, index) &&
                  (isExpanded || isHovered || isMobileOpen)
                  ">
                  <ul class="mt-2 space-y-1 ml-9">
                    <li v-for="subItem in item.subItems" :key="subItem.NAME">
                      <router-link v-if="subItem.HREF" :to="subItem.HREF" :class="[
                        'menu-dropdown-item',
                        {
                          'menu-dropdown-item-active': isActive(subItem.HREF),
                          'menu-dropdown-item-inactive': !isActive(subItem.HREF),
                        },
                      ]">
                        {{ subItem.NAME }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </transition>
            </li>
          </ul>
        </div>
        <!-- </div> -->
      </nav>
    </div>
  </aside>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
} from "../../icons";
import DynamicIcon from "../Icons/DynamicIcon.vue";
import { useSidebar } from "@/composables/useSidebar";
import { GetData } from "@/composables/GlobalService";
const route = useRoute();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const menuGroups = ref([]);
onMounted(async () => {
  const response = await GetData("Dashboard/List", {});
  menuGroups.value = response.Data;
});
// const menuGroups = [
//   {
//     title: "Menu",
//     items: [
//       {
//         icon: GridIcon,
//         name: "Dashboard",
//         subItems: [{ name: "Ecommerce", path: "/", pro: false }],
//       },
//       {
//         icon: CalenderIcon,
//         name: "Calendar",
//         path: "/calendar",
//       },
//       {
//         icon: UserCircleIcon,
//         name: "User Profile",
//         path: "/profile",
//       },

//       {
//         name: "Forms",
//         icon: ListIcon,
//         subItems: [
//           { name: "Form Elements", path: "/form-elements", pro: false },
//         ],
//       },
//       {
//         name: "Tables",
//         icon: TableIcon,
//         subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
//       },
//       {
//         name: "Pages",
//         icon: PageIcon,
//         subItems: [
//           { name: "Black Page", path: "/blank", pro: false },
//           { name: "404 Page", path: "/error-404", pro: false },
//         ],
//       },
//     ],
//   },
//   {
//     title: "Others",
//     items: [
//       {
//         icon: PieChartIcon,
//         name: "Charts",
//         subItems: [
//           { name: "Line Chart", path: "/line-chart", pro: false },
//           { name: "Bar Chart", path: "/bar-chart", pro: false },
//         ],
//       },
//       {
//         icon: BoxCubeIcon,
//         name: "Ui Elements",
//         subItems: [
//           { name: "Alerts", path: "/alerts", pro: false },
//           { name: "Avatars", path: "/avatars", pro: false },
//           { name: "Badge", path: "/badge", pro: false },
//           { name: "Buttons", path: "/buttons", pro: false },
//           { name: "Images", path: "/images", pro: false },
//           { name: "Videos", path: "/videos", pro: false },
//         ],
//       },
//       {
//         icon: PlugInIcon,
//         name: "Authentication",
//         subItems: [
//           { name: "Signin", path: "/signin", pro: false },
//           { name: "Signup", path: "/signup", pro: false },
//         ],
//       },
//       // ... Add other menu items here
//     ],
//   },
// ];
const isActive = (path) => route.path === path;
const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};
const isAnySubmenuRouteActive = computed(() => {

  return menuGroups.value.some((group) =>
    group.subItems && group.subItems.some((subItem) => isActive(subItem.path))
  );
});
const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};
const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
