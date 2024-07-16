import { useEffect } from 'react';
import './App.css';
import Chat from './components/chat/Chat';
import Detail from './components/detail/Detail';
import List from './components/list/List';
import Login from './components/login/Login';
import Notification from './components/notification/Notification';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './library/firebase';

function App() {

  const user = false;
  // const user = true;

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user.uid)

    })

    return () => {
      unSub()
    }
  },[])

  return (
    <div className="container">
      {
        user ? (
          <>
            <List/>
            <Chat/>
            <Detail/>
          </>
        ) : (
          <Login/>
        )
      }
      <Notification/>
    </div>
  );
}

export default App;
