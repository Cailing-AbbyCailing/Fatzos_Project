    async function logout() {
        const { error } = await window.supabaseClient.auth.signOut();

        if (error) {
            alert("Logout failed: " + error.message);
            return;
        }

        window.location.href = "index.html";
    }