import { types } from "../actions/appActions";
import { toast } from 'react-toastify';
let initialState = {
    loading: false,
    articles: [],
    rooms: {},
    summary: '',
    logged: false,
    user: {},
    text: ''
};

const appReducer = (state = initialState, { payload, type }) => {

    switch (type) {
        case types.SET_STATE.NAME:
            return { ...state, ...payload }

        case types.GET_ARTICLES.PENDING:
        case types.CREATE_WEEK.PENDING:
        case types.GET_ARTICLE.PENDING:
        case types.GET_SUMMARY.PENDING:
        case types.DELETE_ARTICLE.PENDING:
        case types.GET_WEEK_ARTICLES.PENDING:
        case types.LOGIN.PENDING:
            return { ...state, loading: true }

        case types.GET_ARTICLES.FULFILLED:
            return { ...state, loading: false, articles: payload.data }

        case types.GET_ARTICLES.REJECTED:
        case types.CREATE_WEEK.REJECTED:
        case types.DELETE_ARTICLE.REJECTED:
        case types.GET_ARTICLE.REJECTED:
        case types.GET_SUMMARY.REJECTED:
        case types.GET_WEEK_ARTICLES.REJECTED:
            toast.error('Ei internet yhteyttä palvelimeen')
            return { ...state, loading: false }

        case types.LOGIN.REJECTED:
            return { ...state, loading: false }

        case types.CREATE_WEEK.FULFILLED:
            return { ...state, articles: [...state.articles, ...payload], loading: false }

        case types.GET_ARTICLE.FULFILLED:
            return { ...state, articles: state.articles.map(a => a.id === payload.id ? payload : a), loading: false }

        case types.DELETE_ARTICLE.FULFILLED:
            return { ...state, articles: state.articles.reduce((acc, a) => a.id === payload.data ? acc : [...acc, a], []), loading: false }

        case types.GET_SUMMARY.FULFILLED:
            return {
                ...state, summary: payload.data
                    .sort((a, b) => a.position - b.position)
                    .reduce((acc, a) => acc + '\n \n' + a.text, ``),
                loading: false
            }

        case types.GET_WEEK_ARTICLES.FULFILLED:
            return { ...state, articles: payload.data, loading: false }

        case types.LOGIN.FULFILLED:
            return { ...state, user: payload, logged: true, loading: false }


        case types.LOGOUT.NAME:
            return { ...state, user: initialState.user, logged: false }

        default:
            return state;
    }
};

export default appReducer
