// App.js
import React from 'react';
import { UserForm } from './store/UserForm'; // Убедитесь, что путь правильный

const App = () => {
    return (
        <div>
            <h1>User Form</h1>
            <UserForm />
        </div>
    );
};

export default App;
