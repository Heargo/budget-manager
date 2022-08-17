<template>
    <div>
        <div class="menu">
            <div class="list" v-if="toggleMenu">
                <router-link class="link" to="/settings" @click="toggleMenu=false"><img src="@/assets/svg/settings-outline.svg" alt=""></router-link>
                <router-link class="link" to="/history" @click="toggleMenu=false"><img src="@/assets/svg/save-outline.svg" alt=""></router-link>
                <router-link class="link" to="/categories" @click="toggleMenu=false"><img src="@/assets/svg/stats-chart-outline.svg" alt=""></router-link>
                <router-link class="link" to="/" @click="toggleMenu=false"><img src="@/assets/svg/pie-chart-outline.svg" alt=""></router-link>
                <router-link class="link add" to="/add" @click="toggleMenu=false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </router-link>
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
    right: 1rem;
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
            &.add{
                background-color: $txt;
                svg{
                    stroke: $highlight;
                }
                &:hover{
                    svg{
                        stroke: $txt;
                    }
                }
            }
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
        background-color:$highlight;
        border-radius: 100%;
    }
}

</style>