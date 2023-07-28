import { API_URL } from '../constants';
import { Country } from '../types/country';
import { makeRequest } from '../utils/makeRequest';

export const findCountries = async (
	searchText: string,
	options: RequestInit = {}
): Promise<Country[]> => {
	const url = API_URL.searchCounties(searchText);
	return await makeRequest<Country[]>(url, options);
};
