import React, { useState } from 'react';

export const SpinnerContext = React.createContext();

export const SpinnerProvider = props => {
    const [status, setStatus] = useState(false);

    // Spinner API
    const toggleSpin = {
        on: () => setStatus(true),
        off: () => setStatus(false)
    };

    return <SpinnerContext.Provider value={{ status, toggleSpin }}>
        {props.children}
    </SpinnerContext.Provider>
}