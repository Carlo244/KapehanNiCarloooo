document.addEventListener("DOMContentLoaded", () => {
  const menuData = [
    {
      id: 1,
      name: "Signature Espresso Blend",
      description: "Bold and aromatic, with hints of chocolate and nut.",
      price: 150,
    },
    {
      id: 2,
      name: "Matcha Latte",
      description: "Creamy matcha paired with your choice of milk.",
      price: 180,
    },
    {
      id: 3,
      name: "Homemade Cheesecake",
      description: "Rich, creamy, and irresistibly delightful.",
      price: 200,
    },
    {
      id: 4,
      name: "Avocado Toast",
      description:
        "Fresh avocado on artisanal bread, topped with a drizzle of olive oil.",
      price: 160,
    },
    {
      id: 5,
      name: "Cold Brew",
      description: "Smooth and refreshing, steeped to perfection.",
      price: 140,
    },
    {
      id: 6,
      name: "Bagels with Cream Cheese",
      description:
        "Fluffy bagels served with a generous spread of cream cheese.",
      price: 120,
    },
    {
      id: 7,
      name: "Chocolate Croissant",
      description: "Flaky pastry filled with velvety chocolate goodness.",
      price: 100,
    },
    {
      id: 8,
      name: "Seasonal Fruit Bowl",
      description: "A colorful mix of fresh fruits to brighten your day.",
      price: 170,
    },
    {
      id: 9,
      name: "Iced Caramel Latte",
      description: "A sweet treat with caramel and espresso over ice.",
      price: 190,
    },
    {
      id: 10,
      name: "Pain Au chocolat",
      description: "French pastry, often translated as chocolate bread, consisting of a flaky, buttery croissant dough wrapped around dark chocolate batons.",
      price: 215,
    },
  ];

  let currentOrder = {}; // Object to store order: { itemId: { name, price, quantity }, ... }

  // --- DOM Elements ---
  const menuTableBody = document.getElementById("menu-table-body");
  const orderedItemsList = document.getElementById("ordered-items-list");
  const totalPriceElement = document.getElementById("total-price");
  const paymentAmountInput = document.getElementById("payment-amount");
  const payButton = document.getElementById("pay-button");
  const changeInfoElement = document.getElementById("change-info");

  // --- Functions ---

  // Render Menu Items into the Table Body
  function renderMenuTable() {
    menuTableBody.innerHTML = ""; // Clear existing items
    menuData.forEach((item) => {
      const row = document.createElement("tr");

      // Add cells for item details
      row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.price.toFixed(2)}</td>
                <td><input class="quantity-input" type="number" id="qty-${
                  item.id
                }" value="" min="1"></td>
                <td><button class="add-btn" data-id="${
                  item.id
                }">Add</button></td>
            `;
      menuTableBody.appendChild(row);
    });
    // Add event listeners AFTER buttons are added to the DOM
    addEventListenersToButtons();
  }

  // Add listeners to all 'Add' buttons
  function addEventListenersToButtons() {
    const addButtons = document.querySelectorAll(".add-btn");
    addButtons.forEach((button) => {
      button.addEventListener("click", handleAddToOrder);
    });
  }

  // Handle "Add" button click
  function handleAddToOrder(event) {
    const button = event.target;
    const itemId = parseInt(button.dataset.id);

    // Find the item details from menuData
    const menuItem = menuData.find((item) => item.id === itemId);
    if (!menuItem) {
      console.error("Item not found in menuData for ID:", itemId);
      return;
    }

    const itemName = menuItem.name;
    const itemPrice = menuItem.price;

    // Find the quantity input specific to this item/row
    const quantityInput = document.getElementById(`qty-${itemId}`);
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    // Add or update item in the order
    if (currentOrder[itemId]) {
      currentOrder[itemId].quantity += quantity;
    } else {
      currentOrder[itemId] = {
        name: itemName,
        price: itemPrice,
        quantity: quantity,
      };
    }

    // Reset quantity input for this item
    quantityInput.value = "";

    // Update the display
    renderOrder();
    calculateTotal();
    changeInfoElement.textContent = ""; // Clear change info on new order item
    paymentAmountInput.value = ""; // Clear payment amount
  }

  // Render Ordered Items List
  function renderOrder() {
    orderedItemsList.innerHTML = ""; // Clear existing list
    if (Object.keys(currentOrder).length === 0) {
      orderedItemsList.innerHTML = "<li>No items added yet.</li>";
      return;
    }
    for (const itemId in currentOrder) {
      const item = currentOrder[itemId];
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <span>${item.name}</span>
                <span>Qty: ${item.quantity}</span>
                <button class="remove-btn" data-id="${itemId}">Remove</button>
            `;
      orderedItemsList.appendChild(listItem);
    }
    // Add event listeners to the "Remove" buttons
    addEventListenersToRemoveButtons();
  }

  // Add listeners to all 'Remove' buttons
  function addEventListenersToRemoveButtons() {
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach((button) => {
      button.addEventListener("click", handleRemoveFromOrder);
    });
  }

  // Handle "Remove" button click
  function handleRemoveFromOrder(event) {
    const button = event.target;
    const itemIdToRemove = parseInt(button.dataset.id);

    if (currentOrder[itemIdToRemove]) {
      if (currentOrder[itemIdToRemove].quantity > 1) {
        currentOrder[itemIdToRemove].quantity -= 1;
      } else {
        delete currentOrder[itemIdToRemove];
      }
      renderOrder();
      calculateTotal();
      changeInfoElement.textContent = ""; // Clear change info
      paymentAmountInput.value = ""; // Clear payment amount
    }
  }

  // Calculate and Display Total Price
  function calculateTotal() {
    let total = 0;
    for (const itemId in currentOrder) {
      const item = currentOrder[itemId];
      total += item.price * item.quantity;
    }
    totalPriceElement.textContent = total.toFixed(2);
    return total;
  }
  const completedOrdersContainer = document.getElementById(
    "completed-orders-container"
  );
  // Handle Payment
  function handlePayment() {
    const total = calculateTotal();
    const amountPaid = parseFloat(paymentAmountInput.value);

    if (total === 0 && Object.keys(currentOrder).length === 0) {
      alert("No items in the order.");
      return;
    }

    if (isNaN(amountPaid) || amountPaid <= 0) {
      alert("Please enter valid payment amount.");
      return;
    }

    if (amountPaid < total) {
      alert(
        `Insufficient payment. Need ${(total - amountPaid).toFixed(
          2
        )} PHP more.`
      );
    } else {
      const change = amountPaid - total;
      alert(
        `Thank you for choosing Kapehan ni Carloooo!\nPayment successful! Change: ${change.toFixed(
          2
        )} PHP 
        \nMay this small transaction translate into a moment of pure enjoyment for you. We believe in the simple pleasure of a good cup, and we're so glad you chose to share that with us today.\nUntil our paths cross again.`
      );
      paymentAmountInput.value = ""; // Clear payment only on success

      // --- Display completed order at the bottom ---
      if (Object.keys(currentOrder).length > 0) {
        const completedOrderDiv = document.createElement("div");
        completedOrderDiv.classList.add("completed-order"); // Add a class for styling

        let orderDetailsHTML = "<h3>Order Details:</h3><ul>";
        for (const itemId in currentOrder) {
          const item = currentOrder[itemId];
          orderDetailsHTML += `<li>${item.name} - Qty: ${
            item.quantity
          } - Price: ${item.price.toFixed(2)} PHP</li>`;
        }
        orderDetailsHTML += "</ul>";

        const paymentDetailsHTML = `
                <p><strong>Total:</strong> ${total.toFixed(2)} PHP</p>
                <p><strong>Payment:</strong> ${amountPaid.toFixed(2)} PHP</p>
                <p><strong>Change:</strong> ${change.toFixed(2)} PHP</p>
                <hr>
            `;

        completedOrderDiv.innerHTML = orderDetailsHTML + paymentDetailsHTML;
        completedOrdersContainer.appendChild(completedOrderDiv);
      }

      // --- Reset the cart ---
      currentOrder = {};
      renderOrder();
      calculateTotal();
    }
  }
  // --- DOM Elements (Add these new elements) ---
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  // --- Functions (Add this new function) ---
  function filterMenu(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredMenu = menuData.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.price.toString().includes(lowerCaseSearchTerm)
      );
    });
    renderFilteredMenu(filteredMenu);
  }

  function renderFilteredMenu(menuItems) {
    menuTableBody.innerHTML = ""; // Clear existing items
    menuItems.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.price.toFixed(2)}</td>
            <td><input class="quantity-input" type="number" id="qty-${
              item.id
            }" value="" min="1"></td>
            <td><button class="add-btn" data-id="${item.id}">Add</button></td>
        `;
      menuTableBody.appendChild(row);
    });
    addEventListenersToButtons(); // Re-add listeners to the new buttons
  }

  // --- Event Listeners (Add this new listener) ---
  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    filterMenu(searchTerm);
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    filterMenu(searchTerm);
  });

  // Modify the initial render to use the original function name
  renderMenuTable();

  // --- Initial Setup ---
  renderMenuTable(); // Dynamically create the table rows and add listeners
  renderOrder(); // Render empty order initially
  calculateTotal(); // Calculate initial total (0.00)

  // Add event listener for Pay button
  payButton.addEventListener("click", handlePayment);
}); // End DOMContentLoaded

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});
