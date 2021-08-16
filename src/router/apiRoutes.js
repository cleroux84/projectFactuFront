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
    listBillByUser: function (userId) {
        return('/listBillByUser/' +userId)
    },
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
    getCurrentUser: function (email) {
        return('/getCurrentUser/' + email)
    },

    testUser: function (id) {
        return('/getUserTest/' + id)
    },
    addUser: '/addUser'


}