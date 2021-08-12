export default {
    //Customer
    listCustomer: '/listCustomer',
    deleteCustomer: function (id) {
        return('/deleteCustomer/' + id)
    },
    addCustomer: '/addCustomer',
    updateCustomer: function (id) {
        return('/updateCustomer/' + id)
    },

    // Bill
    listBill: '/listBill',
    // deleteBill: function (id) {
    //     return('/deleteBill/'  + id)
    // },
    addBill: '/addBill',
    exportBillPdf: function (id) {
        return('/export/bill.pdf/' + id)
    },

    //User
    getAllUsers: '/getUserList',
    getCurrentUser: function (id) {
        return('/getCurrentUser/' + id)
    },

    testUser: function (id) {
        return('/getUserTest/' + id)
    },
    addUser: '/addUser'


}