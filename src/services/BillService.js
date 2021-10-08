import apiRoutes from "../router/apiRoutes";
import {_axios} from "../plugins/axios";

export default {
    async addNewBill(accessToken, newBill) {
        return await _axios.post(apiRoutes.addBill, newBill, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    },

    async updatePaymentBill(accessToken, paymentData, billId) {
        return await _axios.post(apiRoutes.updatePayment(billId), paymentData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    },

}
