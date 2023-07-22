export const queryByTestId = (container, testId) => {
    return container.querySelector(`[data-testid="${testId}"]`);
};
