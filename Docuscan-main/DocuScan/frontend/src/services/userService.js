// src/services/userService.js

export const getUserData = async () => {
    return {
        name: "John Doe",
        email: "john@example.com",
    };
};

export const updateUserData = async (data) => {
    // Here, send data to the backend (this is mocked for now)
    console.log("Updated Data:", data);
    return { success: true };
};
