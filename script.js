const form = document.querySelector('form');
const addItem = document.getElementById("addItem");
const listItems = document.querySelector('ul');
const message = document.querySelector('.message');
const filter = document.querySelector('.filterItems');
const itemCount = document.getElementById('itemCount');
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Form Submitted");
});

// Add Item
addItem.addEventListener("click", () => {
  console.log("Add Item Clicked");
  const inputItem = document.getElementById('inputItem').value;
  if(inputItem === ''){
    message.textContent = "Text field can't be empty. Please enter an item!";
    message.classList.add('alert');
    setTimeout((e) => {
      message.textContent = '';
      message.classList.remove('alert');
    }, 1000);
    return;
  }

  const id = Date.now();
  const li = document.createElement('li');
  li.textContent = inputItem;
  li.dataset.id = id;

  const span = document.createElement('button');
  span.className = 'removeItem';
  span.textContent = ' Remove';
  li.appendChild(span);
  listItems.appendChild(li);
  updateItemCount();
  document.getElementById('inputItem').value = '';
  message.textContent = `Item added!`;
  message.classList.add('success');

  // save the item to the local storage
  const storedItems = getStoredItems();

  const newItem = {
    id: Date.now(),      // 👈 ID is generated HERE
    text: inputItem,
  };

  storedItems.push(newItem);
  saveItems(storedItems);

  setTimeout((e) => {
    message.textContent = '';
    message.classList.remove('success');
  }, 1000);

  // Lets show the filter input field here if it's hidden
  if(filter.style.display === 'none' && listItems.children.length > 0){
    filter.style.display = 'block';
  }

});

// Remove Item from list
listItems.addEventListener( 'click', (e) => {
  if(e.target.classList.contains('removeItem')){
    const li = e.target.parentElement;

    // get id from clicked li
    const id = Number(li.dataset.id);

    // Remove from dom
    li.remove();

    // Get stored local storage
    let storedItems = getStoredItems();

    // Remove the list item by id
    storedItems = storedItems.filter(item => item.id !== id);

    //Save the updated list to local storage
    saveItems(storedItems);

    message.textContent = `Item removed!`;
    message.classList.add('alert');
    setTimeout((e) => {
      message.textContent = '';
      message.classList.remove('alert');
    }, 1000);

    toggleFilterVisibility();
    updateItemCount();
  }
});

//On hover of list items lets change the background color to yellow
listItems.addEventListener('mouseover', (e) => {
  const li = e.target.closest('li');
  if(li){
    li.style.backgroundColor = 'yellow';
  }
});

// on hover out of list items lets remove the background color
listItems.addEventListener('mouseout', (e) => {
  const li = e.target.closest('li');
  if(li){
    li.style.backgroundColor = '';
  }
});

// Clear All
const clearButton = form.querySelector('#clearButton');
if(clearButton) {
  clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    //lets take confirmation just before the message div

    // Prevent multiple confirmation boxes
    if (document.querySelector('.confirmation-box')) return;

    const confirmationBox = document.createElement('div');
    const confirmButtonsWrap = document.createElement('div');
    confirmButtonsWrap.className = 'confirm-buttons-wrap';
    confirmationBox.textContent = 'Are you sure you want to clear all items?';
    confirmationBox.className = 'confirmation-box';
    message.appendChild(confirmationBox);
    const yesBtn = document.createElement('button');
    yesBtn.className = 'confirm-button';
    yesBtn.textContent = 'Yes';
    const noBtn = document.createElement('button');
    noBtn.className = 'reject-button';
    noBtn.textContent = 'No';
    confirmButtonsWrap.appendChild(yesBtn);
    confirmButtonsWrap.appendChild(noBtn);
    confirmationBox.appendChild(confirmButtonsWrap);

    yesBtn.addEventListener('click', () => {
      localStorage.removeItem('items');
      listItems.innerHTML = '';
      message.textContent = `All items removed!`;
      message.classList.add('alert');
      setTimeout((e) => {
        message.textContent = '';
        message.classList.remove('alert');
      }, 1000);
      updateItemCount();
    });
    noBtn.addEventListener('click', () => {
        message.textContent = '';
        message.classList.remove('alert');
    });
  });
}

function getStoredItems() {
  return JSON.parse(localStorage.getItem('items')) || [];
}

function saveItems(items) {
  localStorage.setItem('items', JSON.stringify(items));
}

// Load items from local storage on page load and hide the input filter for filterItems
document.addEventListener('DOMContentLoaded', () => {
  const storedItems = getStoredItems();
  storedItems.forEach(item => {
    const li = document.createElement('li');
    li.dataset.id = item.id;
    li.textContent = item.text;

    const span = document.createElement('button');
    span.className = 'removeItem';
    span.textContent = ' Remove';
    li.appendChild(span);
    listItems.appendChild(li);
  });
  toggleFilterVisibility();
  updateItemCount();

});


// Filter the list items on input of filterItems.
filter.addEventListener('input', (e) => {
  const input = e.target;
  const items = Array.from(listItems.children);
  const filterValue = e.target.value.toLowerCase();
  console.log('Jazz');
  console.log('Iems');
  console.log(items);
  let count = 0;
  items.forEach(item => {
    const text = item.firstChild.textContent.toLowerCase();
    // lets increment the value of count if it's visible
    if(text.includes(filterValue)){
      count++;
    }
    item.style.display = text.includes(filterValue) ? '' : 'none';
  });

  itemCount.textContent = count;
});
listItems.parentElement.prepend(filter);


function toggleFilterVisibility() {
  console.log('filter called');
  const hasItems = listItems.querySelectorAll('li').length > 0;
  console.log(hasItems);
  filter.style.display = hasItems ? 'block' : 'none';
}

function updateItemCount() {
  const count = listItems.children.length;
  itemCount.textContent = count;
}
