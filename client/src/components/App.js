import React from 'react';
import Navbar from './Navbar';
import Main from './Main';
import Spinner from './viewComponents/Spinner';
import { SpinnerProvider } from './viewComponents/SpinnerContext'
import { AuthProvider } from './AuthContext';

export default function App() {
  return <AuthProvider>
    <Navbar />
    <SpinnerProvider>
      <Main />
      <Spinner />
    </SpinnerProvider>
  </AuthProvider>
}
