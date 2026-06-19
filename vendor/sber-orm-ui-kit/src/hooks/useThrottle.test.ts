import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useThrottle from './useThrottle';

describe('useThrottle', () => {
    beforeEach(() => {
        vi.useFakeTimers(); // Используем фейковые таймеры
    });

    afterEach(() => {
        vi.restoreAllMocks(); // Восстанавливаем оригинальные таймеры
    });

    it('should call the function immediately on first invocation', () => {
        const mockFunc = vi.fn((value: string) => value);
        const delay = 500;

        const { result } = renderHook(() => useThrottle(mockFunc, delay));

        act(() => {
            result.current('first'); // Вызываем throttled функцию
        });

        expect(mockFunc).toHaveBeenCalledTimes(1);
        expect(mockFunc).toHaveBeenCalledWith('first');
    });

    it('should throttle subsequent calls within the delay period', () => {
        const mockFunc = vi.fn((value: string) => value);
        const delay = 500;

        const { result } = renderHook(() => useThrottle(mockFunc, delay));

        act(() => {
            result.current('first'); // Первый вызов
            result.current('second'); // Второй вызов (должен быть проигнорирован)
        });

        expect(mockFunc).toHaveBeenCalledTimes(1);
        expect(mockFunc).toHaveBeenCalledWith('first');

        act(() => {
            vi.advanceTimersByTime(delay); // Продвигаем время
            result.current('third'); // Третий вызов
        });

        expect(mockFunc).toHaveBeenCalledTimes(2);
        expect(mockFunc).toHaveBeenCalledWith('third');
    });

    it('should cancel the throttled call', () => {
        const mockFunc = vi.fn((value: string) => value);
        const delay = 500;

        const { result } = renderHook(() => useThrottle(mockFunc, delay));

        act(() => {
            result.current('first'); // Первый вызов
            result.current('second'); // Второй вызов (должен быть проигнорирован)
            result.current.cancel(); // Отменяем отложенный вызов
        });

        act(() => {
            vi.advanceTimersByTime(delay); // Продвигаем время
        });

        expect(mockFunc).toHaveBeenCalledTimes(1); // Только первый вызов выполнен
        expect(mockFunc).toHaveBeenCalledWith('first');
    });
});
