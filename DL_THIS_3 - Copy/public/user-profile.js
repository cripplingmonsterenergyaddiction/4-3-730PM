// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function showLogIn() {
  document.querySelector(".popup-login-content").style.display = "block";
  document.querySelector(".popup-login").style.display = "flex";
  document.querySelector(".options").style.display = "none";
}

function closeLogIn() {
  document.querySelector(".popup-login-content").style.display = "none";
  document.querySelector(".popup-login").style.display = "none";

  document.querySelector(".options").style.display = "block";
  return false; // Prevent default form submission
}

function showSignup() {
  document.querySelector(".popup-signup-content").style.display = "block";
  document.querySelector(".popup-signup").style.display = "flex";
  document.querySelector(".options").style.display = "none";
}

function closeSignup() {
  document.querySelector(".popup-signup-content").style.display = "none";
  document.querySelector(".popup-signup").style.display = "none";

  let email = document.getElementsByName("email1");
  email.value = '';

  let username = document.getElementsByName("sign2");
  username.value = '';

  let password = document.getElementsByName("firstpass");
  password.value = '';

  let v_password = document.getElementById("verify-password-signup");
  v_password.value = '';

  document.querySelector(".options").style.display = "block";
  
  return false; // Prevent default form submission
}
// Adjusted function in user-profile.js for profile updates
function updateProfile(event) {
  event.preventDefault(); // Prevent default form submission

  // Use FormData to automatically capture form data, including files
  const formData = new FormData(document.getElementById('editProfileForm'));

  // Since you're uploading a file, you should not set 'Content-Type' header manually.
  // The browser will set it to 'multipart/form-data' with the correct boundary.
  fetch('/update-profile', {
    method: 'POST',
    body: formData, // Send FormData directly
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Profile updated successfully!');
      window.location.href = '/userProfile'; 
    } else {
      alert(data.message || 'Failed to update profile. Please try again.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Adjusted to ensure the form submit event is correctly bound to the updateProfile function
document.getElementById('editProfileForm').addEventListener('submit', updateProfile);

document.getElementById('deleteAccountBtn').addEventListener('click', function() {
  var confirmDeletion = confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (confirmDeletion) {
      fetch('/delete-account', {
          method: 'POST',
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Account deleted successfully.');
              // Redirect based on the response from the server
              window.location.href = data.redirectTo; 
          } else {
              alert('Failed to delete account. Please try again.');
          }
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
      });
  }
});

