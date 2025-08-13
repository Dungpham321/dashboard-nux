<template>
    <Head>
        <link id="dx-theme" rel="stylesheet" href="/themes/dx.light.css">
    </Head>
    <ThemeProvider>
        <SidebarProvider>
            <AdminLayout>
                <slot></slot>
            </AdminLayout>
        </SidebarProvider>
    </ThemeProvider>
</template>
<script setup lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import ThemeProvider from '../components/layout/ThemeProvider.vue';
import SidebarProvider from '../components/layout/SidebarProvider.vue';
import viMessages from 'devextreme/localization/messages/vi.json'
import { loadMessages, locale } from 'devextreme/localization'
loadMessages(viMessages)
locale('vi');
</script>