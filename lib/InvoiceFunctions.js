const shortid = require('shortid');

const getTotal = services => {
    var total = 0;
    for(var i = 0; i < services.length; i++) {
        total += services[i].price
    }
    return total;
}

const generateInvoice = async (name, services, paid, dueDate) => {
    return {
        invoiceNumber: shortid.generate(),
        name,
        services: services,
        total: getTotal(services),
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
    if(invoice.paid){
        throw 'Invoice has already been paid'
    }
}

module.exports = {generateInvoice, findInvoice, findAndReplaceInvoice, markPaid, isPaid}