import apiRoutes from "../router/apiRoutes";
import {_axios} from "../plugins/axios";

export default {
    async addNewBank(accessToken, newBank) {
        return await _axios.post(apiRoutes.addBank, newBank, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    },

    async updateBank(accessToken, bankId, updatedBank) {
        return await _axios.post(apiRoutes.updateBank(bankId), updatedBank, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    },

    async deleteBank(accessToken, bankId) {
        return await _axios.delete(apiRoutes.deleteBank(bankId), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    },

}
