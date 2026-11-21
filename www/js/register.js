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

    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });

    if (error) {
        alert("Registration failed: " + error.message);
        return;
    }

    if (data.session) {
        alert("Account created successfully!");
        window.location.href = "index.html";
    } else {
        alert("Account created! Please check your email to verify your account.");
    }

});
