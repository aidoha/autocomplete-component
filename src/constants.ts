export const API_URL = {
	searchCounties: (searchText: string) => `https://restcountries.com/v3.1/name/${searchText}`,
};

export const STATUS_CODES = {
	200: 'Ok',
	201: 'Created',
	400: 'Bad Request',
	401: 'Unauthorized',
	404: 'Not Found',
	500: 'Internal Server Error',
};
