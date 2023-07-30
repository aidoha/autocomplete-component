import { STATUS_CODES } from '../constants';

export async function makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			throw new Error(
				`Network response was not ok. ${STATUS_CODES[response.status as keyof typeof STATUS_CODES]}`
			);
		}

		return response.json();
	} catch (error) {
		throw new Error(`Failed to fetch data. ${error}`);
	}
}
