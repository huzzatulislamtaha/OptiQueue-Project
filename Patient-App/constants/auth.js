
import AsyncStorage from "@react-native-async-storage/async-storage";

// ========================================
// AsyncStorage Keys
// ========================================

const TOKEN_KEY = "optiqueue_token";
const USER_KEY = "optiqueue_user";

// ========================================
// Save Login Session
// ========================================

export const saveAuthSession = async (token, user) => {
  try {
    if (!token || !user) {
      throw new Error("Token and user information are required.");
    }

    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);

    console.log("Auth Session: Saved Successfully");

    return true;

  } catch (error) {
    console.log("Save Session Error:", error.message);

    return false;
  }
};

// ========================================
// Get Saved Authentication Token
// ========================================

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    return token;

  } catch (error) {
    console.log("Get Token Error:", error.message);

    return null;
  }
};

// ========================================
// Get Saved User Information
// ========================================

export const getAuthUser = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    return JSON.parse(user);

  } catch (error) {
    console.log("Get User Error:", error.message);

    return null;
  }
};

// ========================================
// Check Whether User Has a Saved Session
// ========================================

export const hasAuthSession = async () => {
  try {
    const token = await getAuthToken();
    const user = await getAuthUser();

    return Boolean(token && user);

  } catch (error) {
    console.log("Check Session Error:", error.message);

    return false;
  }
};

// ========================================
// Clear Login Session (Logout)
// ========================================

export const clearAuthSession = async () => {
  try {
    // Remove both token and user information
    await AsyncStorage.multiRemove([
      TOKEN_KEY,
      USER_KEY,
    ]);

    // Verify that the saved session has been removed
    const [token, user] = await AsyncStorage.multiGet([
      TOKEN_KEY,
      USER_KEY,
    ]);

    const sessionCleared = !token[1] && !user[1];

    if (!sessionCleared) {
      throw new Error("Unable to completely clear the login session.");
    }

    console.log("Auth Session: Cleared Successfully");

    return true;

  } catch (error) {
    console.log("Clear Session Error:", error.message);

    return false;
  }
};
