export const formCollections = new WeakMap();
const reportValidityOverloads = new WeakMap();
const userInteractedControls = new WeakSet();
const interactions = new WeakMap();
export class FormControlController {
    constructor(host, options) {
        this.handleFormData = (event) => {
            const disabled = this.options.disabled(this.host);
            const name = this.options.name(this.host);
            const value = this.options.value(this.host);
            const isButton = this.host.tagName.toLowerCase() === 'sl-button';
            if (!disabled && !isButton && typeof name === 'string' && name.length > 0 && typeof value !== 'undefined') {
                if (Array.isArray(value)) {
                    value.forEach(val => {
                        event.formData.append(name, val.toString());
                    });
                }
                else {
                    event.formData.append(name, value.toString());
                }
            }
        };
        this.handleFormSubmit = (event) => {
            var _a;
            const disabled = this.options.disabled(this.host);
            const reportValidity = this.options.reportValidity;
            if (this.form && !this.form.noValidate) {
                (_a = formCollections.get(this.form)) === null || _a === void 0 ? void 0 : _a.forEach(control => {
                    this.setUserInteracted(control, true);
                });
            }
            if (this.form && !this.form.noValidate && !disabled && !reportValidity(this.host)) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        };
        this.handleFormReset = () => {
            this.options.setValue(this.host, this.options.defaultValue(this.host));
            this.setUserInteracted(this.host, false);
            interactions.set(this.host, []);
        };
        this.handleInteraction = (event) => {
            const emittedEvents = interactions.get(this.host);
            if (!emittedEvents.includes(event.type)) {
                emittedEvents.push(event.type);
            }
            if (emittedEvents.length === this.options.assumeInteractionOn.length) {
                this.setUserInteracted(this.host, true);
            }
        };
        this.reportFormValidity = () => {
            if (this.form && !this.form.noValidate) {
                const elements = this.form.querySelectorAll('*');
                for (const element of elements) {
                    if (typeof element.reportValidity === 'function') {
                        if (!element.reportValidity()) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };
        (this.host = host).addController(this);
        this.options = Object.assign({ form: input => {
                if (input.hasAttribute('form') && input.getAttribute('form') !== '') {
                    const root = input.getRootNode();
                    const formId = input.getAttribute('form');
                    if (formId) {
                        return root.getElementById(formId);
                    }
                }
                return input.closest('form');
            }, name: input => input.name, value: input => input.value, defaultValue: input => input.defaultValue, disabled: input => { var _a; return (_a = input.disabled) !== null && _a !== void 0 ? _a : false; }, reportValidity: input => (typeof input.reportValidity === 'function' ? input.reportValidity() : true), setValue: (input, value) => (input.value = value), assumeInteractionOn: ['sl-input'] }, options);
    }
    hostConnected() {
        const form = this.options.form(this.host);
        if (form) {
            this.attachForm(form);
        }
        interactions.set(this.host, []);
        this.options.assumeInteractionOn.forEach(event => {
            this.host.addEventListener(event, this.handleInteraction);
        });
    }
    hostDisconnected() {
        this.detachForm();
        interactions.delete(this.host);
        this.options.assumeInteractionOn.forEach(event => {
            this.host.removeEventListener(event, this.handleInteraction);
        });
    }
    hostUpdated() {
        const form = this.options.form(this.host);
        if (!form) {
            this.detachForm();
        }
        if (form && this.form !== form) {
            this.detachForm();
            this.attachForm(form);
        }
        if (this.host.hasUpdated) {
            this.setValidity(this.host.validity.valid);
        }
    }
    attachForm(form) {
        if (form) {
            this.form = form;
            if (formCollections.has(this.form)) {
                formCollections.get(this.form).add(this.host);
            }
            else {
                formCollections.set(this.form, new Set([this.host]));
            }
            this.form.addEventListener('formdata', this.handleFormData);
            this.form.addEventListener('submit', this.handleFormSubmit);
            this.form.addEventListener('reset', this.handleFormReset);
            if (!reportValidityOverloads.has(this.form)) {
                reportValidityOverloads.set(this.form, this.form.reportValidity);
                this.form.reportValidity = () => this.reportFormValidity();
            }
        }
        else {
            this.form = undefined;
        }
    }
    detachForm() {
        var _a;
        if (this.form) {
            (_a = formCollections.get(this.form)) === null || _a === void 0 ? void 0 : _a.delete(this.host);
            this.form.removeEventListener('formdata', this.handleFormData);
            this.form.removeEventListener('submit', this.handleFormSubmit);
            this.form.removeEventListener('reset', this.handleFormReset);
            if (reportValidityOverloads.has(this.form)) {
                this.form.reportValidity = reportValidityOverloads.get(this.form);
                reportValidityOverloads.delete(this.form);
            }
        }
        this.form = undefined;
    }
    setUserInteracted(el, hasInteracted) {
        if (hasInteracted) {
            userInteractedControls.add(el);
        }
        else {
            userInteractedControls.delete(el);
        }
        el.requestUpdate();
    }
    doAction(type, submitter) {
        if (this.form) {
            const button = document.createElement('button');
            button.type = type;
            button.style.position = 'absolute';
            button.style.width = '0';
            button.style.height = '0';
            button.style.clipPath = 'inset(50%)';
            button.style.overflow = 'hidden';
            button.style.whiteSpace = 'nowrap';
            if (submitter) {
                button.name = submitter.name;
                button.value = submitter.value;
                ['formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget'].forEach(attr => {
                    if (submitter.hasAttribute(attr)) {
                        button.setAttribute(attr, submitter.getAttribute(attr));
                    }
                });
            }
            this.form.append(button);
            button.click();
            button.remove();
        }
    }
    getForm() {
        var _a;
        return (_a = this.form) !== null && _a !== void 0 ? _a : null;
    }
    reset(submitter) {
        this.doAction('reset', submitter);
    }
    submit(submitter) {
        this.doAction('submit', submitter);
    }
    setValidity(isValid) {
        const host = this.host;
        const hasInteracted = Boolean(userInteractedControls.has(host));
        const required = Boolean(host.required);
        host.toggleAttribute('data-required', required);
        host.toggleAttribute('data-optional', !required);
        host.toggleAttribute('data-invalid', !isValid);
        host.toggleAttribute('data-valid', isValid);
        host.toggleAttribute('data-user-invalid', !isValid && hasInteracted);
        host.toggleAttribute('data-user-valid', isValid && hasInteracted);
    }
    updateValidity() {
        const host = this.host;
        this.setValidity(host.validity.valid);
    }
    emitInvalidEvent(originalInvalidEvent) {
        const slInvalidEvent = new CustomEvent('sl-invalid', {
            bubbles: false,
            composed: false,
            cancelable: true,
            detail: {}
        });
        if (!originalInvalidEvent) {
            slInvalidEvent.preventDefault();
        }
        if (!this.host.dispatchEvent(slInvalidEvent)) {
            originalInvalidEvent === null || originalInvalidEvent === void 0 ? void 0 : originalInvalidEvent.preventDefault();
        }
    }
}
export const validValidityState = Object.freeze({
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false
});
export const valueMissingValidityState = Object.freeze(Object.assign(Object.assign({}, validValidityState), { valid: false, valueMissing: true }));
export const customErrorValidityState = Object.freeze(Object.assign(Object.assign({}, validValidityState), { valid: false, customError: true }));
