import React from 'react';
import Navbar from './Navbar';
import Main from './Main';
import { AuthProvider } from './AuthContext';

export default function App() {
  return <AuthProvider>
    <Navbar />
    <Main />
  </AuthProvider>
}
