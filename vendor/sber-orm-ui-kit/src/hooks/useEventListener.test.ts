import { describe, expect, it, vi } from 'vitest';

import { renderHook } from '@testing-library/react';

import {
	ISubscribeEventMap,
	subscribeEvent,
	useEventListener,
} from './useEventListener';

const mockElement = {
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	click: vi.fn(),
} as unknown as Element;

// 1. Подписка добавляет обработчик к существующему элементу
describe('subscribeEvent', () => {
	it('adds listener to element', () => {
		const listener = vi.fn();
		subscribeEvent(mockElement, 'click', listener);
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			'click',
			listener,
			undefined,
		);
	});

	// 2. Возвращается функция для отписки
	it('returns cleanup function', () => {
		const listener = vi.fn();
		const cleanup = subscribeEvent(mockElement, 'click', listener);
		expect(typeof cleanup).toBe('function');
	});

	// 3. Не добавляет обработчик при null-элементе
	it('handles null element', () => {
		const result = subscribeEvent(null, 'click', vi.fn());
		expect(result).toBeNull();
	});
});

// 4. Хук подписывается при монтировании
describe('useEventListener', () => {
	it('adds listener on mount', () => {
		renderHook(() => useEventListener(mockElement, 'click', vi.fn()));
		expect(mockElement.addEventListener).toHaveBeenCalled();
	});

	// 5. Хук отписывается при размонтировании
	it('removes listener on unmount', () => {
		const { unmount } = renderHook(() =>
			useEventListener(mockElement, 'click', vi.fn()),
		);
		unmount();
		expect(mockElement.removeEventListener).toHaveBeenCalled();
	});

	// 6. Обрабатывает eventTarget как функцию
	it('handles eventTarget as function', () => {
		const targetFn = vi.fn(() => mockElement);
		renderHook(() => useEventListener(targetFn, 'click', vi.fn()));
		expect(targetFn).toHaveBeenCalled();
	});

	// 7. Обновляет подписку при изменении события
	it('updates subscription when event changes', () => {
		const { rerender } = renderHook(
			({ event }) =>
				useEventListener(
					mockElement,
					event as keyof ISubscribeEventMap,
					vi.fn(),
				),
			{
				initialProps: { event: 'click' },
			},
		);
		rerender({ event: 'scroll' });
		expect(mockElement.removeEventListener).toHaveBeenCalledWith(
			'click',
			expect.anything(),
			false,
		);
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			'scroll',
			expect.anything(),
			false,
		);
	});

	// 8. Обновляет listener при изменении
	it('updates listener when changed', () => {
		const listener1 = vi.fn();
		const listener2 = vi.fn();
		const { rerender } = renderHook(
			({ listener }) => useEventListener(mockElement, 'click', listener),
			{ initialProps: { listener: listener1 } },
		);
		rerender({ listener: listener2 });
		expect(mockElement.removeEventListener).toHaveBeenCalledWith(
			'click',
			listener1,
			false,
		);
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			'click',
			listener2,
			false,
		);
	});

	// 9. Обрабатывает изменения options
	it('handles options changes', () => {
		const options1 = { capture: true };
		const options2 = { capture: false };
		const { rerender } = renderHook(
			({ opts }) => useEventListener(mockElement, 'click', vi.fn(), opts),
			{ initialProps: { opts: options1 } },
		);
		rerender({ opts: options2 });
		expect(mockElement.removeEventListener).toHaveBeenCalledWith(
			'click',
			expect.anything(),
			options1,
		);
	});

	// 10. Игнорирует элементы без addEventListener
	it('ignores invalid event targets', () => {
		const invalidTarget = {} as Element;
		const { result } = renderHook(() =>
			useEventListener(invalidTarget, 'click', vi.fn()),
		);
		// @ts-expect-error
		expect(result.error).toBeUndefined();
	});

	// 11. Сериализует options через JSON.stringify
	it('serializes options with JSON.stringify', () => {
		const options = { capture: true };
		renderHook(() => useEventListener(mockElement, 'click', vi.fn(), options));
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			'click',
			expect.anything(),
			options,
		);
	});

	// 12. Не переподписывается при глубоком равенстве options
	it('does not resubscribe on deep equal options', () => {
		vi.resetAllMocks();
		const { rerender } = renderHook(
			({ opts }) => useEventListener(mockElement, 'click', vi.fn(), opts),
			{
				initialProps: { opts: { capture: true } },
			},
		);
		rerender({ opts: { capture: true } });
		expect(mockElement.addEventListener).toHaveBeenCalledTimes(2);
	});

	// 13. Работает с Window как target
	it('handles Window as target', () => {
		const win = window as unknown as Window;
		window.addEventListener = vi.fn();
		renderHook(() => useEventListener(win, 'resize', vi.fn()));
		expect(win.addEventListener).toHaveBeenCalled();
	});

	// 14. Работает с Document как target
	it('handles Document as target', () => {
		const doc = document as unknown as Document;
		document.addEventListener = vi.fn();
		renderHook(() => useEventListener(doc, 'scroll', vi.fn()));
		expect(doc.addEventListener).toHaveBeenCalled();
	});

	// 15. Обрабатывает булевые options
	it('handles boolean options', () => {
		renderHook(() => useEventListener(mockElement, 'click', vi.fn(), true));
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			'click',
			expect.anything(),
			true,
		);
	});

	// 16. Не падает при null eventTarget
	it('handles null eventTarget', () => {
		const { result } = renderHook(() =>
			useEventListener(null, 'click', vi.fn()),
		);
		// @ts-expect-error
		expect(result.error).toBeUndefined();
	});

	// 18. Обновляет target при его изменении
	it('updates subscription when target changes', () => {
		const target1 = { ...mockElement };
		const target2 = { ...mockElement };
		const { rerender } = renderHook(
			({ target }) => useEventListener(target, 'click', vi.fn()),
			{ initialProps: { target: target1 } },
		);
		rerender({ target: target2 });
		expect(target1.removeEventListener).toHaveBeenCalled();
		expect(target2.addEventListener).toHaveBeenCalled();
	});
});
