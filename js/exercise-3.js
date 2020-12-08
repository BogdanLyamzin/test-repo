const imgSearchForm = document.getElementById("search-form");
const imgSearchResult = document.getElementById("search-result");

imgSearchForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    imgSearchResult.innerHTML = "";
    const {value} = this.querySelector("[name=query]");
    const galleryObj = new PixabayGallery(value);
    const gallery = await galleryObj.render();
    imgSearchResult.append(gallery);
});

class PixabayGallery {
    constructor(searchPhrase) {
        this._query = searchPhrase.split(" ").join("+");
        this._page = 1;
        this._itemsPerPage = 20;
        this._key = "19424746-b0a1484361dc916348a3c4fbd";
        this._basicURL = `https://pixabay.com/api?key=${this._key}`;
        this._gallery = null;
    }

    async _getImages() {
        const {_basicURL, _query, _page, _itemsPerPage} = this;
        const requestURL = `${_basicURL}&q=${_query}&page=${_page}&per_page=${_itemsPerPage}`;
        try {
            const response = await fetch(requestURL);
            const result = await response.json();
            return result.hits;
        }
        catch (err) {
            throw new Error(`Ошибка ${err}`);
        }
    }

    _createCard(smallImage, largeImage) {
        const element = document.createElement("li");
        const card = document.createElement("a");
        card.href = largeImage;
        card.insertAdjacentHTML("beforeend", `<img src="${smallImage}" 
                                                        data-source="${largeImage}"
                                                        alt="описсание" />`);
        card.addEventListener("click",  (e)=>{
            e.preventDefault();
            this._showLargeImage(largeImage);
        });
        element.append(card);
        return element;
    }

    _showLargeImage(imageURL) {
        basicLightbox.create(`
		    <img src="${imageURL}">
	    `).show();
    }

    async _createGallery() {
        const imgList = await this._getImages();
        const gallery = document.createElement("ul");
        const cardList = imgList.map(({webformatURL, largeImageURL}) => this._createCard(webformatURL, largeImageURL));
        gallery.append(...cardList);
        return gallery;
    }

    async _loadMore() {
        this._page++;
        const imgList = await this._getImages();
        const cardList = imgList.map(({webformatURL, largeImageURL}) => this._createCard(webformatURL, largeImageURL));
        this._gallery.append(...cardList);
    }

    async render() {
        this._gallery = await this._createGallery();
        const observer = new IntersectionObserver((entries, observer)=> {
            console.log(entries[0].intersectionRatio)
            if (entries[0].isIntersecting) {
                this._loadMore();
            }
        }, {
            threshold: 0.5
        });
        const galleryContainer = document.createElement("div");
        galleryContainer.append(this._gallery);
        const loadMore = document.createElement("h3");
        loadMore.textContent = "LOAD MORE";
        galleryContainer.append(loadMore);
        observer.observe(loadMore);
        return galleryContainer;
    }
}