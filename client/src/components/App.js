import React from 'react';
import Navbar from './Navbar';
import Main from './Main';
import Spinner from './viewComponents/Spinner';
import { SpinnerProvider } from './viewComponents/SpinnerContext'
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserProvider';
import 'semantic-ui-css/semantic.min.css';

export default function App() {
  return <SpinnerProvider>
    <UserProvider>
      <AuthProvider>
        <Navbar />
        <Main />
        <Spinner />
      </AuthProvider>
    </UserProvider>
  </SpinnerProvider>
}
