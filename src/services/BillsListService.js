import apiRoutes from "../router/apiRoutes";
import {_axios} from "../plugins/axios";

export default {
    async getBillsList(accessToken) {
        let res = await _axios.get(apiRoutes.listBill, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.data
    },

    async getBillsListByUser(accessToken, userId) {
        let res = await _axios.get(apiRoutes.listBillByUser(userId), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.data
    },

    async getUnpaidBillsList(accessToken) {
      let res = await _axios.get(apiRoutes.lateBill, {
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      });
      return res.data
    },

    async getUnpaidBillsListByUser(accessToken, userId) {
        let res = await _axios.get(apiRoutes.lateBillByUser(userId), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.data
    },

    async getBill(id) {
        let res = await _axios.get(apiRoutes.getThisBill(id));
        return res.data
    }
}
