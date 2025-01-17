import React, { useState } from 'react'
import "./login.css"
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../library/firebase'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import upload from '../../library/upload'

const Login = () => {

    const [avatar, setAvatar] = useState({
        file:null,
        url:""
    })

    const [loading, setLoading] = useState(false)

    const handleAvatar = e => {
        if(e.target.files[0]){
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister = async e => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)

        const {username, email, password} = Object.fromEntries(formData)

        if (!username || !email || !password) return toast.warn("Please Enter Inputs!") && setLoading(false)

        if(!avatar.file) return toast.warn("Please Upload An Avatar!") && setLoading(false)

        const userRef = collection(db, "users")
        const q = query(userRef, where("username", "==", username))
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return toast.warn("Select another username") && setLoading(false)
        }

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const imgUrl = await upload(avatar.file)

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked:[]
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats:[]
            });

            toast.success("Account Created! Please Login!")

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async e => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)

        const {email, password} = Object.fromEntries(formData)
        
        try {

            await signInWithEmailAndPassword(auth, email, password)
            toast.success("Login Success!")
            window.location.reload()
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='login' >
        <div className="item">
            <h2>Welcome Back,</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder='Email' name='email' />
                <input type="password" placeholder='Password' name='password' />
                <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
            </form>
        </div>
        <div className="separator"></div>
        <div className="item">
            <h2>Create An Account</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor='file'>
                    <img src={avatar.url || './avatar.png'} alt="" />Upload An Image</label>
                <input
                    type="file"
                    id='file'
                    style={{display:"none"}}
                    onChange={handleAvatar}
                />
                <input type="text" placeholder='Username' name='username' />
                <input type="email" placeholder='Email' name='email' />
                <input type="password" placeholder='Password' name='password' />
                <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
            </form>
        </div>
    </div>
  )
}

export default Login