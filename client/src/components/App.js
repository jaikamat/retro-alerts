import React from 'react';
import Navbar from './Navbar';
import Main from './Main';
import Spinner from './viewComponents/Spinner';
import { SpinnerProvider } from './viewComponents/SpinnerContext'
import { AuthProvider } from './AuthContext';
import 'semantic-ui-css/semantic.min.css';

export default function App() {
  return <AuthProvider>
    <Navbar />
    <SpinnerProvider>
      <Main />
      <Spinner />
    </SpinnerProvider>
  </AuthProvider>
}
