const apiProducts = 'http://localhost:3000/api/products/';

const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPriceAmount = document.getElementById('totalPrice');

let quantityInputs;
let quantityInputsArray;

let deleteItemElements;

const getCart = () => {
  const data = localStorage.getItem('kanap');
  if (data === null) {
    return [];
  } else {
    return JSON.parse(data);
  }
};

// Add article
async function displayCart() {
  let cart = getCart();
  cart.forEach(async (element) => {
    let id = element.id;
    let color = element.color;
    let quantity = element.quantity;

    await fetch(apiProducts + id)
      .then((res) => res.json())
      .then((kanap) => {
        addArticle(kanap, color, quantity);
      });

    quantityInputs = document.getElementsByClassName('itemQuantity');
    deleteItemElements = document.getElementsByClassName('deleteItem');

    let deleteButton = document.querySelectorAll('.deleteItem');
    console.log(deleteButton);
    deleteButton.forEach((el) => {
      el.addEventListener('click', () => {
        let parent = el.closest('article');
        let idTest = el.closest('article').getAttribute('data-id');
        let colorTest = el.closest('article').getAttribute('data-color');

        console.log(parent);
        deleteKanapTEST(parent, idTest, colorTest);
      });
    });
  });
}

function addArticle(kanap, color, quantity) {
  const cartArticle = document.createElement('article');

  cartItems.appendChild(cartArticle);
  cartArticle.setAttribute('data-id', kanap._id);
  cartArticle.setAttribute('data-color', color);
  cartArticle.classList.add('cart__item');

  // Add cartArticle image

  const divImg = document.createElement('div');
  const cartArticleImage = document.createElement('img');

  cartArticle.appendChild(divImg);
  divImg.classList.add('cart__item__img');
  divImg.appendChild(cartArticleImage);
  cartArticleImage.setAttribute('src', kanap.imageUrl);
  cartArticleImage.setAttribute('alt', kanap.altTxt);

  // Add cartArticle content

  const divContent = document.createElement('div');
  const divContentDescription = document.createElement('div');

  cartArticle.appendChild(divContent);
  divContent.classList.add('cart__item__content');
  divContent.appendChild(divContentDescription);
  divContentDescription.classList.add('cart__item__content__description');
  divContentDescription.innerHTML = `
  <h2>${kanap.name}</h2>
  <p>${color}</p>
  <p>${kanap.price} €</p>`;

  // Add cartArticle content settings

  const divContentSettings = document.createElement('div');
  const divContentSettingsQuantity = document.createElement('div');

  divContentDescription.appendChild(divContentSettings);
  divContentSettings.classList.add('cart__item__content__settings');
  divContentSettings.appendChild(divContentSettingsQuantity);
  divContentSettingsQuantity.classList.add(
    'cart__item__content__settings__quantity'
  );
  divContentSettingsQuantity.innerHTML = `
  <p>Qté :</p>
  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">`;

  // Add cartArticle content settings delete

  const divContentSettingsDelete = document.createElement('div');

  divContentSettings.appendChild(divContentSettingsDelete);
  divContentSettingsDelete.classList.add(
    'cart__item__content__settings__delete'
  );
  divContentSettingsDelete.innerHTML = ` <p class="deleteItem">Supprimer</p>`;
}

async function getTotal() {
  let totaleQte = 0;
  let totalPrice = 0;
  let cart = getCart();

  totalQuantity.textContent = totaleQte;
  totalPriceAmount.textContent = totalPrice;

  for (let product of cart) {
    await fetch(apiProducts + product.id)
      .then((res) => res.json())
      .then((kanap) => {
        totaleQte += parseInt(product.quantity);
        totalPrice += kanap.price * product.quantity;
        totalQuantity.textContent = totaleQte;
        totalPriceAmount.textContent = totalPrice;
      });
  }
}

async function updateQuantity() {
  // setTimeout(() => {
  let itemId;
  let itemColor;

  quantityInputsArray = [...quantityInputs];
  quantityInputsArray.forEach(async (item) => {
    item.addEventListener('change', (e) => {
      let cart = getCart();
      itemId = item.closest('article').getAttribute('data-id');
      itemColor = item.closest('article').getAttribute('data-color');

      for (let kanap of cart) {
        if (kanap.id === itemId && kanap.color === itemColor) {
          kanap.quantity = parseInt(e.target.value);
        }
      }
      localStorage.setItem('kanap', JSON.stringify(cart));
      getTotal();
    });
  });
  // }, 500);
}

// function deleteKanap() {
//   // setTimeout(() => {
//   let itemId;
//   let itemColor;

//   const deleteItemElementsArray = [...deleteItemElements];

//   deleteItemElementsArray.forEach((element) => {
//     element.addEventListener('click', () => {
//       let cart = getCart();
//       itemId = element.closest('article').getAttribute('data-id');
//       itemColor = element.closest('article').getAttribute('data-color');

//       const cartIndex = cart.findIndex(
//         (item) => item.id === itemId && item.color === itemColor
//       );

//       if (cart.length > 1) {
//         cart.splice(cartIndex, 1);
//         localStorage.setItem('kanap', JSON.stringify(cart));
//         element.closest('article').remove();
//       } else {
//         localStorage.removeItem('kanap');
//         element.closest('article').remove();
//       }
//       getTotal();
//     });
//   });
//   // }, 500);
// }

function deleteKanapTEST(el, id, color) {
  let cart = getCart();
  const cartIndex = cart.findIndex(
    (item) => item.id === id && item.color === color
  );

  if (cart.length > 1) {
    cart.splice(cartIndex, 1);
    localStorage.setItem('kanap', JSON.stringify(cart));
    el.closest('article').remove();
  } else {
    localStorage.removeItem('kanap');
    el.closest('article').remove();
  }
  getTotal();
}

displayCart();

getTotal();

deleteKanap();

updateQuantity();
