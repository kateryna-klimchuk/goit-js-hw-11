import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const axios = require('axios');

const PIXABAY_KEY = '27448491-3edcbaaac83ebd1071ff4125b';
const BASE_URL = 'https:pixabay.com/api';
let pageCount = 1;

let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: "alt",
    captionDelay: "250",
    enableKeyboard: "true",
})


const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.classList.add('hidden');
loadMoreBtn.addEventListener('click', onLoadMorePhotos)
formEl.addEventListener('submit', onCustomerInput);

function onCustomerInput(event) {
    event.preventDefault();
    clearGallery();
    pageCount = 1;
    const inputText = event.currentTarget.searchQuery.value;
    console.log(inputText);
    axios.get(`${BASE_URL}/?key=${PIXABAY_KEY}&q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCount}`)
        .then(response => {
            const data = response.data;
            console.log(data);
            if (data.total === 0) {
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }
            Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
            markUpPhotoCard(data.hits);
            lightbox.refresh()
            loadMoreBtn.classList.remove('hidden');
        })        
}

console.log(formEl.children[0].value);


function markUpPhotoCard(data) {
    const tagsData = data.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card"><a class="gallery__link" href=${largeImageURL}><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
    <p class="info-item">
        <b>Likes</b>${likes}
    </p>
    <p class="info-item">
        <b>Views</b>${views}
    </p>
    <p class="info-item">
        <b>Comments</b>${comments}
    </p>
    <p class="info-item">
        <b>Downloads</b>${downloads}
    </p>
    </div></div>`}).join('');
    return galleryEl.insertAdjacentHTML('beforeend', tagsData)
}

function clearGallery() {
    galleryEl.innerHTML = '';
}

function onLoadMorePhotos() {

    const inputValue = formEl.children[0].value;
    pageCount += 1;
    axios.get(`${BASE_URL}/?key=${PIXABAY_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCount}`)
        .then(response => {
            const data = response.data;
            const dataLength = data.totalHits - data.hits.length;
            console.log(data.hits.length);
            if (data.hits.length === 0) {
                loadMoreBtn.classList.add('hidden');
                return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            }
            markUpPhotoCard(data.hits);
            loadMoreBtn.classList.remove('hidden');
        })
}