import { createActionPointers, API_ENDPOINT } from '../tools/actionTools';
import {getWeekArticles} from './appActions';
import moment from 'moment';

export const types = createActionPointers([
    `SET_CONFIG_STATE`,
    'NAVIGATE'
]);

export const setConfigState = (payload) => ({
    type: types.SET_CONFIG_STATE.NAME,
    payload
});

export const navigate = (screen) => ({
    type:types.NAVIGATE.NAME,
    payload:screen
});

export const setNextWeek = () => (dispatch, getState) => {
    const newDate = moment(getState().config.now).add(1, 'weeks');
    const week = parseInt(newDate.format('WW'));
    const year = parseInt(newDate.format('YYYY'));
    dispatch(setConfigState({
        now:newDate,
        week,
        year
    }));
    return dispatch(getWeekArticles({week, year}));
}


export const setPrevWeek = () => (dispatch, getState) => {
    const newDate = moment(getState().config.now).subtract(1, 'weeks');
    const week = parseInt(newDate.format('WW'));
    const year = parseInt(newDate.format('YYYY'));
    dispatch(setConfigState({
        now:newDate,
        week,
        year
    }));
    return dispatch(getWeekArticles({week, year}));
}