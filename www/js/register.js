const registerForm = document.getElementById("registerForm");


registerForm.addEventListener("submit", async function (event) {


    event.preventDefault();


    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;


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
