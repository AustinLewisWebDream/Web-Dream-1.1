export default class Item {
    constructor(name) {
        this.name = name;
    }
    discountedTotal = () => { return this.amount }
    setTotal = (total) => { this.amount = Number(total) }
    total = () => { return this.amount }
    isDiscount = () => { return false }
}