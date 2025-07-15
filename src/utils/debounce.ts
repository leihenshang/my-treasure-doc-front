// src/utils/debounce.ts
/**
 * 防抖函数：在指定的延迟时间内，只执行最后一次调用的函数
 * @param fn 需要防抖的目标函数
 * @param delay 延迟时间（毫秒）
 * @returns 返回一个新的防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: unknown, ...args: Parameters<T>): void {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// // 使用示例
// const { debounceFn, cancel } = debounce((name: string) => {
//   console.log('Hello', name);
// }, 300);

// debounceFn('Alice');  // 300ms 内多次调用只会执行最后一次
// debounceFn('Bob');

// // 如果需要取消
// cancel();  // 取消所有未执行的防抖操作
export function debounceWithCancel<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
): {
    debounceFn: (...args: Parameters<T>) => void;
    cancel: () => void;
} {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const debounceFn = function (this: unknown, ...args: Parameters<T>): void {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };

    const cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return { debounceFn, cancel };
}