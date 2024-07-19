import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../library/firebase'
import { useChatStore } from '../../library/chatStore'
import { useUserStore } from '../../library/userStore'

const Chat = () => {

  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [chat, setChat] = useState()

  const {currentUser} = useUserStore()
  const {chatId, user} = useChatStore()

  const endRef = useRef(null)

   useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth"
      // behaviorDelay: "2000",
    })
  },[])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data())
    })

    return () => {
      unSub()
    }
  },[chatId])

  // console.log(chat)

  const handleEmoji = e => {
    setText(prev => prev + e.emoji)
    setOpen(false)
  }

  // console.log(text)

  const handleSend = async () => {
    if(text === "") return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createAt: new Date()
        })
      })

      const userIds = [currentUser.id, user.id]

      userIds.forEach( async (id) => {

        const userChatsRef = doc(db, "userchats", id)
        const userChatsSnapshot = await getDoc(userChatsRef)
        
        if(userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data()
          
          const chatIndex = userChatsData.chats.findIndex(c=> c.chatId === chatId)
          
          userChatsData.chats[chatIndex].lastMessage = text
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
          userChatsData.chats[chatIndex].updateAt = Date.now()
          
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          })
        }
        
      })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        { chat?.messages?.map((message) => (
            <div className="message own" key={message?.createAt}>
              <div className="texts">
                {message.img && <img src={message.img} alt="" />}
                <p>{message.text}</p>
                <span>1 min ago</span>
              </div>
            </div>
          ))
        }
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input 
          type="text" 
          placeholder='Type a message...' 
          value={text}
          onChange={(e)=>setText(e.target.value)} 
        />
        <div className="emoji">
          <img 
            src="./emoji.png" 
            alt="" 
            onClick={()=>setOpen(prev=>!prev)} 
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji}/>  
          </div>
        </div>
        <button className='sendButton' onClick={handleSend} >Send</button>
      </div>
    </div>
  )
}

export default Chat