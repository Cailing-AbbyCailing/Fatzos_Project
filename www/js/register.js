
// Get the registration form
const registerForm = document.getElementById("registerForm");

// Listen for form submission
registerForm.addEventListener("submit", async function (event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get the user's input
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Check that the full name is not empty
    if (!fullName) {
        alert("Please enter your full name.");
        return;
    }

    // Create the account through Supabase
    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });

    // Handle registration errors
    if (error) {
        alert("Registration failed: " + error.message);
        return;
    }

    // Handle successful registration
    if (data.session) {
        alert("Account created successfully!");
        window.location.href = "index.html";
    } else {
        alert("Account created! Please check your email to verify your account.");
    }

});
