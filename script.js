/* script.js */

const baseUrl = 'https://wiki.wizard101central.com';
// categories: "Hat", "Robe", "Boot", "Wand"
let category = "Hat"
let currentUrl = baseUrl + '/wiki/Category:' + category + '_Images';
// i could add max pages, but i don't need to...
let currentPage = document.getElementById("pageValue");
console.log(currentUrl);

// stores images to display
let imagesData = [];
// amount of displayed images
let resultValue = document.getElementById("resultValue");
// selectedImages to display in outfitContainer
let selectedImages = [];

// display images
function displayImages(images) {
    resultValue.textContent = images.length;
    const container = document.getElementById('imageContainer');
    // clear previous content
    container.innerHTML = '';

    images.forEach((image) => {
        const img = document.createElement('img');
        img.src = image.url;
        img.style.cursor = 'pointer';

        // adds click event listener to each image
        img.addEventListener('click', () => {
            console.log(`Image clicked: ${image.url}`);
            selectedImages = selectedImages.filter(item => item.category != image.category);
            selectedImages.push(image);
            displaySelection();
        });
        container.appendChild(img);
    });
}

// filter images based on gender
function filterImages() {
    const selectedGender = document.getElementById('genderFilter').value;
    const filteredImages = selectedGender === 'all' ? imagesData : imagesData.filter(image => image.gender === selectedGender);
    displayImages(filteredImages);
}

function changeCategory() {
    category = document.getElementById('categoryFilter').value;
    currentUrl = baseUrl + '/wiki/Category:' + category + '_Images';
    fetchAndDisplayImages(currentUrl);
}

function displaySelection() {
    const container = document.getElementById('outfitSelection');
    // clear previous content
    container.innerHTML = '';

    // sorts by hat -> robe -> boot -> wand
    function customSort(a, b) {
        const categoryOrder = { 'hat': 1, 'robe': 2, 'boot': 3, 'wand': 4 };
        const categoryA = categoryOrder[a.category];
        const categoryB = categoryOrder[b.category];
        return categoryA - categoryB;
    }
    selectedImages.sort(customSort);

    selectedImages.forEach((image) => {
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = `${image.gender}_${image.category}`;
        container.appendChild(img);
    });
}

async function changePage(choice) {
    try {
        const response = await fetch(currentUrl);
        const html = await response.text();

        // create a temporary element to parse the HTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        let previousPagePath = '/wiki/Category:' + category + '_Images';
        let nextPagePath;
        let currentPageValue = parseInt(currentPage.textContent);

        if (currentPageValue === 1) {
            nextPagePath = tempElement.querySelector('.mw-category-generated a').href.substring(7);;
        } else {
            let queries = tempElement.querySelectorAll('.mw-category-generated a');
            previousPagePath = queries[0].href.substring(7);
            nextPagePath = queries[1].href.substring(7);
        }

        if (choice === 'previous') {
            currentUrl = baseUrl + previousPagePath;

            if (currentPageValue <= 1) {
                currentPageValue = 1;
            } else {
                currentPageValue -= 1;
            }

            fetchAndDisplayImages(currentUrl);
        } else {
            currentUrl = baseUrl + nextPagePath;
            currentPageValue += 1;
            fetchAndDisplayImages(currentUrl);
        }

        currentPage.textContent = currentPageValue;
    } catch (error) {
        console.error('Error switching pages:', error);
    }
}

// fetches image paths from a url
async function fetchImagePathsFromUrl(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        // create a temporary element to parse the HTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // selector finding img elements that are children of elements with the class "image" 
        // i notice that when we grab these images, they contain an href leading to another page, we can go there and grab images too if we want bigger
        const imageElements = tempElement.querySelectorAll('.image img');
        
        // creates array of image urls by grabbing the "src" attribute
        // for each "img" in imageElements: grab 'src', take its substring, add it to array
        const urlPaths = Array.from(imageElements).map(img => img.src.substring(7));

        return urlPaths;
    } catch (error) {
        console.error('Error fetching url paths:', error);
        return [];
    }
}

// fetch and display images from a given URL
// this needs to be used on start, next, previous, and filters
async function fetchAndDisplayImages(url) {
    // get all objects with class "image" from the url
    const urlPaths = await fetchImagePathsFromUrl(url);

    // empty out the array
    imagesData = [];

    for (let path of urlPaths) {
        let genderString = "";

        if (path.includes("Female")) {
            genderString = "female";
        } else {
            genderString = "male";
        }

        // add an object with properties: gender, type, and url to array imagesData
        imagesData.push(
            { gender: genderString, category: category.toLowerCase(), url: baseUrl + path}
        )
    }

    displayImages(imagesData);
}

fetchAndDisplayImages(currentUrl);
displaySelection();