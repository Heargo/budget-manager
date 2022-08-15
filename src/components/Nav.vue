<template>
    <div v-if="this.$router.currentRoute.value.name!='Add'">
        <div class="menu">
            <div class="list" v-if="toggleMenu">
                <router-link class="link" to="/settings"><img src="@/assets/svg/settings-outline.svg" alt=""></router-link>
                <router-link class="link" to="/categories"><img src="@/assets/svg/stats-chart-outline.svg" alt=""></router-link>
                <router-link class="link" to="/"><img src="@/assets/svg/pie-chart-outline.svg" alt=""></router-link>
                <router-link class="link" to="/save"><img src="@/assets/svg/save-outline.svg" alt=""></router-link>
            </div>
            <!-- close menu -->
            <img @click="toggleMenu=!toggleMenu" v-if="toggleMenu" class="menuToggle" src="@/assets/svg/close-outline.svg" alt=""> 
            <!-- open menu -->
            <img @click="toggleMenu=!toggleMenu" v-if="!toggleMenu" class="menuToggle" src="@/assets/svg/menu-outline.svg" alt="">
        </div>
    </div>
</template>
<script setup>
import {ref } from 'vue';
var toggleMenu =ref(false);
</script>
<style lang="scss" scoped>
$size:40px;
.menu{
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    .list{
        display: flex;
        flex-direction: column;
        .link{
            width: $size;
            height: $size;
            padding: 0.5rem;
            border-radius: 100%;
            margin:0.2rem 0;
            background-color: $bg2;
            &:hover{
                background-color: $highlight;
            }
            transition: all 0.3s ease-in-out;
            img{
                width: $size;
                height: $size;
            }
        }
    }
    .menuToggle{
        width: $size;
        height: $size;
        padding: 0.5rem;
    }
}

</style>