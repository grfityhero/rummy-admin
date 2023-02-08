import axios from "axios";
import { addDays, addYears, endOfDay, startOfDay } from "date-fns";
import { getError, getQuery } from "../utils/commonUtils";
import { URLS, API_CONFIG, getUserId } from "./constant"


export function getSessionActions(roomId, date, status, callback, userId, limit, from, to) {
    const query = {}
    if (roomId) {
        query.roomId = roomId
    }
    if (status) {
        query.status = status
    }
    if (userId) {
        query.userId = userId
    }
    if (date) {
        query.start = startOfDay(date)
        query.end = endOfDay(date)
        // query.start = startOfDay(addDays(date, 0))
        // query.end = endOfDay(addDays(date, 1))
    } else {
        query.start = startOfDay(from)
        query.end = endOfDay(to)
    }
    const where = JSON.stringify(query)
    let url = `${URLS.API}/session?where=${where}`
    if (limit) {
        url = url + `&limit=${limit}`
    }
    axios.get(url, API_CONFIG)
        .then(function (response) {
            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}

export function getReportsActions(limit, skip, callback) {
    const query = {}
    query.status = "active"
    // if (date) {
    query.start = startOfDay(addYears(new Date(), -1))
    query.end = endOfDay(addYears(new Date(), 1))
    // }
    const where = JSON.stringify(query)
    let url = `${URLS.API}/session/reports?where=${where}`
    url = url + `&limit=${limit}`
    url = url + `&skip=${skip}`
    axios.get(url, API_CONFIG)
        .then(function (response) {
            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}


export function addSessionAction(params, callback) {
    axios.post(`${URLS.API}/session`, params, API_CONFIG)
        .then(function (response) {

            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}

export function editSessionAction(params, callback) {
    axios.patch(`${URLS.API}/session`, params, API_CONFIG)
        .then(function (response) {

            callback({ data: response.data.data })
        })
        .catch(function (error) {
            callback({ error: getError(error) })
        })
}
