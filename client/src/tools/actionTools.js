export const createActionPointers = (types = []) => {
	let list = {};
	types.map(type => {
		return list[type] = {
			NAME: type,
			PENDING: `${type}_PENDING`,
			FULFILLED: `${type}_FULFILLED`,
			REJECTED: `${type}_REJECTED`,
		}
	});
	return list;
};
const PROD = true;
export const API_ENDPOINT = 'https://indecs.fi/viikkis/api.php';
export const SOCKET_ENDPOINT = PROD ? 'http://localhost:5000' : 'http://viikkis.herokuapp.com';

// https://indecs.fi/viikkis/socket/index.php:2021