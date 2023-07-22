const TIMER_ID_KEY = Symbol();
export const debounce = (delay) => {
    return (_target, _propertyKey, descriptor) => {
        const fn = descriptor.value;
        descriptor.value = function (...args) {
            clearTimeout(this[TIMER_ID_KEY]);
            this[TIMER_ID_KEY] = window.setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    };
};
