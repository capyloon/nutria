import { sendMouse } from '@web/test-runner-commands';
function determineMousePosition(el, position, offsetX, offsetY) {
    const { x, y, width, height } = el.getBoundingClientRect();
    const centerX = Math.floor(x + window.pageXOffset + width / 2);
    const centerY = Math.floor(y + window.pageYOffset + height / 2);
    let clickX;
    let clickY;
    switch (position) {
        case 'top':
            clickX = centerX;
            clickY = y;
            break;
        case 'right':
            clickX = x + width - 1;
            clickY = centerY;
            break;
        case 'bottom':
            clickX = centerX;
            clickY = y + height - 1;
            break;
        case 'left':
            clickX = x;
            clickY = centerY;
            break;
        default:
            clickX = centerX;
            clickY = centerY;
    }
    clickX += offsetX;
    clickY += offsetY;
    return { clickX, clickY };
}
export async function clickOnElement(el, position = 'center', offsetX = 0, offsetY = 0) {
    const { clickX, clickY } = determineMousePosition(el, position, offsetX, offsetY);
    await sendMouse({ type: 'click', position: [clickX, clickY] });
}
export async function moveMouseOnElement(el, position = 'center', offsetX = 0, offsetY = 0) {
    const { clickX, clickY } = determineMousePosition(el, position, offsetX, offsetY);
    await sendMouse({ type: 'move', position: [clickX, clickY] });
}
export async function dragElement(el, deltaX = 0, deltaY = 0) {
    await moveMouseOnElement(el);
    await sendMouse({ type: 'down' });
    const { clickX, clickY } = determineMousePosition(el, 'center', deltaX, deltaY);
    await sendMouse({ type: 'move', position: [clickX, clickY] });
    await sendMouse({ type: 'up' });
}
