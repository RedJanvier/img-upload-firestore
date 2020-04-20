const form = document.querySelector(".upload-form");
const errorBox = document.querySelector(".error-box");
const successBox = document.querySelector(".success-box");
const previewImg = document.querySelector(".upload-preview img");
const previewTxt = document.querySelector(".upload-preview span");

form.image.addEventListener("change", () => {
  const file = form.image.files[0];

  if (file) {
    const reader = new FileReader();

    previewTxt.style.display = "none";

    reader.addEventListener("load", () => {
      previewImg.style.width = "100%";
      previewImg.parentElement.style.borderColor = "green";
      previewImg.setAttribute("src", reader.result);
    });

    reader.readAsDataURL(file);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const image = form.image.files[0];

  if (image) {
    const file = image;
    const metadata = {
      contentType: "image/jpeg",
    };
    const uploadTask = storage
      .ref()
      .child("images/" + file.name)
      .put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      null,
      null,
      function () {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);
          successBox.style.display = "block";
          //   const preview = document.createElement("img");
          //   preview.setAttribute("src", downloadURL);
          //   successBox.appendChild(preview);
          setTimeout(() => (successBox.style.display = "none"), 5000);
        });
      }
    );
  } else {
    const error = document.createElement("p");
    error.textContent = "Please select a file!";
    errorBox.innerHTML = "";
    errorBox.appendChild(error);
    errorBox.style.display = "block";
    setTimeout(() => (errorBox.style.display = "none"), 5000);
  }
});
