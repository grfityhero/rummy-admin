import axios from "axios";
import { getError } from "../utils/commonUtils";
import { URLS, API_CONFIG, getUserId } from "./constant"


export function getSubscriptionsActions(id, callback) {
    const query = {}
    query.userId = id
    query.status = "active"
    const where = JSON.stringify(query)
    axios.get(`${URLS.API}/subscription?where=${where}`, API_CONFIG)
        .then(function (response) {
            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}


export function addSubscriptionAction(params, callback) {
    params.addedBy = getUserId()
    axios.post(`${URLS.API}/subscription`, params, API_CONFIG)
        .then(function (response) {
            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}


export function editSubscriptionAction(params, callback) {
    axios.patch(`${URLS.API}/subscription`, params, API_CONFIG)
        .then(function (response) {
            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}


export function deleteSubscriptionAction(id, userId, from, callback) {
    axios.delete(`${URLS.API}/subscription/${id}?userId=${userId}&from=${from}`, API_CONFIG)
        .then(function (response) {
            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}
