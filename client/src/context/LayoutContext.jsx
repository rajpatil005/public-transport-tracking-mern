// client/src/context/LayoutContext.jsx
import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export const LayoutProvider = ({ children }) => {
  const [hideLayout, setHideLayout] = useState(false);

  const showNavbarFooter = () => setHideLayout(false);
  const hideNavbarFooter = () => setHideLayout(true);

  return (
    <LayoutContext.Provider value={{
      hideLayout,
      showNavbarFooter,
      hideNavbarFooter
    }}>
      {children}
    </LayoutContext.Provider>
  );
};