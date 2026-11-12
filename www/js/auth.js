// Get the currently logged-in user's profile
async function getCurrentProfile() {
    // Check if a user has an active session
    const { data: { session }, error: sessionError } =
        await window.supabaseClient.auth.getSession();

    if (sessionError) {
        console.error("Session check failed:", sessionError);
        return { profile: null, error: sessionError };
    }

    if (!session) {
        return { profile: null, error: null };
    }

    // Retrieve the user's profile from the profiles table
    const { data: profile, error } = await window.supabaseClient
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", session.user.id)
        .single();

    return { profile, error };
}

// Log out the current user
async function logoutUser() {
    const { error } = await window.supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout failed:", error);
        alert("Unable to log out. Please try again.");
        return;
    }

    // Return the user to the sign-in page
    window.location.href = "index.html";

}


// Check whether the logged-in user has the required role
async function requireRole(requiredRole) {
    const { profile, error } = await getCurrentProfile();

    if (error || !profile) {
        window.location.href = "index.html";
        return false;
    }

    if (profile.role !== requiredRole) {
        alert("Access denied. You do not have permission to view this page.");
        window.location.href = "index.html";
        return false;
    }

    return true;
}

// Make authentication functions accessible to other scripts
window.authHelpers = {
    getCurrentProfile,
    logoutUser
};

window.authHelpers = {
    getCurrentProfile,
    logoutUser,
    requireRole
};