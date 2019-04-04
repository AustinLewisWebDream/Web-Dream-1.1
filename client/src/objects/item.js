export default class Item {
    constructor(name, price, description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }
    discountedTotal = () => { return this.amount }
    setTotal = (total) => { this.amount = Number(total) }
    total = () => { return this.amount }
    isDiscount = () => { return false }
}