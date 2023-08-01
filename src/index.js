// ---- Global ---- //
const BASE_URL = "http://localhost:3000/toys"

const toyCollection = document.querySelector("#toy-collection");

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

    addNewToy();

    toyForm.reset();
  })
});

// Fetch Andy's Toys
function getToys() {
  fetch(`${BASE_URL}`)
  .then(function(response) {
    if(response.ok) {
      return response.json()
    } else {
      throw new Error(`${response.status}: ${response.statusText}
      `)
    }
  })
  .then(function(response) {
    // Once toys are fetched, render a card forEach toy by calling renderToys
    response.forEach(function(toy) {
      renderToys(toy)
    })
  })
  .catch(function(err) {
    console.log(err)
  })
};
getToys();

// Create toy cards
function renderToys(toys) {
  const toyCard = document.createElement("div");
  toyCard.id = "toy-card";
  toyCard.className = "card";

  // Adding toy info
  const toyName = document.createElement("h2");
  toyName.textContent = toys.name;

  const toyImage = document.createElement("img");
  toyImage.src = toys.image;
  toyImage.className = "toy-avatar";
  
  const toyLikes = document.createElement("p");
  toyLikes.innerText = `Likes: ${toys.likes}`;

  const likesBttn = document.createElement("button");
  likesBttn.id = toys.id;
  likesBttn.className = "like-bttn";
  likesBttn.innerText = "Like";
  likesBttn.addEventListener("click", (e) => {
    e.stopPropagation
    ++toys.likes
    toyLikes.innerText = `Likes: ${toys.likes}`

    // PATCH request
    fetch(`${BASE_URL}/${toys.id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({"likes": toys.likes})
    }
  })
  
  const deleteBttn = document.createElement("button");
  deleteBttn.className = "delete-bttn";
  deleteBttn.textContent = "Delete"
  deleteBttn.addEventListener("click", (e) => {
    e.stopPropagation

    // DELETE request
    fetch(`${BASE_URL}/${toys.id}`, {
      method: "DELETE"
    })
    .then(function(response) {
      return response.json();
    })
    .then(function() {
      toyCard.remove();
    })
  })

  toyCard.append(toyName, toyImage, toyLikes, likesBttn, deleteBttn);

  toyCollection.append(toyCard);
};

function addNewToy() {
  // POST request
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": "Jessie",
      "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
      "likes": 0
    })
  })
  .then(function(response) {
    return response.json()
  })
  .then(function(toys) {
    renderToys(toys)
  });
};