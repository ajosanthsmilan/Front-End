const API_URL = "https://dummyjson.com/users";
const userContainer = document.getElementById("userContainer");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");
const commentBox = document.getElementById("commentBox");
const submitComment = document.getElementById("submitComment");
const searchBtn = document.getElementById("searchBtn");
const getStartedBtn = document.getElementById("getStartedBtn");

// Pagination variables
let allUsers = [];
let currentPage = 1;
const usersPerPage = 6;

// Fetch users
async function fetchUsers() {
  try {
    loader.style.display = "block";
    const res = await fetch(API_URL);
    const data = await res.json();
    loader.style.display = "none";
    allUsers = data.users;
    displayUsers(allUsers);
    createPaginationControls();
  } catch {
    loader.style.display = "none";
    userContainer.innerHTML = "<p>⚠️ Failed to fetch user data.</p>";
  }
}

// Display users with pagination
function displayUsers(users) {
  userContainer.innerHTML = "";

  if (users.length === 0) {
    userContainer.innerHTML = "<p>⚠️ User not found. Please try again.</p>";
    return;
  }

  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const paginatedUsers = users.slice(start, end);

  paginatedUsers.forEach(user => {
    const card = document.createElement("div");
    card.classList.add("user-card");
    card.innerHTML = `
      <img src="${user.image}" alt="${user.firstName}" />
      <h3>${user.firstName} ${user.lastName}</h3>
    `;
    card.addEventListener("click", () => openModal(user));
    userContainer.appendChild(card);
  });

  updatePaginationControls(users.length);
}

// Modal
function openModal(user) {
  modal.classList.remove("hidden");
  document.getElementById("modalName").textContent = `${user.firstName} ${user.lastName}`;
  document.getElementById("modalEmail").textContent = `📧 ${user.email}`;
  document.getElementById("modalCompany").textContent = `🏢 ${user.company.name}`;
  document.getElementById("modalAddress").textContent = `📍 ${user.address.city}, ${user.address.state}`;
}

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

// Search
searchInput.addEventListener("input", handleSearch);
searchBtn.addEventListener("click", handleSearch);

function handleSearch() {
  const term = searchInput.value.toLowerCase().trim();

  currentPage = 1; // reset to first page

  if (term === "") {
    displayUsers(allUsers);
    return;
  }

  const filtered = allUsers.filter(user =>
    user.firstName.toLowerCase().includes(term) ||
    user.lastName.toLowerCase().includes(term)
  );

  displayUsers(filtered);
  createPaginationControls(filtered);
}

// Comment
submitComment.addEventListener("click", () => {
  const comment = commentBox.value.trim();
  if (comment) {
    alert(`✅ Comment submitted: "${comment}"`);
    commentBox.value = "";
  } else {
    alert("⚠️ Please enter a comment before submitting!");
  }
});

// Auth redirect
if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "index.html";
}

// Scroll on "Get Started"
getStartedBtn.addEventListener("click", () => {
  document.querySelector(".main-container").scrollIntoView({ behavior: "smooth" });
});

// 🔽 Pagination Controls
function createPaginationControls(filteredUsers = allUsers) {
  let existingPagination = document.getElementById("paginationControls");
  if (existingPagination) existingPagination.remove();

  const pagination = document.createElement("div");
  pagination.id = "paginationControls";
  pagination.style.display = "flex";
  pagination.style.justifyContent = "center";
  pagination.style.gap = "1rem";
  pagination.style.margin = "2rem 0";

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "← Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displayUsers(filteredUsers);
    }
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next →";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayUsers(filteredUsers);
    }
  };

  const pageInfo = document.createElement("span");
  pageInfo.style.padding = "0.5rem 1rem";
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  pagination.appendChild(prevBtn);
  pagination.appendChild(pageInfo);
  pagination.appendChild(nextBtn);

  userContainer.parentNode.appendChild(pagination);
}

function updatePaginationControls(userLength) {
  createPaginationControls(searchInput.value ? allUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchInput.value.toLowerCase())
  ) : allUsers);
}

// 🔥 Search spark effect while typing
searchInput.addEventListener("input", () => {
  searchInput.classList.add("typing");
  setTimeout(() => searchInput.classList.remove("typing"), 400);
});

// Fetch initial users
fetchUsers();
