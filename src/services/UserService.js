import apiRoutes from "../router/apiRoutes";
import {_axios} from "../plugins/axios";


export default {
    async getCurrentUser(accessToken, email) {
        let res = await _axios.get(apiRoutes.getCurrentUser(email), {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.data
    },

    async getAllUsers(accessToken) {
        let res = await _axios.get(apiRoutes.getAllUsers, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.data
    },

    async addUser(accessToken, newUser) {
        return await _axios.post(apiRoutes.addUser, newUser, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}
