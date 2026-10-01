const activeToasts = [];
const updateToastPositions = () => {
    let accumulatedHeight = 60;
    activeToasts.forEach((toast) => {
        const topPosition = accumulatedHeight;
        toast.element.style.top = `${topPosition}px`;
        accumulatedHeight += toast.height + 10;
    });
};
const removeToast = (toastElement) => {
    const index = activeToasts.findIndex(t => t.element === toastElement);
    if (index !== -1) {
        toastElement.classList.add('toast-exit');
        activeToasts.splice(index, 1);
        setTimeout(() => {
            toastElement.remove();
            updateToastPositions();
        }, 300);
    }
};

function showToast (
 content,
 type = "success",
 duration = 2000,
) {
    const toastElement = document.createElement('div');
    toastElement.className = 'toast-notification';
    const parag = document.createElement("p");
    parag.textContent = content;
    toastElement.appendChild(parag);
    toastElement.style.setProperty('--toast-duration', `${(duration - 300) / 1000}s`);
    toastElement.style.opacity = '0';
    toastElement.style.visibility = 'hidden';
    document.body.appendChild(toastElement);
    const height = toastElement.offsetHeight;
    const toastItem = { element: toastElement, height };
    activeToasts.unshift(toastItem);
    updateToastPositions();
    toastElement.style.opacity = '';
    toastElement.style.visibility = '';
    toastElement.classList.add('toast-enter');
    toastElement.classList.add(type);
    setTimeout(() => {
        toastElement.classList.remove('toast-enter');
    }, 300);
    const timeoutId = setTimeout(() => {
        removeToast(toastElement);
    }, duration);
    toastElement.addEventListener('click', (e) => {
        if ((e.target).closest('.toast-context-menu')) {
            return;
        }
        clearTimeout(timeoutId);
        removeToast(toastElement);
    });
    toastElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        clearTimeout(timeoutId);
        removeToast(toastElement);
    });
    return {
        close: () => {
            clearTimeout(timeoutId);
            removeToast(toastElement);
        }
    };
};