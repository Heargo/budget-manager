import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart 
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
    state: () => {
        return {
            count:0,
            savings:JSON.parse(localStorage.getItem('savingPerMonth')) || 0,
            spendings:JSON.parse(localStorage.getItem('spendings')) || [],
            categories:{
                party:{
                    icon:"biere.png",
                    color:"#ff8a8aad"
                },
                logement:{
                    icon:"calendrier.png",
                    color:"#8aff8aad"
                }
            }

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
            // if showSavings is true, add savings to the values array
            if(showSavings){
                x.push("savings");
                //value is the savings - total amount of spendings
                var savingsRemaining = this.savings - values.reduce((acc, cur) => acc + cur, 0);
                values.push(savingsRemaining);
                console.log(savingsRemaining);
                if(savingsRemaining < 0){
                    colors.push("red");
                }else{
                    colors.push("#F7F7F7");
                }
            }

            return{
                x:x,
                y:values,
                colors:colors
            }

        },


      },
})