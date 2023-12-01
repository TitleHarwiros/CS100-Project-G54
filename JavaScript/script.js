const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};

const port = 8000;

function validateName() {
  const fullnameInput = document.getElementById("fullname");
  const names = fullnameInput.value.trim().split(" ");
  const errorElement = document.getElementById("fullnameError");

  if (names.length !== 2) {
    errorElement.textContent = "Please enter both your Firstname and Lastname.";
    return false;
  } else {
    errorElement.textContent = "";
  }
  return true;
}

function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^\d{10}$/;
  const errorElement = document.getElementById("studentIDError");

  if (!studentIDPattern.test(studentIDInput.value)) {
    errorElement.textContent = "Please enter a 10-digit Student ID.";
    return false;
  } else {
    errorElement.textContent = "";
  }
  return true;
}

function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.+@dome\.tu\.ac\.th$/;
  const errorElement = document.getElementById("emailError");

  if (!emailPattern.test(emailInput.value)) {
    errorElement.textContent =
      "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
    return false;
  } else {
    errorElement.textContent = "";
  }
  return true;
}

function validateFormOnInput() {
  validateName();
  validateStudentID();
  validateEmail();
}

async function fetchActivityTypes() {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}

function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}

function updateDisplay(data) {
  const displaySection = document.getElementById("displaySection");
  const displayDataElement = document.getElementById("displayData");

  const formattedData = Object.entries(data)
    .map(([key, value]) => `"${key}": "${value}"`)
    .join("\n");

  displayDataElement.textContent = formattedData;
  displaySection.style.display = "block";
}

async function submitForm(event) {
  event.preventDefault();

  if (!validateName() || !validateStudentID() || !validateEmail()) {
    return;
  }

  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    return;
  }

  const formData = new FormData(event.target);
  const data = {
    first_name: formData.get("fullname").split(" ")[0],
    last_name: formData.get("fullname").split(" ")[1],
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description"),
  };

  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      updateDisplay(responseData.data);

      const formattedData = Object.entries(responseData.data)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join("\n");

      alert(responseData.message + "\n" + formattedData);

      document.getElementById("myForm").reset();
    } else {
      console.error("Failed to submit form data.");
      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
});

document.getElementById("myForm").addEventListener("submit", submitForm);

document.getElementById("fullname").addEventListener("input", validateName);
document.getElementById("studentID").addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);

function getValuetoResult(){
  document.getElementById('showresult').removeAttribute('hidden')
  let fullname = document.getElementById('fullname')
  let stid = document.getElementById('studentID')
  let birth = document.getElementById('dateofBirth')
  let mail = document.getElementById('email')
  let mobilenum = document.getElementById('mobilenumber')
  let gen = document.getElementById('gender')
  let fact = document.getElementById('faculty')
  let type = document.getElementById('activityType')
  let year = document.getElementById('academicYear')
  let semester = document.getElementById('semester')
  let start = document.getElementById('startDate')
  let end = document.getElementById('endDate')
  let location = document.getElementById('location')
  let activity = document.getElementById('Activity')

  
  let res = document.getElementById('showresult')
  let msg = ''
  msg += '<p><b>Full Name :</b> '+ fullname.value +'</p>'
  msg += '<p><b>Student ID :</b> '+ stid.value +'</p>'
  msg += '<p><b>Date of Birth :</b> '+ birth.value +'</p>'
  msg += '<p><b>University Email :</b> '+ mail.value +'</p>'
  msg += '<p><b>Mobile Number :</b> '+ mobilenum.value +'</p>'
  msg += '<p><b>Gender :</b> '+ gen.value +'</p>'
  msg += '<p><b>FACULTIES / COLLEGES :</b> '+ fact.value +'</p>'
  msg += '<p><b>Type of Work/Activity :</b>'+ type.value +'</p>'
  msg += '<p><b>Academic Year :</b>'+ year.value +'</p>'
  msg += '<p><b>Semester :</b>'+ semester.value +'</p>'
  msg += '<p><b>Start Date/Time :</b>'+ start.value +'</p>'
  msg += '<p><b>End Date/Time :</b>'+ end.value +'</p>'
  msg += '<p><b>Location :</b>'+ location.value +'</p>'
  msg += '<p><b>Activity :</b>'+ activity.value +'</p>'


  res.innerHTML = msg

  res.scrollIntoView()
}

