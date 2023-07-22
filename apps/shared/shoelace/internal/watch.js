export function watch(propertyName, options) {
    const resolvedOptions = Object.assign({ waitUntilFirstUpdate: false }, options);
    return (proto, decoratedFnName) => {
        const { update } = proto;
        const watchedProperties = Array.isArray(propertyName) ? propertyName : [propertyName];
        proto.update = function (changedProps) {
            watchedProperties.forEach(property => {
                const key = property;
                if (changedProps.has(key)) {
                    const oldValue = changedProps.get(key);
                    const newValue = this[key];
                    if (oldValue !== newValue) {
                        if (!resolvedOptions.waitUntilFirstUpdate || this.hasUpdated) {
                            this[decoratedFnName](oldValue, newValue);
                        }
                    }
                }
            });
            update.call(this, changedProps);
        };
    };
}
