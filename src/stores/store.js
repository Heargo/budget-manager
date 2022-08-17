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
        color:"green"
    },
    "monthly budget":{
        icon:"boulon.png",
        color:"#e5e5e5"
    }
};
const MONTH_ORDER= ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];
// var MONTH_TO_INT = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12};
var INT_TO_MONTH = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};

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
            // savings:JSON.parse(localStorage.getItem('savings')) || null,
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
        getSpendingsByCategory(showSavings,month){
            //get all months categories
            var x = Object.keys(this.categories);
            //remove savings from x
            if(!showSavings){
                x = x.filter(category => category != "savings");
            }

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
            //if no monthly budget for the month add one.
            if(values[x.indexOf("monthly budget")]<=0 && this.getSavings()>0){
                console.log("add monthly budget");
                //calculate monthly budget for the remaining months (until june)
                var monthlyBudget = this.getSavings()/(11-(month-8)%12);
                this.addSpending({
                    name:"Default budget",
                    amount:monthlyBudget.toFixed(2),
                    date:new Date().toLocaleDateString("en-CA"),
                    category:"monthly budget",
                });
                values[x.indexOf("monthly budget")] = monthlyBudget.toFixed(2);
            }

            var spend=0;
            for (var i = 0; i < x.length; i++) {
                if(i!=x.indexOf("monthly budget")){
                    spend+=values[i];
                }
            }
            values[x.indexOf("monthly budget")] -= spend;
            var remaning=0;
            if(values[x.indexOf("monthly budget")]<0){
                colors[x.indexOf("monthly budget")]="#e63946";
                remaning=values[x.indexOf("monthly budget")];
                values[x.indexOf("monthly budget")] = 0;
            }else{
                remaning=values[x.indexOf("monthly budget")];
            }

            return{
                x:x,
                y:values,
                colors:colors,
                remaning:remaning.toFixed(2)
            }

        },
        getSavings(){
            //get all value in spendings with category savings
            var savings = this.spendings.reduce((acc, spending) => {
                if(spending.category === "savings"){
                    return acc + spending.amount;
                }
                return acc;
            },0);

            return savings;
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
        },
        getSavingsUntil(month){
            var savings = this.spendings.reduce((acc, spending) => {
                if(spending.category == "savings" && MONTH_ORDER.indexOf(INT_TO_MONTH[spending.date.split("-")[1]])<=MONTH_ORDER.indexOf(month)){
                    return acc + parseFloat(spending.amount);
                }
                return acc;
            },0);
            return savings;
        },
        getSpendingsUntil(month){
            console.log(month)

            var savings = this.spendings.reduce((acc, spending) => {
                if(spending.category != "savings" && MONTH_ORDER.indexOf(INT_TO_MONTH[parseInt(spending.date.split("-")[1])])<=MONTH_ORDER.indexOf(month)){
                    console.log(spending.name,parseFloat(spending.amount))
                    // console.log("spending month index" , MONTH_ORDER.indexOf(INT_TO_MONTH[parseInt(spending.date.split("-")[1])]))
                    // console.log("month index" , MONTH_ORDER.indexOf(month))
                    return acc + parseFloat(spending.amount);
                }
                return acc;
            },0);
            return savings;

            return spendings;
        },
        getSpendingsByMonth(category)
        {
            if(category == "savings"){
                var spendings = this.spendings.filter(spending => spending.category != category);
            }else{
                var spendings = this.spendings.filter(spending => spending.category === category);
            }
            var spendingsByMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
            for(var i=0;i<spendings.length;i++){
                var date = spendings[i].date.split("-");
                var month = parseInt(date[1]);                    
                spendingsByMonth[MONTH_ORDER.indexOf(INT_TO_MONTH[month])] += spendings[i].amount;
            }

            //case category is savings
            if(category == "savings"){
                MONTH_ORDER.forEach((month,index) => {
                    // console.log("month: "+month,"savings until him: "+this.getSavingsUntil(month),"spendings until him: "+this.getSpendingsUntil(month));
                    spendingsByMonth[index] = this.getSavingsUntil(month) - this.getSpendingsUntil(month);
                });
            }

            //array of months
            return {x:MONTH_ORDER,y:Object.values(spendingsByMonth),colors:this.categories[category].color};
        }


      },
})