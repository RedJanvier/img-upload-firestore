const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

if (!location.href.includes("single.html")) {
  const postsList = document.querySelector(".posts-list");
  db.collection("posts")
    .get()
    .then(function (querySnapshot) {
      let html = "";
      querySnapshot.forEach(function (doc) {
        const { title, description, image, image2, image3 } = doc.data();
        let imagesType = 0;
        image && imagesType++;
        image2 && imagesType++;
        image3 && imagesType++;

        html += `
    <li class="post" data-id"${doc.id}">
        <a href="/test-preview-single.html?images=${encodeURIComponent(
          imagesType
        )}&id=${encodeURIComponent(doc.id)}&title=${encodeURIComponent(
          title
        )}&image=${encodeURIComponent(image)}&image2=${encodeURIComponent(
          image2
        )}&image3=${encodeURIComponent(
          image3
        )}&description=${encodeURIComponent(description)}" 
        class="post_title"><div class="img"><img src="${image}"/></div><h3>${title}</h3></a>
    </li>`;
      });
      postsList.innerHTML = html;
    });
} else {
  const post = {
    id: getUrlParameter("id"),
    description: getUrlParameter("description"),
    title: getUrlParameter("title"),
    image: getUrlParameter("image"),
  };
  getUrlParameter("image2").length
    ? (post["image2"] = getUrlParameter("image2"))
    : null;
  getUrlParameter("image3").length
    ? (post["image3"] = getUrlParameter("image3"))
    : null;

  const heroImg = document.querySelector("header img");
  const pageTitle = document.querySelector(".body h1");
  const pageDescription = document.querySelector(".body p");
  const imgsNumber = parseInt(getUrlParameter("images"));
  imgsNumber === 2 && heroImg.parentElement.classList.add("double");
  imgsNumber === 3 && heroImg.parentElement.classList.add("triple");

  heroImg.setAttribute("src", post.image);
  pageTitle.textContent = post.title;

  const img2 = post.image2 !== "undefined" && document.createElement("img");
  const img3 = post.image3 !== "undefined" && document.createElement("img");
  const img2Wrp = post.image2 !== "undefined" && document.createElement("div");
  const img3Wrp = post.image3 !== "undefined" && document.createElement("div");
  post.image2 !== "undefined" && img2.setAttribute("src", post.image2);
  post.image3 !== "undefined" && img3.setAttribute("src", post.image3);
  post.image2 !== "undefined" && img2Wrp.setAttribute("class", "img");
  post.image3 !== "undefined" && img3Wrp.setAttribute("class", "img");

  pageDescription.textContent = post.description;
  post.image2 !== "undefined" && img2Wrp.appendChild(img2);
  post.image3 !== "undefined" && img3Wrp.appendChild(img3);
  post.image2 !== "undefined" && heroImg.parentElement.appendChild(img2Wrp);
  post.image3 !== "undefined" && heroImg.parentElement.appendChild(img3Wrp);
}
