const shortid = require('shortid');

const getTotal = services => {
    var total = 0;
    for(var i = 0; i < services.length; i++) {
        if(services[i].price > 0) {
            total += services[i].price;
        }
    }
    return total;
}

const getDiscounts = services => {
    var total = 0;
    for(var i = 0; i < services.length; i++) {
        if(services[i].price < 0) {
            total += services[i].price;
        }
    }
    return total;
}

const generateInvoice = async (items, paid, dueDate) => {
    const subTotal = getTotal(items);
    const discount = getDiscounts(items);
    const total = subTotal - discount;
    return {
        invoiceNumber: shortid.generate(),
        services: items,
        subTotal,
        discount,
        total,
        paid,
        dueDate,
    }
}

const findInvoice = async (invoiceList, id) => {
    for(var i = 0; i < invoiceList.length; i++) {
        console.log(invoiceList[i].invoiceNumber)
        console.log('INVOICE ID TO FIND', id)
        if(invoiceList[i].invoiceNumber == id) {
            return invoiceList[i];
        }
    }
}

const markPaid = async (invoice) => {
    const newInvoice = invoice;
    newInvoice.paid = true;
    return newInvoice;
}

const findAndReplaceInvoice = async (invoiceList, invoiceToReplace, newInvoice) => {
    var newInvoiceList = invoiceList;
    for(var i = 0; i < invoiceList.length; i++) {
        for(var i = 0; i < invoiceList.length; i++) {
            if(invoiceList[i].id == invoiceToReplace.id) {
                newInvoiceList[i] == newInvoice;
                return newInvoiceList;
            }
        }
    }
}

const isPaid = invoice => {
    return invoice.paid
}

module.exports = {generateInvoice, findInvoice, findAndReplaceInvoice, markPaid, isPaid}