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
        html += `
    <li class="post" data-id"${doc.id}">
        <a href="/test-preview-single.html?id=${encodeURIComponent(
          doc.id
        )}&title=${encodeURIComponent(
          doc.data().title
        )}&image=${encodeURIComponent(
          doc.data().image
        )}&description=${encodeURIComponent(
          doc.data().description
        )}" class="post_title">${doc.data().title}</a>
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
  const heroImg = document.querySelector("header img");
  const pageTitle = document.querySelector("header h1");
  const pageDescription = document.querySelector("section p");

  heroImg.setAttribute("src", post.image);
  pageTitle.textContent = post.title;
  pageDescription.textContent = post.description;
}
