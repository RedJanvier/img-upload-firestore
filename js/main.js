const form = document.querySelector('.upload-form');
const previewImg = document.querySelector('.upload-preview img');
const previewTxt = document.querySelector('.upload-preview span');

form.image.addEventListener('change', () => {
    const file = form.image.files[0];

    if(file) {
        const reader = new FileReader();

        previewTxt.style.display = 'none';

        reader.addEventListener('load', () => {
            previewImg.style.width = '100%';
            previewImg.parentElement.style.borderColor = 'green';
            previewImg.setAttribute('src', reader.result);
        });

        reader.readAsDataURL(file);
    }

});