// Post messaging synchronization hub across parent frames
window.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'changeTheme') {
        document.body.setAttribute('data-theme', e.data.theme);
        localStorage.setItem('selected-theme', e.data.theme);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const cachedTheme = localStorage.getItem('selected-theme') || 'cute';
    document.body.setAttribute('data-theme', cachedTheme);
});

function transitionToPage(targetPath) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.25s ease';
    setTimeout(() => { window.location.href = targetPath; }, 250);
}
