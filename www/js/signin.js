// Get the login form
const signinForm = document.getElementById("loginForm");

// Listen for form submission
signinForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get the user's input
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Authenticate user with Supabase
const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
});

// Handle login errors
if (error) {
    alert(error.message);
    return;
}

// Handle successful login
alert("Login successful!");

    // Retrieve the user's profile
    const { data: profile, error: profileError } = await window.supabaseClient
        .from("profiles")
        .select("full_name, role")
        .eq("id", data.user.id)
        .single();

    // Handle profile retrieval errors
    if (profileError) {
        alert("Unable to retrieve your user profile.");
        console.error(profileError);
        return;
    }

    // Display user information
    console.log("Full Name:", profile.full_name);
    console.log("User Role:", profile.role);

    // Identify the user's role
if (profile.role === "customer") {
    alert("Welcome, " + profile.full_name + "!");
}
else if (profile.role === "admin") {
    alert("Welcome back, Admin " + profile.full_name + "!");
}
else {
    alert("Invalid user role. Please contact the administrator.");
    await window.supabaseClient.auth.signOut();
    return;
}

console.log("Logged in user:", data.user);
});

// Check for an existing login session
async function checkSession() {
    const { data, error } = await window.supabaseClient.auth.getSession();

    if (error) {
        console.error("Session check failed:", error);
        return;
    }

    if (data.session) {
        console.log("Existing session found!");
        console.log("Logged-in email:", data.session.user.email);
    } else {
        console.log("No active session found.");
    }
}

// Run session check
checkSession();