import { doc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'

const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if(!uid) return set({currentUser: null, isLoading: false})

    try {
        
        const docRef = doc(db, "users", uid)

    } catch (error) {
        console.log(error)
        return set({currentUser: null, isLoading: false})
    }
  }
}))