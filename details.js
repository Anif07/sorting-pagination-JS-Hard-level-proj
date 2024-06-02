// const details = document.getElementById("name");
let student = null;
const name = document.getElementById("name");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const idNumber = document.getElementById("idNumber");
const dateOfRegistration = document.getElementById("dateOfRegistration");
const city = document.getElementById("city");
const phoneNumber = document.getElementById("phoneNumber");
function fetchDetails() {
  data = localStorage.getItem("selectedStudent");
  if (data) {
    student = JSON.parse(data);
    console.log(student);
  }
  //   details.innerHTML = `
  //   <button id="click">Click<button/>`;
  //   document.getElementById("click").addEventListener("click", display());
}

// display = () => {
//   data = localStorage.getItem("selectedStudent");
//   console.log(data);
// };
// document.addEventListener("DOMContentLoaded", fetchDetails);
fetchDetails();

name.innerText = `${student.name}`;
age.innerText = `${student.age}`;
gender.innerText = `${student.gender}`;
idNumber.innerText = `${student.idNumber}`;
dateOfRegistration.innerText = `${student.dateOfRegistration}`;
city.innerText = `${student.city}`;
phoneNumber.innerText = `${student.phoneNumber}`;

backIcon = document.getElementById("icon");

const backHandler = () => {
  history.back();
};
backIcon.addEventListener("click", backHandler);
