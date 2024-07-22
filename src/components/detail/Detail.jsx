import React from 'react'
import "./detail.css"
import { auth, db } from '../../library/firebase'
import { useChatStore } from '../../library/chatStore'
import { useUserStore } from '../../library/userStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } = useChatStore()
  const { currentUser } = useUserStore()

  const handleBlock = async () => {
    if(!user) return;

    const userDocRef = doc(db, "users", currentUser.id)

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
      changeBlock()
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    auth.signOut();
    resetChat()
  };

  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username || "User"}</h2>
        <p>Lorem ipsum dolor, sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="arrowDown.png" alt="" />
          </div>
          <div className="photos">            
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./bg.jpg" alt="" />
                <span>photo_2024_7.png</span>
              </div>
              <img src="./download.png" alt="" className="download" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./bg.jpg" alt="" />
                <span>photo_2024_7.png</span>
              </div>
              <img src="./download.png" alt="" className="download" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./bg.jpg" alt="" />
                <span>photo_2024_7.png</span>
              </div>
              <img src="./download.png" alt="" className="download" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./bg.jpg" alt="" />
                <span>photo_2024_7.png</span>
              </div>
              <img src="./download.png" alt="" className="download" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="arrowUp.png" alt=""  />
          </div>
        </div>
      </div>
      <div className="blockBtn">
        <button onClick={handleBlock} >{
      
          isCurrentUserBlocked ? "You Are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block User"

      }</button>
      <button className='logOut' onClick={handleLogout} >Log Out</button>
      </div>
    </div>
  )
}

export default Detail