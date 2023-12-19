// script.js

const baseUrl = 'https://wiki.wizard101central.com';
// categories: "Hat", "Robe", "Boots", "Staff"
let category = "Hat"
let currentUrl = baseUrl + '/wiki/Category:' + category + '_Images';
let currentPage = document.getElementById("pageValue");
console.log(currentUrl);

// stores images to display
let imagesData = [];
let resultValue = document.getElementById("resultValue");

// display images
function displayImages(images) {
    resultValue.textContent = images.length;
    const container = document.getElementById('imageContainer');
    // clear previous content
    container.innerHTML = '';

    images.forEach((image) => {
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = `${image.gender}_${image.type}`;
        container.appendChild(img);
    });
}

// filter images based on gender
function filterImages(gender) {
    const filteredImages = gender === 'all' ? imagesData : imagesData.filter(image => image.gender === gender);
    displayImages(filteredImages);
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
        //console.log(imageUrls.length);

        return urlPaths;
    } catch (error) {
        console.error('Error fetching url paths:', error);
        return [];
    }
}

// fetch and display images from a given URL
// this needs to be used on start, next, and previous
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
            { gender: genderString, type: category.toLowerCase(), url: baseUrl + path}
        )
    }

    // // sorts the array based on the 'gender' property
    // imagesData.sort((a, b) => {
    //     // male first
    //     return a.gender.localeCompare(b.gender);

    //     // female first
    //     //b.gender.localeCompare(a.gender);
    // });

    displayImages(imagesData);
}

fetchAndDisplayImages(currentUrl);

// ** TODO **
// buttons
    // filter
        // gender
    // sort?
    // next & previous, use "mw-category-generated" class with title "Category:Hat Images", should be two things
    // clickable images to show current outfit
    // item category
// display specific # of images
// set max columns
