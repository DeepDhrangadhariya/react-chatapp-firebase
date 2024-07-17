import React, { useEffect, useState } from 'react'
import "./chatList.css"
import AddUser from './addUser/AddUser'
import { useUserStore } from '../../../library/userStore'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../library/firebase'
import { useChatStore } from '../../../library/chatStore'

const ChatList = () => {

  const [addChange, setAddChange] = useState(false)
  const [chats, setChats] = useState([])

  const {currentUser} = useUserStore()
  const {chatID, changeChat} = useChatStore()

  console.log(chatID)

  useEffect(() => {

    const unsub = onSnapshot(doc(db, "userchats", currentUser.id),
      async (res) => {
          const items = res.data().chats

          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);

            const user = userDocSnap.data()

            return {...item, user}
          })
          const chatData = await Promise.all(promises)

          setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt))
      }
    );

    return () => {
      unsub()
    }

  },[currentUser.id])

  const handleSelect = async (chat) => {

    changeChat(chat.chatId, chat.user)

  }

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' />
        </div>
        <img src={addChange ? "./minus.png" : "./plus.png"} onClick={()=>setAddChange((prev)=>!prev)} alt="" className='plus'/>
      </div>
      {chats.map((chat) => (

        <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}>
          <img src={chat.user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      
      {addChange && <AddUser/>}
    </div>
  )
}

export default ChatList