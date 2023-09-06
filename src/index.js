const API = "http://localhost:3000/toys";
const toyCollection = document.getElementById("toy-collection");

// function el(elementName) {
//   return document.getElementById(elementName)
// };

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");

  let addToy = false;
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    createNewToy();
    toyForm.reset();
  })
});

function getToys() {
  fetch(API)
  .then(resp => resp.json())
  .then(renderToys)
};
getToys();

function renderToys(toys) {
  // console.log(toys)
  toys.forEach(renderToy)
}

function renderToy(toys) {
  const toyCard = document.createElement("div");
  toyCard.className = "card";

  toyCollection.append(toyCard);

  const toyName = document.createElement("h2");
  toyName.className = "toy-name";
  toyName.textContent = toys.name;

  const toyImage = document.createElement("img");
  toyImage.className = "toy-avatar";
  toyImage.src = toys.image;

  const toyLikes = document.createElement("p");
  toyLikes.textContent = toys.likes;

  const likesButton = document.createElement("button");
  likesButton.className = "like-btn"
  likesButton.id = toys.id;
  likesButton.textContent = "Like ❤️"

  likesButton.addEventListener("click", (e) => {
    e.stopPropagation();
    ++toys.likes;
    toyLikes.innerText = `${toys.likes}`

    fetch(`${API}/${toys.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "likes": toys.likes
      })
    })
  })

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.id = toys.id;
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();

    fetch(`${API}/${toys.id}`, {
      method: "DELETE"
    })
    .then(resp => resp.json())
    .then(() => toyCard.remove())
  })

  toyCard.append(toyName, toyImage, toyLikes, likesButton, deleteButton);
};

function createNewToy() {

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": "Jessie",
      "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
      "likes": 0
    })
  })
  .then(resp => resp.json())
  .then(newToy => renderToy(newToy))
};