<template>
    <div>
        <h1>Settings</h1>
        <form>
            <input type="number" step="0.01" placeholder="default Budget/month" v-model="budget">
            <div>
                <input type="color" class="categoryColor" v-model="categoryColor">
                <IconSelector @selected="setIcon"></IconSelector>
                <input type="text" placeholder="New category" v-model="categoryName">
            </div>
            <button @click="addCategory">Add category</button>
        </form>
        <div class="categoriesList">
            <div v-for="(c,name) in store.categories" :key="c" :style="{'background-color':c.color}">
                <img :src="require(`@/assets/icons/${c.icon}`)" alt="">
                <p :style="{'color':'white'}">{{name}}</p>
                <img class="delete" src="@/assets/svg/close-outline.svg" alt="delete" @click="store.deleteCategory(name)">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,watch } from 'vue';
import { useStore } from '@/stores/store.js';
import IconSelector from '@/components/IconSelector.vue';

const store = useStore();

var budget = ref(store.savings);
var categoryName = ref(null);
var categoryColor = ref("#000000");
var categoryIcon ="biere.png";

watch(budget, (currentValue, _oldValue) => {
    //save to store
    console.log("new budget: " + currentValue);
    store.setSavings(currentValue);
});

function setIcon(icon){
    categoryIcon = icon;
}
function addCategory(){
    if(categoryName.value==null || categoryIcon==null || categoryColor.value==null){
        alert("Please fill all fields");
        return;
    }
    store.newCategory(categoryName.value, categoryColor.value, categoryIcon);
    categoryName.value = null;
    categoryColor.value = "#000000";
    categoryIcon = "biere.png";
}


</script>
<style lang="scss">
    h1{
        text-align: center;
    }
    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        input,select{
            width: 90%;
            max-width:400px;
            height: 3rem;
            padding: 0.1rem 0.5rem;
            margin: 0.2rem 0;
            border-radius: 15px;
            outline:none;
            border:1px solid $txt;
            &[type="number"]{
               font-size: 2rem;
            }
        }
        button{
            width: 50%;
            max-width:150px;
            height: 2rem;
            padding: 0.1rem 0.5rem;
            margin: 0.2rem 0;
            border-radius: 15px;
            outline:none;
            border:1px solid $txt;
            background-color: $bg;
            color: $txt;
            font-size: 1.2rem;
            cursor: pointer;
        }
        div{
            width: 90%;
            max-width:400px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            input{
                max-width: calc(90% - 100px);
            }
        }
        .categoryColor{
            $radius:15px;
            width: 50px;
            height: 50px;
            background-color:transparent;
            padding: 0;
            border:none;
            outline:none;
            border-radius: $radius;
            &::-webkit-color-swatch {
                border: none;
                border-radius: $radius;
                padding: 0;
            }
            &::-webkit-color-swatch-wrapper {
                border: none;
                border-radius: $radius;
                padding: 0;
            }
        }
    }
    .categoriesList{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-bottom: 80px;
        div{
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 90%;
            max-width: 400px;
            padding: 0.2rem 0.5rem;
            margin: 0.2rem 0;
            border-radius: 15px;
            img{
                width: 3rem;
                height: 3rem;
                margin-right: 0.5rem;
            }
            p{
                font-size: 1.3rem;
                text-transform: capitalize;
                font-weight:500;
                mix-blend-mode:difference;
            }
            .delete{
                position: absolute;
                top: calc(50% - 0.75rem);
                right: 0;
                width: 1.5rem;
                height: 1.5rem;
                cursor: pointer;
                background-color: $bg;
                border-radius: 50%;
            }
        }
    }
</style>