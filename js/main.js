const form = document.querySelector(".upload-form");
const errorBox = document.querySelector(".error-box");
const successBox = document.querySelector(".success-box");
const previewSect = document.querySelector(".upload-preview");
const previewTxt = document.querySelector(".upload-preview span");

const storePost = async (urls) => {
  const post = {
    title: form.title.value,
    description: form.description.value,
  };

  urls.forEach((url, i) => {
    i === 0 ? (post["image"] = url) : (post[`image${i + 1}`] = url);
  });

  try {
    const snapshot = await db.collection("posts").add(post);
    console.log(snapshot);
    successBox.style.display = "block";
    setTimeout(() => (successBox.style.display = "none"), 5000);
  } catch (error) {
    console.log("Error Creating Post....", error);
  }
};

form.image.addEventListener("change", () => {
  const { files } = form.image;

  switch (files.length) {
    case 2:
      previewSect.classList.add("double");
      break;
    case 3:
      previewSect.classList.add("triple");
      break;
    default:
      break;
  }

  previewSect.innerHTML = "";
  previewSect.style.border = "none";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file) {
      const reader = new FileReader();

      previewTxt.style.display = "none";

      reader.addEventListener("load", () => {
        const imageWrapper = document.createElement("div");
        const preview = document.createElement("img");
        preview.setAttribute("src", reader.result);
        imageWrapper.setAttribute("class", "image");

        imageWrapper.appendChild(preview);
        return previewSect.appendChild(imageWrapper);
      });

      reader.readAsDataURL(file);
    }
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const images = form.image.files;
  const downloadURLs = [];
  for (let i = 0; i < images.length; i++) {
    if (images[i]) {
      const file = images[i];
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
            //   const preview = document.createElement("img");
            //   preview.setAttribute("src", downloadURL);
            //   successBox.appendChild(preview);
            downloadURLs.push(downloadURL);
            if (i == images.length - 1) {
              storePost(downloadURLs);
            }
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
  }
});
