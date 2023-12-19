// script.js
// This is where you'll handle fetching and displaying images
const baseUrl = 'https://wiki.wizard101central.com';

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

// Function to filter images based on gender
function filterImages(gender) {
    const filteredImages = gender === 'all' ? imagesData : imagesData.filter(image => image.gender === gender);
    displayImages(filteredImages);
}

// fetches image paths from a url
async function fetchPathsFromUrl(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        // create a temporary element to parse the HTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // selector finding img elements that are children of elements with the class "image" 
        // i notice that when we grab these images, they contain an href leading to another page, we can go there and grab images too if we want bigger
        const imageElements = tempElement.querySelectorAll('.image img');
        console.log(imageElements[3]);
        
        // creates array of image urls by grabbing the "src" attribute
        // for each "img" in imageElements: grab 'src', take its substring, add it to array
        const urlPaths = Array.from(imageElements).map(img => img.src.substring(7));
        //console.log(imageUrls.length);
        console.log(urlPaths[3]);

        return urlPaths;
    } catch (error) {
        console.error('Error fetching url paths:', error);
        return [];
    }
}

// Function to fetch and display images from a given URL
async function fetchAndDisplayImages() {
    // *** CHANGE THIS TO DYNAMICALLY CHANGE CATEGORIES ***
    let category = "Hat";

    // displays 200 images
    // path to a given category
    const categoryUrl = baseUrl + '/wiki/Category:' + category + '_Images';
    console.log(categoryUrl);

    // path to the file for the item
    const fileUrl = baseUrl + '/wiki/File:(Item)_Absolute_Zero_Brim_Male.png';

    // path to the actual image for the item
    const actualImageUrl = baseUrl + '/wiki/images/0/0c/%28Item%29_Absolute_Zero_Brim_Male.png';

    // get all objects with class "image" from the url
    const urlPaths = await fetchPathsFromUrl(categoryUrl);

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

    // sorts the array based on the 'gender' property
    imagesData.sort((a, b) => {
        // male first
        return a.gender.localeCompare(b.gender);

        // female first
        //b.gender.localeCompare(a.gender);
    });

    console.log(imagesData);
    displayImages(imagesData);
}

fetchAndDisplayImages();

// ** TODO **
// buttons
    // filter
    // sort
    // next & previous
    // clickable images to show current outfit
// display specific # of images
// set max columns
