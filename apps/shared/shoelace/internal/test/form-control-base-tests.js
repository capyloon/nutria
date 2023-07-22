import { expect, fixture } from '@open-wc/testing';
export function runFormControlBaseTests(tagNameOrConfig) {
    const isStringArg = typeof tagNameOrConfig === 'string';
    const tagName = isStringArg ? tagNameOrConfig : tagNameOrConfig.tagName;
    const init = isStringArg || !tagNameOrConfig.init
        ? null
        : tagNameOrConfig.init || null;
    const displayName = isStringArg
        ? tagName
        : `${tagName} (${tagNameOrConfig.variantName})`;
    const createControl = async () => {
        const control = await createFormControl(tagName);
        init === null || init === void 0 ? void 0 : init(control);
        return control;
    };
    runAllValidityTests(tagName, displayName, createControl);
}
function runAllValidityTests(tagName, displayName, createControl) {
    describe(`Form validity base test for ${displayName}`, async () => {
        it('should have a property `validity` of type `object`', async () => {
            const control = await createControl();
            expect(control).satisfy(() => control.validity !== null && typeof control.validity === 'object');
        });
        it('should have a property `validationMessage` of type `string`', async () => {
            const control = await createControl();
            expect(control).satisfy(() => typeof control.validationMessage === 'string');
        });
        it('should implement method `checkValidity`', async () => {
            const control = await createControl();
            expect(control).satisfies(() => typeof control.checkValidity === 'function');
        });
        it('should implement method `setCustomValidity`', async () => {
            const control = await createControl();
            expect(control).satisfies(() => typeof control.setCustomValidity === 'function');
        });
        it('should implement method `reportValidity`', async () => {
            const control = await createControl();
            expect(control).satisfies(() => typeof control.reportValidity === 'function');
        });
        it('should be valid initially', async () => {
            const control = await createControl();
            expect(control.validity.valid).to.equal(true);
        });
        it('should make sure that calling `.checkValidity()` will return `true` when valid', async () => {
            const control = await createControl();
            expect(control.checkValidity()).to.equal(true);
        });
        it('should make sure that calling `.reportValidity()` will return `true` when valid', async () => {
            const control = await createControl();
            expect(control.reportValidity()).to.equal(true);
        });
        it('should not emit an `sl-invalid` event when `.checkValidity()` is called while valid', async () => {
            const control = await createControl();
            const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.checkValidity());
            expect(emittedEvents.length).to.equal(0);
        });
        it('should not emit an `sl-invalid` event when `.reportValidity()` is called while valid', async () => {
            const control = await createControl();
            const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.reportValidity());
            expect(emittedEvents.length).to.equal(0);
        });
        if (tagName !== 'sl-radio-group') {
            it('should not emit an `sl-invalid` event when `.checkValidity()` is called in custom error case while disabled', async () => {
                const control = await createControl();
                control.setCustomValidity('error');
                control.disabled = true;
                await control.updateComplete;
                const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.checkValidity());
                expect(emittedEvents.length).to.equal(0);
            });
            it('should not emit an `sl-invalid` event when `.reportValidity()` is called in custom error case while disabled', async () => {
                const control = await createControl();
                control.setCustomValidity('error');
                control.disabled = true;
                await control.updateComplete;
                const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.reportValidity());
                expect(emittedEvents.length).to.equal(0);
            });
        }
        const mode = getMode(await createControl());
        if (mode === 'slButtonOfTypeButton') {
            runSpecialTests_slButtonOfTypeButton(createControl);
        }
        else if (mode === 'slButtonWithHRef') {
            runSpecialTests_slButtonWithHref(createControl);
        }
        else {
            runSpecialTests_standard(createControl);
        }
    });
}
function runSpecialTests_slButtonOfTypeButton(createControl) {
    it('should make sure that `.validity.valid` is `false` in custom error case', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        expect(control.validity.valid).to.equal(false);
    });
    it('should make sure that calling `.checkValidity()` will still return `true` when custom error has been set', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        expect(control.checkValidity()).to.equal(true);
    });
    it('should make sure that calling `.reportValidity()` will still return `true` when custom error has been set', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        expect(control.reportValidity()).to.equal(true);
    });
    it('should not emit an `sl-invalid` event when `.checkValidity()` is called in custom error case, and not disabled', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        control.disabled = false;
        await control.updateComplete;
        const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.checkValidity());
        expect(emittedEvents.length).to.equal(0);
    });
    it('should not emit an `sl-invalid` event when `.reportValidity()` is called in custom error case, and not disabled', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        control.disabled = false;
        await control.updateComplete;
        const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.reportValidity());
        expect(emittedEvents.length).to.equal(0);
    });
}
function runSpecialTests_slButtonWithHref(createControl) {
    it('should make sure that calling `.checkValidity()` will return `true` in custom error case', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        expect(control.checkValidity()).to.equal(true);
    });
    it('should make sure that calling `.reportValidity()` will return `true` in custom error case', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        expect(control.reportValidity()).to.equal(true);
    });
    it('should not emit an `sl-invalid` event when `.checkValidity()` is called in custom error case', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        await control.updateComplete;
        const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.checkValidity());
        expect(emittedEvents.length).to.equal(0);
    });
    it('should not emit an `sl-invalid` event when `.reportValidity()` is called in custom error case', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        await control.updateComplete;
        const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.reportValidity());
        expect(emittedEvents.length).to.equal(0);
    });
}
function runSpecialTests_standard(createControl) {
    it('should make sure that `.validity.valid` is `false` in custom error case', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        expect(control.validity.valid).to.equal(false);
    });
    it('should make sure that calling `.checkValidity()` will return `false` in custom error case', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        expect(control.checkValidity()).to.equal(false);
    });
    it('should make sure that calling `.reportValidity()` will return `false` in custom error case', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        expect(control.reportValidity()).to.equal(false);
    });
    it('should emit an `sl-invalid` event when `.checkValidity()` is called in custom error case and not disabled', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        control.disabled = false;
        await control.updateComplete;
        const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.checkValidity());
        expect(emittedEvents.length).to.equal(1);
    });
    it('should emit an `sl-invalid` event when `.reportValidity()` is called in custom error case and not disabled', async () => {
        const control = await createControl();
        control.setCustomValidity('error');
        control.disabled = false;
        await control.updateComplete;
        const emittedEvents = checkEventEmissions(control, 'sl-invalid', () => control.reportValidity());
        expect(emittedEvents.length).to.equal(1);
    });
}
async function createFormControl(tagName) {
    return await fixture(`<${tagName}></${tagName}>`);
}
function checkEventEmissions(control, eventType, action) {
    const emittedEvents = [];
    const eventHandler = (event) => {
        emittedEvents.push(event);
    };
    try {
        control.addEventListener(eventType, eventHandler);
        action();
    }
    finally {
        control.removeEventListener(eventType, eventHandler);
    }
    return emittedEvents;
}
function getMode(control) {
    if (control.localName === 'sl-button' &&
        'href' in control &&
        'type' in control &&
        control.type === 'button' &&
        !control.href) {
        return 'slButtonOfTypeButton';
    }
    if (control.localName === 'sl-button' && 'href' in control && !!control.href) {
        return 'slButtonWithHRef';
    }
    return 'standard';
}
