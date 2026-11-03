
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const TOKEN_KEY = "optiqueue_token";
const USER_KEY = "optiqueue_user";

// Save login session
export const saveAuthSession = async (token, user) => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);

    return true;
  } catch (error) {
    console.log("Save Session Error:", error.message);
    return false;
  }
};

// Get saved token
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.log("Get Token Error:", error.message);
    return null;
  }
};

// Get saved user information
export const getAuthUser = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.log("Get User Error:", error.message);
    return null;
  }
};

// Clear login session (Logout)
export const clearAuthSession = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    return true;
  } catch (error) {
    console.log("Clear Session Error:", error.message);
    return false;
  }
};
