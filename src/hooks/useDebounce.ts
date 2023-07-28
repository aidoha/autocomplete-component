import { useCallback, useState } from 'react';

export const useDebounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
	fn: T,
	time: number
) => {
	const [timeout, updateTimeout] = useState<number>(0);

	return useCallback(
		(...args: unknown[]) => {
			if (timeout) {
				clearTimeout(timeout);
			}
			updateTimeout(setTimeout(fn, time, ...args));
		},
		[fn, time, timeout]
	);
};
