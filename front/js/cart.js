const apiProducts = 'http://localhost:3000/api/products/';

const cartItems = document.getElementById('cart__items');
const totalQuantity = document.getElementById('totalQuantity');
const totalPriceAmount = document.getElementById('totalPrice');

let quantityInputs;
let quantityInputsArray;

let deleteItemElements;
let cart;

function displayOrderButton() {
  if (cart == '' || cart == null || cart == []) {
    console.log('test');
    document.getElementById('order').style.visibility = 'hidden';
  }
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

  // Add cartArticle content settings delete

  const divContentSettingsDelete = document.createElement('div');

  divContentSettings.appendChild(divContentSettingsDelete);
  divContentSettingsDelete.classList.add(
    'cart__item__content__settings__delete'
  );
  divContentSettingsDelete.innerHTML = ` <p class="deleteItem">Supprimer</p>`;
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
        totaleQte += parseInt(product.quantity);
        totalPrice += kanap.price * product.quantity;
        totalQuantity.textContent = totaleQte;
        totalPriceAmount.textContent = totalPrice;
      });
  }
}

function updateQuantity() {
  let itemId;
  let itemColor;

  quantityInputs = document.getElementsByClassName('itemQuantity');
  quantityInputsArray = [...quantityInputs];

  quantityInputsArray.forEach((item) => {
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
}

function deleteKanap() {
  let itemId;
  let itemColor;

  const deleteItemElements = document.getElementsByClassName('deleteItem');
  const deleteItemElementsArray = [...deleteItemElements];
  console.log(deleteItemElementsArray);

  deleteItemElementsArray.forEach((element) => {
    element.addEventListener('click', () => {
      let cart = getCart();
      itemId = element.closest('article').getAttribute('data-id');
      itemColor = element.closest('article').getAttribute('data-color');

      const cartIndex = cart.findIndex(
        (item) => item.id === itemId && item.color === itemColor
      );

      if (cart.length > 1) {
        cart.splice(cartIndex, 1);
        localStorage.setItem('kanap', JSON.stringify(cart));
        element.closest('article').remove();
      } else {
        localStorage.removeItem('kanap');
        element.closest('article').remove();
        document.getElementById('order').style.visibility = 'hidden';
      }
      getTotal();
      console.log(cart);
    });
  });
}

displayCart();
getTotal();

window.addEventListener('load', () => {
  updateQuantity();
  deleteKanap();
});

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
  document.getElementById('order').style.visibility = 'hidden';
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
console.log(cart);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const isFormValid = Object.values(fieldsValidation).every(
    (formField) => formField === true
  );
  console.log(fieldsValidation);
  console.log(isFormValid);

  let contact = {};

  const formData = new FormData(form);
  for (let [key, value] of formData) {
    contact[key] = value;
  }
  console.log(contact);
});
