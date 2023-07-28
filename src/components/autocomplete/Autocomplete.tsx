import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { findCountries } from '../../services/countries';
import { Country } from '../../types/country';
import './Autocomplete.css';

const Autocomplete: React.FC = () => {
	const [suggestions, setSuggestions] = useState<Country[]>([]);

	const controller = useRef(new AbortController());
	const request = useRef<Promise<Country[]> | null>();

	const onChangeRegular = useCallback(async (searchText: string) => {
		if (!searchText) {
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
		} catch (err) {
			console.error(err);
		}

		request.current = null;
	}, []);

	const onChangeDebounced = useDebounce(onChangeRegular, 500);

	const onChange = useCallback(
		(evt: ChangeEvent<HTMLInputElement>) => {
			const searchText = evt.target.value.trim();
			setSuggestions([]);
			onChangeDebounced(searchText);
		},
		[onChangeDebounced]
	);

	return (
		<div className="autocomplete">
			<label className="autocomplete__label">
				<input
					className="autocomplete__input"
					type="text"
					onChange={onChange}
					placeholder="Please type country"
					data-testid="autocomplete-input"
				/>
			</label>

			<ul className="autocomplete__list">
				{suggestions.length > 0 &&
					suggestions.map(({ name: { common }, flag }, index) => (
						<li key={index} className="autocomplete__item">
							<span className="autocomplete__country-flag">{flag}</span>
							<em className="autocomplete__country-name">{common}</em>
						</li>
					))}
			</ul>
		</div>
	);
};

export default Autocomplete;
