'use strict';

/*global $*/

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  checkedItemsHidden: false
};

function generateItemElement(item, itemIndex, template){
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
      </div>
    </li>
  `;
}

function generateShoppingItemsString(shoppingList){
  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}

function hideCheckedItems(list) {
  if (list.checkedItemsHidden === true) {
    return list.items.filter(item => item.checked === false);
  } else {
    return list.items;
  }
}

function filterList(list) {
  // runs through all list filters
  return hideCheckedItems(list);
}

function renderShoppingList() {
  // this function will be responsible for rendering the shopping list in the DOM
  const filteredList = filterList(STORE);
  const shoppingListItemsString = generateShoppingItemsString(filteredList);

  //html gets targetting and insert into DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName){
  console.log(`adding "${itemName}" to the shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteItemFromList(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItemFromList(parseInt(itemIndex, 10));
    renderShoppingList();
  });
}

function setCheckedItemsHidden(isChecked) {
  STORE.checkedItemsHidden = isChecked;
}

function handleHideCheckedItemsToggle() {
  $('#hide-checked-items').click(function() {
    const isChecked = $(this)[0].checked;
    setCheckedItemsHidden(isChecked);
    renderShoppingList();
  });
}

function handleSearchSubmit() {
  $('#shopping-list-filters').submit(function() {
    event.preventDefault();
    const inquiry = $('.js-shopping-list-search').val();
    console.log(inquiry);
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedItemsToggle();
  handleSearchSubmit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);