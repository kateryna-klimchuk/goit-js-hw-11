import {galleryEl} from './refs.js'

export const markUpPhotoCard = (data) => {
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
