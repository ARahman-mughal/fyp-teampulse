import API from './api';

// Helper function for consistent error handling
const handleAuthError = (error) => {
  console.error('Auth Error:', {
    status: error.response?.status,
    message: error.message,
    response: error.response?.data
  });
  
  let userMessage = 'Authentication failed';
  if (error.response) {
    userMessage = error.response.data?.message || 
                 error.response.statusText || 
                 `Server responded with ${error.response.status}`;
  } else if (error.request) {
    userMessage = 'No response from server';
  }
  
  throw new Error(userMessage);
};

export const register = async (userData) => {
  try {
    // Basic validation
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }

    const response = await API.post('/auth/register', userData);
    
    if (response.data?.token) {
      localStorage.setItem('userToken', response.data.token);
      if (response.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const login = async (userData) => {
  try {
    const response = await API.post('/auth/login', userData);
    
    if (response.data?.token) {
      const { token, ...user } = response.data;
      localStorage.setItem('userToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getProfile = async (payload) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('No authentication token found');

    const response = await API.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const logout = () => {
  try {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    // Optional: Make API call to invalidate token on server
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Additional helper methods
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('userToken');
};