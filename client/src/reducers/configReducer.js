import { types } from "../actions/configActions";
import moment from 'moment';
let initialState = {
    loading: false,
    year: parseInt(moment().format('YYYY')),
    week: parseInt(moment().format('WW')),
    now: moment().day("Wednesday").year(moment().format('YYYY')).week(moment().format('WW')),
    screen:null,
    articleId:null
};

const configReducer = (state = initialState, { payload, type }) => {

    switch (type) {
        case types.SET_CONFIG_STATE.NAME:
            return { ...state, ...payload }
        case types.NAVIGATE.NAME:
            return { ...state, screen:payload }
        default:
            return state
    }
}

export default configReducer;