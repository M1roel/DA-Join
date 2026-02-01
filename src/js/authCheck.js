/**
 * Checks the authentication state of the user.
 * 
 * Redirects the user to the login page if they are not authenticated.
 * This function listens for authentication state changes using Firebase's `onAuthStateChanged` method.
 */
function checkAuth() {
    const guestUser = localStorage.getItem("user");
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user && guestUser !== "Guest") {
            window.location.replace('public/login.html');
        }
    });
}


checkAuth();