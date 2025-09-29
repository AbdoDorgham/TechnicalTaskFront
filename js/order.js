const API_BASE_URL = "https://admindemo.boniantech.com/callprophetsTest" 
const API_ENDPOINTS = {
  getOrderById: "/api/Order/GetOrderById",
  addOrder: "/api/Order/AddOrder",
  getOrdersByCustomerId: "/api/Order/GetOrdersByCustomerId",
  deleteOrder: "/api/Order/Delete",
}
let authToken = localStorage.getItem("authToken")
let payloadBase64 = authToken.split('.')[1];
let currentUser = JSON.parse(atob(payloadBase64));
let orders = []
const mainSection = document.getElementById("mainSection")
 const userInfo = document.getElementById("userInfo")
 const welcomeMessage = document.getElementById("welcomeMessage")
const alertContainer = document.getElementById("alertContainer")
const orderForm = document.getElementById("orderForm")
const createOrderBtn = document.getElementById("createOrderBtn")
const refreshOrdersBtn = document.getElementById("refreshOrdersBtn")
const logoutBtn = document.getElementById("logoutBtn")
const ordersContainer = document.getElementById("ordersContainer")
const loadingSpinner = document.getElementById("loadingSpinner")
const ordersTable = document.getElementById("ordersTable")
const userEmail = currentUser?.UserName || "User"
welcomeMessage.textContent = `Welcome, ${userEmail}`

function showAlert(message, type = "success") {
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.textContent = message
  alertContainer.appendChild(alert)
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert)
    }
  }, 4000)
}

function clearAlerts() {
  alertContainer.innerHTML = ""
}

function showLoading(show = true) {
  loadingSpinner.style.display = show ? "block" : "none"
}

async function makeApiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",

    },
  }

  if (authToken) {
    defaultOptions.headers["Authorization"] = `Bearer ${authToken}`
  }
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }
  try {
    const response = await fetch(url, finalOptions)

    if (response.status === 401) {
      redirectToLogin()
      throw new Error("Unauthorized access")
    }
     const data = await response.json();
     return data ;
  } catch (error) {
    console.error("API Request Error:", error)
    throw error
  }
}


function redirectToLogin() {
  localStorage.removeItem("authToken")
  authToken = null
  currentUser = null
  showAuthSection()
  showAlert("Session expired. Please login again.", "warning")
}



async function createOrder(orderData) {
  try {
    const res = await makeApiRequest(API_ENDPOINTS.addOrder, {
      method: "POST",
      body: JSON.stringify(orderData),
    })
    if(res.isFail){
      showAlert(res.message,"warning");
       orderForm.reset()
      return;
    }
    showAlert("Order created successfully!", "success")
    orderForm.reset()
    loadOrders() 
  } catch (error) {
    showAlert(`Failed to create order: ${error.message}`, "error")
  }
}

async function loadOrders() {
  try {
    showLoading(true)

    let endpoint = API_ENDPOINTS.getOrdersByCustomerId

    const response = await makeApiRequest(endpoint);
    const data = response.returnedObj ;
    orders = Array.isArray(data) ? data : data.orders || []
    displayOrders()
    showAlert(`Loaded ${orders.length} orders`, "success")
  } catch (error) {
    showAlert(`Failed to load orders: ${error.message}`, "error")
    displayOrders([]) 
  } finally {
    showLoading(false)
  }
}

async function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) {
    return
  }
  try {
    await makeApiRequest(`${API_ENDPOINTS.deleteOrder}/${orderId}`, {
      method: "DELETE",
    })
    showAlert("Order deleted successfully!", "success")
    loadOrders() 
  } catch (error) {
    showAlert(`Failed to delete order: ${error.message}`, "error")
  }
}


function displayOrders(ordersToDisplay = orders) {
  if (ordersToDisplay.length === 0) {
    ordersTable.innerHTML = `
            <div class="empty-state">
                <h3>No orders found</h3>
                <p>Create your first order using the form on the left.</p>
            </div>
        `
    return
  }
  const tableHTML = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order Number</th>
                    <th>Title</th>
                    <th>Details</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${ordersToDisplay
                  .map(
                    (order) => `
                    <tr>
                        <td>#${order.id || "N/A"}</td>
                        <td>${order.title || order.title || "N/A"}</td>
                        <td>${order.details || "N/A"}</td>
                        <td>$${(order.price || 0).toFixed(2)}</td>
                        <td class="order-actions">
                            <button class="btn btn-danger" onclick="deleteOrder(${order.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `
  ordersTable.innerHTML = tableHTML
}

document.addEventListener("DOMContentLoaded", () => {
    loadOrders()
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    clearAlerts()

    const orderData = {
      title: document.getElementById("title").value,
      details: document.getElementById("details").value,
      price: Number.parseFloat(document.getElementById("price").value),
      customerId: currentUser?.id || null,
    }
    await createOrder(orderData)
  })

  refreshOrdersBtn.addEventListener("click", () => {
    clearAlerts()
    loadOrders()
  })

  logoutBtn.addEventListener("click", logout)
})

function logout() {
  localStorage.removeItem("authToken")
  authToken = null
  currentUser = null
  orders = []
  showAlert("Logged out successfully!", "success")
  window.location.href = 'index.html';
}
