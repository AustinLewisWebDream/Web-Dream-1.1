import Item from './item';

class Discount extends Item {
    constructor(name, rate, amount) {
        super(name);
        this.rate = rate;
        this.amount = amount;
    }
    isDiscount = () => { return true }

    // For display purposes
    total = () => { return (-1 * this.amount * this.rate) };

    // Only change the total after discounts
    discountedTotal = () => { return (-1 * this.amount * this.rate) };
}

export default Discount