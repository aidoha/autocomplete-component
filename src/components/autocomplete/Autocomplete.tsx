import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { findCountries } from '../../services/countries';
import { Country } from '../../types/country';
import Loader from '../loader/Loader';
import * as strings from './strings';
import './Autocomplete.css';

const Autocomplete: React.FC = () => {
	const [searchText, setSearchText] = useState<string>('');
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
	const [suggestions, setSuggestions] = useState<Country[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const listRef = useRef<HTMLUListElement | null>(null);
	const controller = useRef(new AbortController());
	const request = useRef<Promise<Country[]> | null>();

	const onChangeRegular = useCallback(async (searchText: string) => {
		setIsLoading(true);
		setError('');

		if (!searchText) {
			setSuggestions([]);
			setShowSuggestions(true);
			setIsLoading(false);
			return;
		}

		if (request.current) {
			controller.current.abort();
			controller.current = new AbortController();
		}

		try {
			request.current = findCountries(searchText, {
				signal: controller.current.signal,
			});
			setSuggestions(await request.current);
			setShowSuggestions(true);
		} catch (error) {
			setError(error.message);
		}

		setIsLoading(false);
		request.current = null;
	}, []);

	const onChangeDebounced = useDebounce(onChangeRegular, 500);

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const searchText = event.target.value.trim();
			if (searchText) {
				setShowSuggestions(true);
			}
			setSearchText(searchText);
			setSuggestions([]);
			onChangeDebounced(searchText);
		},
		[onChangeDebounced]
	);

	const selectItem = (item: string) => {
		setSearchText(item);
		setShowSuggestions(false);
	};

	const highlightMatch = (text: string, searchTerm: string) => {
		const regex = new RegExp(`(${searchTerm})`, 'gi');
		return text.replace(regex, '<span class="autocomplete__highlight">$1</span>');
	};

	return (
		<div className="autocomplete">
			<label className="autocomplete__label">
				<input
					className="autocomplete__input"
					type="text"
					value={searchText}
					onChange={onChange}
					placeholder="Please type country"
				/>
			</label>

			{isLoading && <Loader />}
			{error && <div className="autocomplete__error">{error}</div>}
			{!error && !isLoading && suggestions.length === 0 && showSuggestions && (
				<div className="autocomplete__no-suggestions">{strings.NO_SUGGESTIONS_FOUND}</div>
			)}
			{!error && !isLoading && suggestions.length > 0 && showSuggestions && (
				<ul className="autocomplete__list" ref={listRef}>
					{suggestions.map(({ name: { common }, flag }) => (
						<li key={common} className="autocomplete__item" onClick={() => selectItem(common)}>
							<span className="autocomplete__country-flag">{flag}</span>
							<span
								className="autocomplete__country-name"
								dangerouslySetInnerHTML={{
									__html: highlightMatch(common, searchText),
								}}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Autocomplete;
