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
    addBill: '/addBill',
    exportBillPdf: function (id, email) {
        return('/export/bill.pdf/' + id + '/' + email)
    },

    //User
    getAllUsers: '/getUserList',
    getCurrentUser: function (email) {
        return('/getCurrentUser/' + email)
    },
    getProfile: function (email) {
      return('/getProfile/' + email)
    },

    testUser: function (id) {
        return('/getUserTest/' + id)
    },
    addUser: '/addUser',
    updateUser: function (id) {
        return('/updateUser/' + id)
    },
    deleteUser: function (id) {
      return('/deleteUser/' +id)
    },

    //Bank
    addBank: '/addBank',
    updateBank: function (id) {
        return('/updateBank/' + id)
    },
    deleteBank: function (id) {
        return('/deleteBank/' + id)
    }


}