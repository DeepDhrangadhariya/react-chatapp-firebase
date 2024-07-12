import React, { useState } from 'react'
import "./chatList.css"

const ChatList = () => {

  const [addChange, setAddChange] = useState(false)

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' />
        </div>
        <img src={addChange ? "./minus.png" : "./plus.png"} onClick={()=>setAddChange((prev)=>!prev)} alt="" className='plus'/>
      </div>
    </div>
  )
}

export default ChatList