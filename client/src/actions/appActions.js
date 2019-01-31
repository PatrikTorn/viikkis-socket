import {createActionPointers, API_ENDPOINT} from '../tools/actionTools';
import axios from 'axios'
const ENDPOINT = 'http://localhost:5000';
export const types = createActionPointers([
    `SET_STATE`,
    'GET_ARTICLES',
    'UPDATE_ARTICLE',
    'CREATE_WEEK',
    'GET_ARTICLE',
    'DELETE_ARTICLE',
    'GET_SUMMARY',
    'LOGIN',
    'LOGOUT',
    'GET_TEXT',
    'GET_WEEK_ARTICLES'
]);

export const setState = (payload) => ({
    type:types.SET_STATE.NAME,
    payload
});

export const getArticles = () => ({
    type:types.GET_ARTICLES.NAME,
    payload:axios.get(`${API_ENDPOINT}/articles`)
});

export const getWeekArticles = ({year, week}) => ({
    type:types.GET_WEEK_ARTICLES.NAME,
    payload:axios.get(`${API_ENDPOINT}/articles?year=${year}&week=${week}`)
});

export const getArticle = (id) => ({
    type:types.GET_ARTICLE.NAME,
    payload:axios.get(`${API_ENDPOINT}/articles/${id}`)
});

export const getSummary = ({year, week}) => ({
    type:types.GET_SUMMARY.NAME,
    payload:axios.get(`${API_ENDPOINT}/articles?year=${year}&week=${week}`)
});

export const deleteArticle = (id) => ({
    type:types.DELETE_ARTICLE.NAME,
    payload:axios.delete(`${API_ENDPOINT}/articles/${id}`)
});

export const updateArticle = ({id, text}) => ({
    type:types.UPDATE_ARTICLE.NAME,
    payload:axios.put(`${API_ENDPOINT}/articles/${id}`, JSON.stringify({text}))
});

export const createWeek = (articles) => ({
    type:types.CREATE_WEEK.NAME,
    payload:axios.all(articles.map(async a => {
        const res = await axios.post(`${API_ENDPOINT}/articles`, JSON.stringify(a));
        return {...a, id:res.data, edited_at:'0000-00-00 00:00:00', created_at:new Date().toISOString()};
    }))
});

export const login = ({email, password}) => ({
    type:types.LOGIN.NAME,
    // payload:axios.post(`https://indecs.fi/viikkis/login.php`, JSON.stringify({email, password})),
    payload:async () => {
        if(email === 'hallitus@indecs.fi' && password === 'L3d1v4l0'){
            return {email, password}
        }else {
            throw new Error('wrong password');
        }
    }
})

export const logout = () => ({
    type:types.LOGOUT.NAME
});
