const apiProducts = 'http://localhost:3000/api/products/';

const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPriceAmount = document.getElementById('totalPrice');

const orderButton = document.getElementById('order');
const cartAndFormContainer = document.getElementById('cartAndFormContainer');

let quantityInputs;
let quantityInputsArray;

let deleteItemElements;
let cart;

function displayOrderButton() {
  orderButton.style = `background-color: grey
    `;
  orderButton.addEventListener('mouseover', () => {
    orderButton.style = `box-shadow: none;
     cursor: default;
     background-color: grey;
     pointer-events: none`;
  });
  cartAndFormContainer.firstElementChild.textContent =
    'Votre panier est vide 😢';
}

const getCart = () => {
  const data = localStorage.getItem('kanap');
  if (data === null) {
    return [];
  } else {
    return JSON.parse(data);
  }
};

cart = getCart();

// Add article
function displayCart() {
  cart = getCart();
  cart.forEach((element) => {
    let id = element.id;
    let color = element.color;
    let quantity = element.quantity;

    fetch(apiProducts + id)
      .then((res) => res.json())
      .then((kanap) => {
        addArticle(kanap, color, quantity);
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

  divContentSettingsQuantity
    .querySelector('.itemQuantity')
    .addEventListener('click', (e) => {
      updateQuantity(kanap._id, color, e.target.value);
    });

  // Add cartArticle content settings delete

  const divContentSettingsDelete = document.createElement('div');

  divContentSettings.appendChild(divContentSettingsDelete);
  divContentSettingsDelete.classList.add(
    'cart__item__content__settings__delete'
  );
  divContentSettingsDelete.innerHTML = ` <p class="deleteItem">Supprimer</p>`;

  divContentSettingsDelete
    .querySelector('.deleteItem')
    .addEventListener('click', () => {
      deleteKanap(kanap._id, color, cartArticle);
    });
}

function getTotal() {
  let totaleQte = 0;
  let totalPrice = 0;
  let cart = getCart();

  totalQuantity.textContent = totaleQte;
  totalPriceAmount.textContent = totalPrice;

  for (let product of cart) {
    fetch(apiProducts + product.id)
      .then((res) => res.json())
      .then((kanap) => {
        totaleQte += Number(product.quantity);
        totalPrice += kanap.price * product.quantity;
        totalQuantity.textContent = totaleQte;
        totalPriceAmount.textContent = totalPrice;
      });
  }
}

function updateQuantity(id, color, value) {
  let cart = getCart();

  for (let kanap of cart) {
    if (kanap.id === id && kanap.color === color) {
      kanap.quantity = Number(value);
    }
  }
  localStorage.setItem('kanap', JSON.stringify(cart));
  getTotal();
}

function deleteKanap(id, color, target) {
  let cart = getCart();

  const cartIndex = cart.findIndex(
    (item) => item.id === id && item.color === color
  );

  if (cart.length > 1) {
    cart.splice(cartIndex, 1);
    localStorage.setItem('kanap', JSON.stringify(cart));
    target.remove();
  } else {
    localStorage.removeItem('kanap');
    target.remove();
    displayOrderButton();
  }
  getTotal();
}

displayCart();
getTotal();

// **************************************************************

const form = document.querySelector('.cart__order__form');

const NAME_REGEX = /^[a-zA-Z-éèàùêçëâï]+[ -]?[a-zA-Z-éèàùêçëâï]+$/;
const ADDRESS_REGEX = /^[\w\s-']+$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const elements = form.elements;

const fieldsValidation = {
  firstName: null,
  lastName: null,
  address: null,
  city: null,
  email: null,
};

if (cart == '') {
  displayOrderButton();
}

for (let element of elements) {
  element.addEventListener('input', (e) => {
    const itemsNames = {
      firstName: 'prénom',
      lastName: 'nom',
      address: 'adresse',
      city: 'ville',
      email: 'email',
    };

    if (e.target.value.trim() === '') {
      element.nextElementSibling.textContent = 'Champ vide !';
      element.style.border = '3px solid red';
    } else {
      if (
        element.name == 'firstName' ||
        element.name == 'lastName' ||
        element.name == 'city'
      ) {
        if (!NAME_REGEX.test(e.target.value)) {
          element.nextElementSibling.textContent = `Veuillez entrer un(e) ${
            itemsNames[element.name]
          } correct !`;
          element.style.border = '3px solid red';
          fieldsValidation[element.name] = false;
        } else {
          element.style.border = '3px solid green';
          element.nextElementSibling.textContent = '';
          fieldsValidation[element.name] = true;
        }
      }

      if (element.name == 'email') {
        if (!EMAIL_REGEX.test(e.target.value)) {
          element.nextElementSibling.textContent = `Veuillez entrer un ${
            itemsNames[element.name]
          } correct !`;
          element.style.border = '3px solid red';
          fieldsValidation[element.name] = false;
        } else {
          element.style.border = '3px solid green';
          element.nextElementSibling.textContent = '';
          fieldsValidation[element.name] = true;
        }
      }

      if (element.name == 'address') {
        if (!ADDRESS_REGEX.test(e.target.value)) {
          element.nextElementSibling.textContent = `Veuillez entrer une ${
            itemsNames[element.name]
          } correcte !`;
          element.style.border = '3px solid red';
          fieldsValidation[element.name] = false;
        } else {
          element.style.border = '3px solid green';
          element.nextElementSibling.textContent = '';
          fieldsValidation[element.name] = true;
        }
      }
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isFormValid = Object.values(fieldsValidation).every(
    (formField) => formField === true
  );

  if (isFormValid) {
    let contact = {};
    let products = [];

    for (const element of cart) {
      products = [...products, element.id];
    }

    const formData = new FormData(form);
    for (let [key, value] of formData) {
      contact[key] = value;
    }
    let data = { contact, products };

    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        localStorage.removeItem('kanap');
        window.location.href = `./confirmation.html?orderId=${response.orderId}`;
      });
  }
});
