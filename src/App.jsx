import './App.css';
import React, { useState } from 'react';
import {BrowserRouter as Router , Routes , Route} from "react-router-dom";
import Login from './Components/Logins/Login'; // change
import Register from './Components/Registers/Register'; // change
import Navbar from './Components/Navbar/Navbar';
import Account from './Components/Accounts/Account'; // change
import Home from './Components/Home/Home';
import Chats from './Components/Chats/Chats';
import AddPost from './Components/Post/AddPost'; // cahnge to Compoentts/AddPost
import Comments from './Components/Comments/Comments';

function App() {
  const [logged, setlogged] = useState(false);
  const [username, setUsername] = useState();

  return (
    <div className='app-body'>
      <Router>
        <Navbar  />
        <Routes>
          <Route exact path='/'         element={<Home setUsername={setUsername} />}></Route>
          <Route exact path='/chats'    element={<Chats />}></Route>
          <Route exact path='/account/myaccount'  element={<Account   />}></Route>
          <Route exact path={`/account/${username}`}  element={<Account userName={username}  />}></Route>
          <Route exact path='/addpost'  element={<AddPost  />}></Route>
          <Route exact path='/login'    element={<Login   />}></Route>
          <Route exact path='/register' element={<Register/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
