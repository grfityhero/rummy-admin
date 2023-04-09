import axios from "axios";
import { getError } from "../utils/commonUtils";
import { URLS, API_CONFIG, getUserId } from "./constant"


export function getRoomActions(callback, status, limit, skip) {
    // const userId = getUserId()
    const query = {}
    // query.userId = userId
    if (status) {
        query.status = status
    }
    const where = JSON.stringify(query)
    let url = `${URLS.API}/room?where=${where}`

    if (limit) {
        url = url + "&limit=" + limit
    }
    if (skip) {
        url = url + "&skip=" + skip
    }

    axios.get(url, API_CONFIG)
        .then(function (response) {

            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}


export function addRoomAction(params, callback) {
    params.addedBy = getUserId()
    axios.post(`${URLS.API}/room`, params, API_CONFIG)
        .then(function (response) {

            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}


export function editRoomAction(params, callback) {
    axios.patch(`${URLS.API}/room/${params._id}`, params, API_CONFIG)
        .then(function (response) {

            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}




export function deleteRoomAction(params, callback) {
    axios.delete(`${URLS.API}/room/${params._id}`, API_CONFIG)
        .then(function (response) {

            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}