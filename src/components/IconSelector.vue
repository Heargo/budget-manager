<template>
    <div class="selector" >
        <img @click="openOption=!openOption" :src="require(`@/assets/icons/${selected}`)" alt="">
        <div v-if="openOption" class="options">
            <img v-for="i in icons" :key="i" :src="require(`@/assets/icons/${i}`)" :alt="i" @click="selected=i;openOption=false">
        </div>
    </div>
</template>
<script setup>
import { ref, watch, defineEmits } from 'vue';
var icons = ["biere.png","boulon.png","calendrier.png","chien.png","citrouille.png","cloche.png","dentifrice.png"]
var openOption = ref(false);
var selected = ref(icons[0]);
const emit = defineEmits(['selected'])

watch(selected, (currentValue, _oldValue) => {
    //emit event to parent component
    emit('selected', currentValue);
});

</script>
<style lang="scss">
    .selector{
        position:relative;
        width: 100%;
        max-width:3rem;
        height: 3rem;
        border-radius: 10px;
        margin:0.2rem 0;
        border:solid 1px $txt;
        img{
            cursor: pointer;
        }
    }
    .options{
        position: absolute;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        background-color: $bg2;
        width: 10.2rem;
        left:100%;
        z-index:2;
        border-radius: 10px;
        padding: 0.2rem;;
        img{
            width:3rem;
            margin:0.1rem;
            padding: 0.1rem;
            background-color: $bg;
            border-radius: 10px;
        }
    }
</style>