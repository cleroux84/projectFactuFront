import apiRoutes from "../router/apiRoutes";
import {_axios} from "../plugins/axios";


export default {
    async getCustomersList(accessToken) {
        let res = await _axios.get(apiRoutes.listCustomer, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.data
    },


    async addCustomer(accessToken, newCustomer) {
        return await _axios.post(apiRoutes.addCustomer, newCustomer, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    },

    async updateCustomer(accessToken, customerId, updatedCustomer) {
        return await _axios.post(apiRoutes.updateCustomer(customerId), updatedCustomer, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    },
}
