const MONTHLY_DISCOUNT_RATE = 1;
const ANNUAL_DISCOUNT_RATE = .75;
const SEMI_ANNUAL_DISCOUNT_RATE = .85;


const getCycleDiscount = cycle => {
    switch(cycle) {
        case 'Annually': 
            return ANNUAL_DISCOUNT_RATE;
        case 'Monthly': 
            return MONTHLY_DISCOUNT_RATE;
        case 'Semi-Annually': 
            return SEMI_ANNUAL_DISCOUNT_RATE;
        default:
            return 1;
    }
       
}

const getNumMonths = cycle => {
    switch(cycle) {
        case 'Annually': 
            return 12;
        case 'Monthly': 
            return 1;
        case 'Semi-Annually': 
            return 6;
        default:
            return 1;
    }
       
}
module.exports = { getNumMonths, getCycleDiscount }