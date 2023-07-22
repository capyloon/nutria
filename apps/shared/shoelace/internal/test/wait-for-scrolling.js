export const waitForScrollingToEnd = (element, timeoutInMs = 500) => {
    let lastLeft = element.scrollLeft;
    let lastTop = element.scrollTop;
    let framesWithoutChange = 0;
    return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => {
            reject(new Error('Waiting for scroll end timed out'));
        }, timeoutInMs);
        function checkScrollingChanged() {
            if (element.scrollLeft !== lastLeft || element.scrollTop !== lastTop) {
                framesWithoutChange = 0;
                lastLeft = window.scrollX;
                lastTop = window.scrollY;
            }
            else {
                framesWithoutChange++;
                if (framesWithoutChange >= 20) {
                    clearTimeout(timeout);
                    resolve();
                }
            }
            window.requestAnimationFrame(checkScrollingChanged);
        }
        checkScrollingChanged();
    });
};
