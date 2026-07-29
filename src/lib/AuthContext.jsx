
import React, { createContext, useContext, useMemo } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const value = useMemo(
    () => ({
      user: null,
      isAuthenticated: false,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      authChecked: true,

      logout: () => {
        console.info(
          'Logout is not available.'
        );
      },

      navigateToLogin: () => {
        console.info(
          'Login is not available.'
        );
      },

      checkUserAuth: async () => null,
      checkAppState: async () => null,
    }),
    []
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

