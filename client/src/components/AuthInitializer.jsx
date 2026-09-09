import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchMe } from '../store/authSlice.js'

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  return children
}