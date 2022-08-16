import { defineStore } from 'pinia'


const DEFAULT_CATEGORIES = {
    party:{
        icon:"biere.png",
        color:"#ff8a8a"
    },
    logement:{
        icon:"calendrier.png",
        color:"#8aff8a"
    },
    savings:{
        icon:"boulon.png",
        color:"#f8f8f8"
    },
};

function initCategories(){
    var dico = JSON.parse(localStorage.getItem('categories')) || {};
    for (const [key, value] of Object.entries(DEFAULT_CATEGORIES)) {
        dico[key] = value;
    }

    return dico;
}

// useStore could be anything like useUser, useCart 
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
    state: () => {
        return {
            count:0,
            savings:JSON.parse(localStorage.getItem('savingPerMonth')) || null,
            spendings:JSON.parse(localStorage.getItem('spendings')) || [],
            categories:initCategories(),

        }
      },
      actions: {
        generateID(str){
            var hash = 0, i, chr;
            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
              chr   = str.charCodeAt(i);
              hash  = ((hash << 5) - hash) + chr;
              hash |= 0; // Convert to 32bit integer
            }
            return hash;
        },
        addSpending(data){
            this.spendings.push(data);
            //add id to the spending (id is the hash of name and date)
            data.id = this.generateID(data.name + data.date);
            //update local storage
            localStorage.setItem('spendings', JSON.stringify(this.spendings));
        },
        removeSpending(id){
            this.spendings = this.spendings.filter(spending => spending.id !== id);
            //update local storage
            localStorage.setItem('spendings', JSON.stringify(this.spendings));
        },
        getSpendingsByCategory(showSavings=true,month){
            //get all months categories
            var x = Object.keys(this.categories);

            //get all colors of categories
            var colors = x.map(key => this.categories[key].color);
            var values=[]
            for(var i=0;i<x.length;i++){
                //get total amount of spendings by category for the month
                var total = this.spendings.reduce((acc, spending) => {
                    if(spending.category === x[i] && spending.date.split("-")[1] == month){
                        return acc + spending.amount;
                    }
                    return acc;
                }
                ,0);
                values.push(total);
            }
            //if no savings for the month add one.
            if(values[x.indexOf("savings")]<=0 && showSavings){
                console.log("add monthly budget");
                this.addSpending({
                    name:"Default budget",
                    amount:this.savings,
                    date:new Date().toLocaleDateString("en-CA"),
                    category:"savings",
                });
                values[x.indexOf("savings")] = this.savings;
            }

            var spend=0;
            for (var i = 0; i < x.length; i++) {
                if(i!=x.indexOf("savings")){
                    spend+=values[i];
                }
            }
            values[x.indexOf("savings")] -= spend;
            var remaning=0;
            if(values[x.indexOf("savings")]<0){
                colors[x.indexOf("savings")]="#e63946";
                remaning=values[x.indexOf("savings")];
                values[x.indexOf("savings")] = 0;
            }else{
                remaning=values[x.indexOf("savings")];
            }

            
            

            return{
                x:x,
                y:values,
                colors:colors,
                remaning:remaning
            }

        },
        setSavings(savings){
            console.log("new savings: " + savings);
            this.savings = savings;
            localStorage.setItem('savingPerMonth', JSON.stringify(savings));
        },
        deleteCategory(category){
            if (confirm('Are you sure you want to delete the category <'+category+'>?')) {
                delete this.categories[category];
                //delete all spendings with this category
                this.spendings = this.spendings.filter(spending => spending.category !== category);
                //update local storage
                localStorage.setItem('spendings', JSON.stringify(this.spendings));
                localStorage.setItem('categories', JSON.stringify(this.categories));
            }
        },
        newCategory(name, color, icon){
            this.categories[name] = {
                color:color,
                icon:icon
            }
            localStorage.setItem('categories', JSON.stringify(this.categories));
        }


      },
})