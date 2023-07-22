export const isElementVisibleFromOverflow = (outerElement, innerElement) => {
    const outerRect = outerElement.getBoundingClientRect();
    const innerRect = innerElement.getBoundingClientRect();
    return (outerRect.top <= innerRect.bottom &&
        innerRect.top <= outerRect.bottom &&
        outerRect.left <= innerRect.right &&
        innerRect.left <= outerRect.right);
};
