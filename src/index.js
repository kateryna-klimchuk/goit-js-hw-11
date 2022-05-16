import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// Notiflix.Notify.success('Sol lucet omnibus');

// Notiflix.Notify.failure('Qui timide rogat docet negare');

// Notiflix.Notify.warning('Memento te hominem esse');

// Notiflix.Notify.info('Cogito ergo sum');




const PIXABAY_KEY = '27448491-3edcbaaac83ebd1071ff4125b';
const BASE_URL = 'https:pixabay.com/api';
let pageCount = 1;


const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery')
formEl.addEventListener('submit', onCustomerInput);

function onCustomerInput(event) {
    event.preventDefault();

    const inputText = event.currentTarget.searchQuery.value;
    console.log(inputText);
    fetch(`${BASE_URL}/?key=${PIXABAY_KEY}&q=${inputText}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageCount}`)
        .then(response => response.json())
        .then(data => {
            if (data.total === 0) {
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            }
            Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
            markUpPhotoCard(data.hits);
        })
}

let lightbox = new SimpleLightbox(".gallery a")
lightbox.on('show.simplelightbox', {
    captionsData: "alt",
    captionDelay: "250",
    enableKeyboard: "true",
});

function markUpPhotoCard(data) {
    const tagsData = data.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
    <a class="gallery__link" href=${largeImageURL}><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
    </div>
</div>`}).join('');
    return galleryEl.insertAdjacentHTML('beforeend', tagsData)
}