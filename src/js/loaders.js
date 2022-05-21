import { loaderEl } from './refs.js'

function showLoader() {
    loaderEl.classList.remove('hidden');
}

function hideLoader() {
    loaderEl.classList.add('hidden');
}

export {showLoader, hideLoader}