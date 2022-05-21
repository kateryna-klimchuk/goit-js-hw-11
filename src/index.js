import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
import {galleryEl, formEl} from './js/refs'
import { markUpPhotoCard } from './js/markup'
import {showLoader, hideLoader} from './js/loaders'

const PIXABAY_KEY = '27448491-3edcbaaac83ebd1071ff4125b';
const BASE_URL = 'https://pixabay.com/api';
let pageCount = 1;

let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: "alt",
    captionDelay: "250",
    enableKeyboard: "true",
})


formEl.addEventListener('submit', onCustomerInput);

hideLoader();

async function onCustomerInput(event) {
    event.preventDefault();
    clearGallery();
    pageCount = 1;
    const inputText = event.currentTarget.searchQuery.value.trim();
    try {
        const fetch = await axios.get(`${BASE_URL}/?key=${PIXABAY_KEY}&q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCount}`)
        const response = fetch.data;
        if (response.total === 0 || inputText === '') {
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        showLoader();
        Notiflix.Notify.success(`Hooray! We found ${response.total} images.`);

        markUpPhotoCard(response.hits);
        lightbox.refresh();
        observeLastfGalleryElement(galleryEl.querySelectorAll('.photo-card'));
        hideLoader();
    }

    catch (error) {
        if (error.message === 'Request failed with status code 400') {
            hideLoader();
        }
    }
}


function clearGallery() {
    galleryEl.innerHTML = '';
}

async function onLoadMorePhotos() {
    showLoader();

    const inputValue = formEl.children[0].value;
    pageCount += 1;
    try {
        const photoWithInfintyScroll = await axios.get(`${BASE_URL}/?key=${PIXABAY_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCount}`)
        const data = photoWithInfintyScroll.data;
        if (data.hits.length === 0) {
            hideLoader();
            errorNotification();
            return;
        }
        markUpPhotoCard(data.hits);
        lightbox.refresh();
        observeLastfGalleryElement(galleryEl.querySelectorAll('.photo-card'));
        hideLoader();
    }
    catch (error) {
    hideLoader();
}
}

function observeLastfGalleryElement(set) {
    const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
    };

    function handleImg(myImg, observer){
        if (myImg[0].isIntersecting) {
        onLoadMorePhotos();
    };
    };

    const observer = new IntersectionObserver(handleImg, options);
    observer.observe(set[set.length - 1]);
};


function errorNotification() {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}