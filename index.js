let Students = [];
let filteredStudents = [];
let currentPage = 1;
let StudentsPerPage = 10;
let displayingStudents = Students;

function fetchHandler() {
  fetch("https://json-server-8qp6.onrender.com/Students")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Data not found");
      }
      return response.json();
    })
    .then((data) => {
      Students = data;
      filteredStudents = data;
      tableInsertHandler(filteredStudents);
      console.log(Students);
    })
    .catch((error) => {
      console.log(error.message);
    });
}
fetchHandler();

function tableInsertHandler(students) {
  displayingStudents = students;
  const tablebody = document.getElementById("tableBody");
  const NoOfDocuments = document.getElementById("list");
  tablebody.innerHTML = "";
  const start = (currentPage - 1) * StudentsPerPage;
  index = start;
  const end = currentPage * StudentsPerPage;
  slicedStudents = students.slice(start, end);
  const notFound = document.getElementById("notFound");

  if (students && students.length > 0) {
    slicedStudents.forEach((obj) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${obj.name}</td>
        <td>${obj.age}</td>
        <td>${obj.gender}</td>
        <td>${obj.idNumber}</td>
        <td>${obj.dateOfRegistration}</td>
        <td>${obj.city}</td>
        <td>${obj.phoneNumber}</td>
        <td><button class="detailsBtn" data-id="${
          obj.idNumber
        }">Details</button></td>
      `;
      tablebody.appendChild(tr);
      index++;
    });
    if (notFound) {
      notFound.innerText = "";
    }
  } else {
    if (notFound) {
      // notFound.style.display = "block";
      notFound.innerText = "No Records Found";
      table = document.getElementsByClassName("tablee")[0];
      table.style.height = "auto";
    }
  }
  NoOfDocuments.innerText = students.length;
  attachEventHandler();
  renderPaginationControls(students);
}

function searchHandler(event) {
  event.preventDefault();
  const input = document.getElementById("input").value.toLowerCase();
  const sortBy = document.getElementById("FilterBy").value;

  filteredStudents = Students.filter((obj) => {
    if (sortBy !== "gender") {
      return obj[sortBy].toString().toLowerCase().includes(input);
    } else {
      return obj[sortBy].toString().toLowerCase() == input;
    }
  });
  currentPage = 1;
  tableInsertHandler(filteredStudents);
}

document
  .getElementById("searchButton")
  .addEventListener("click", searchHandler);

document.getElementById("FilterBy").addEventListener("change", (e) => {
  const value = e.target.value;
  const inputField = document.getElementById("input");
  inputField.placeholder = `Search by ${value}`;
  inputField.value = "";
  inputField.type = value == "dateOfRegistration" ? "date" : "text";
});

document.getElementById("refresh").addEventListener("click", (event) => {
  event.preventDefault();
  currentPage = 1;
  filteredStudents = Students;
  tableInsertHandler(Students);

  document.getElementById("FilterBy").value = "name";
  const inputField = document.getElementById("input");
  inputField.value = "";
  inputField.type = "text";
  inputField.placeholder = "Search by name";
  cityBox = document.getElementsByClassName("searchDisplay")[0];
  if (cityBox) {
    cityBox.classList = "citySearch";
  }
});

function attachEventHandler() {
  document.querySelectorAll(".detailsBtn").forEach((button) => {
    button.addEventListener("click", detailsHandler);
  });
}

function detailsHandler(event) {
  const studentId = event.target.getAttribute("data-id");
  const student = Students.find((s) => s.idNumber == studentId);
  if (student) {
    localStorage.setItem("selectedStudent", JSON.stringify(student));
    window.location.href = "details.html";
  } else {
    console.log("Student not found");
  }
}

function prevHandler(students) {
  if (currentPage > 1) {
    currentPage = currentPage - 1;
    tableInsertHandler(students);
  }
}

function nextHandler(students) {
  const totalPages = Math.ceil(students.length / StudentsPerPage);
  if (currentPage < totalPages) {
    currentPage = currentPage + 1;
    tableInsertHandler(students);
  }
}

function noOfStudents(e) {
  StudentsPerPage = parseInt(e.target.value);
  currentPage = 1;
  e.value = StudentsPerPage;
  console.log(e);
  tableInsertHandler(displayingStudents);
}

function searchIcon() {
  const searchBox = document.getElementsByClassName("citySearch")[0];
  searchBox.classList.toggle("searchDisplay");
}

const citySearchIcon = document.getElementById("citySearchIcon");
citySearchIcon.addEventListener("click", searchIcon);

function citySubmitHandler(event) {
  event.preventDefault();
}

const citySearchBtn = document.getElementById("citySearchBtn");
citySearchBtn.addEventListener("click", () => {
  const value = document.getElementById("city").value;
  if (value) {
    const error = document.getElementsByClassName("cityError")[0];
    error.classList = "cityError";
    const res = displayingStudents.filter(
      (obj) => obj["city"].toLowerCase() == value.toLowerCase()
    );
    const searchBox = document.getElementsByClassName("citySearch")[0];
    searchBox.classList.toggle("searchDisplay");
    document.getElementById("city").value = "";
    tableInsertHandler(res);
  } else {
    const error = document.getElementsByClassName("cityError")[0];
    error.classList.toggle("cityErrorDisplay");
    setTimeout(() => {
      error.classList = "cityError";
    }, 3000);
  }
});

document.getElementById("cancelError").addEventListener("click", () => {
  const error = document.getElementsByClassName("cityError")[0];
  error.classList.toggle("cityErrorDisplay");
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  const searchBox = document.getElementsByClassName("citySearch")[0];
  searchBox.classList.toggle("searchDisplay");
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("city").value = "";
});

function renderPaginationControls(students) {
  const paginationContainer = document.getElementById("pagination-controls");
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(students.length / StudentsPerPage);

  const select = document.createElement("div");
  select.innerHTML = `
        <select name="noOfStudents" id="noOfStudents">
          <option value="Students">Students/page</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
  `;
  paginationContainer.append(select);
  select.value = StudentsPerPage;
  select.addEventListener("change", noOfStudents);
  const buttons = document.createElement("div");
  buttons.id = "buttons";
  paginationContainer.append(buttons);

  const prevButton = document.createElement("button");
  prevButton.innerText = `<`;
  prevButton.id = "pageBtn";
  prevButton.disabled = currentPage == 1;
  buttons.append(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.id = "pageBtn";
    button.style.color = "black";

    button.addEventListener("click", () => {
      currentPage = i;
      tableInsertHandler(students);
    });
    if (i == currentPage) {
      button.disabled = true;
      button.style.backgroundColor = "#5AB2FF";
      button.style.color = "black";
    }
    buttons.appendChild(button);
  }

  const nextButton = document.createElement("button");
  nextButton.innerText = `>`;
  nextButton.id = "pageBtn";
  nextButton.disabled = currentPage == totalPages;
  buttons.append(nextButton);

  prevButton.addEventListener("click", () => {
    prevHandler(students);
  });
  nextButton.addEventListener("click", () => {
    nextHandler(students);
  });
}

function sortHandler(field, order) {
  const students = [...displayingStudents].sort((a, b) => {
    // document.getElementById(btn).style.color = "rgb(119, 177, 248)";
    if (order === "asc") {
      return a[field].toString().localeCompare(b[field].toString());
    } else {
      return b[field].toString().localeCompare(a[field].toString());
    }
  });
  tableInsertHandler(students);
}

document
  .getElementById("sortNameAsc")
  .addEventListener("click", () => sortHandler("name", "asc"));

document
  .getElementById("sortNameDesc")
  .addEventListener("click", () => sortHandler("name", "desc"));

document
  .getElementById("sortAgeAsc")
  .addEventListener("click", () => sortHandler("age", "asc"));

document
  .getElementById("sortAgeDesc")
  .addEventListener("click", () => sortHandler("age", "desc"));

document
  .getElementById("sortGenderAsc")
  .addEventListener("click", () => sortHandler("gender", "asc"));

document
  .getElementById("sortGenderDesc")
  .addEventListener("click", () => sortHandler("gender", "desc"));

document
  .getElementById("sortIdNumberAsc")
  .addEventListener("click", () => sortHandler("idNumber", "asc"));

document
  .getElementById("sortIdNumberDesc")
  .addEventListener("click", () => sortHandler("idNumber", "desc"));

document
  .getElementById("sortNDateofRegistrationAsc")
  .addEventListener("click", () => sortHandler("dateOfRegistration", "asc"));

document
  .getElementById("sortNDateofRegistrationDesc")
  .addEventListener("click", () => sortHandler("dateOfRegistration", "desc"));

document
  .getElementById("sortCityAsc")
  .addEventListener("click", () => sortHandler("city", "asc"));

document
  .getElementById("sortCityDesc")
  .addEventListener("click", () => sortHandler("city", "desc"));

// document
//   .getElementById("sortPhoneNumberAsc")
//   .addEventListener("click", () => sortHandler("phoneNumber", "asc"));

// document
//   .getElementById("sortPhoneNumberDesc")
//   .addEventListener("click", () => sortHandler("phoneNumber ", "desc"));
