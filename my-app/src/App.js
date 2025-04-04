import React from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <div className="container">
            <h1 className="text-center my-4">CRUD APP</h1>
            <AddUser onUserAdded={() => window.location.reload()} />
            <UserList />
        </div>
    );
}

export default App;
