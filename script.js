// script.js
// This is where you'll handle fetching and displaying images

// Sample data (replace with your logic to fetch images)
const imagesData = [
    { gender: 'male', type: 'hat', url: 'https://wiki.wizard101central.com/wiki/File:(Item)_Absolute_Zero_Brim_Male.png' },
    // Add more image data as needed
];

// Function to display images
function displayImages(images) {
    const container = document.getElementById('image-container');
    container.innerHTML = ''; // Clear previous content

    images.forEach((imageData) => {
        const img = document.createElement('img');
        img.src = imageData.url;
        img.alt = `${imageData.gender}_${imageData.type}`;
        container.appendChild(img);
    });
}

// Initial call to display images
displayImages(imagesData);
