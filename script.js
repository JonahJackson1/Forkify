"use strict";

const country = {
  name: "United States",
  borderCountries: 2,
  printDescription: function () {
    const isIsland = () => {
      if (this.borderCountries != 0) {
        /*
        //Why is this.borderCountries undefinded
        this was undefined because the isIsland function's this was related to printDescription rather than country. 
        to fix it, used an arrow function as they do not receive the this keyword from their parent (printDesc) but from their parent's parent (country).
        //did this early because the lectures get boring and I wanted to see if I could figure it out.  
        */
        return false;
      } else {
        return true;
      }
    };

    console.log(`${this.name} is an island ${isIsland()}`);
  },
};

country.printDescription();


//prior to watching lesson 91 - works but not what you wanted
// const country = {
//   name: "United States",
//   borderCountries: 2,
//   isIsland: function () {
//     return this.borderCountries != 0 ? false : true;
//   },
//   printDescription: function () {
//     console.log(`${this.name} is an island ${this.isIsland()}`);
//   },
// };

// country.isIsland();
// country.printDescription();
