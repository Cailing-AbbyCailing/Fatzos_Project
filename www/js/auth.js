async function getCurrentProfile() {
    const { data: { session }, error: sessionError } =
        await window.supabaseClient.auth.getSession();

    if (sessionError) {
        console.error("Session check failed:", sessionError);
        return { profile: null, error: sessionError };
    }

    if (!session) {
        return { profile: null, error: null };
    }

    const { data: profile, error } = await window.supabaseClient
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", session.user.id)
        .single();

    return { profile, error };
}

async function logoutUser() {
    const { error } = await window.supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout failed:", error);
        alert("Unable to log out. Please try again.");
        return;
    }
    window.location.href = "index.html";

}

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

window.authHelpers = {
    getCurrentProfile,
    logoutUser
};

window.authHelpers = {
    getCurrentProfile,
    logoutUser,
    requireRole
};