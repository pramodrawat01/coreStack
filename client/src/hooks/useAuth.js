import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, login as loginThunk, signup as signupThunk, logout as logoutThunk, acceptInvite as acceptInviteThunk } from '../store/authSlice.js'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, company, role, initializing, status, error } = useSelector((state) => state.auth)

  // useEffect(() => {
  //   dispatch(fetchMe())
  // }, [dispatch])

  const toError = (err) => new Error(typeof err === 'string' ? err : err?.message || 'Something went wrong')

  const login = useCallback(async (email, password) => {
    try {
      return await dispatch(loginThunk({ email, password })).unwrap()
    } catch (err) {
      throw toError(err)
    }
  }, [dispatch])

  const signup = useCallback(async (payload) => {
    try {
      return await dispatch(signupThunk(payload)).unwrap()
    } catch (err) {
      throw toError(err)
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    try {
      return await dispatch(logoutThunk()).unwrap()
    } catch (err) {
      throw toError(err)
    }
  }, [dispatch])

  const acceptInvite = useCallback(async(payload) => {
    try {
      return await dispatch(acceptInviteThunk(payload)).unwrap()
    } catch (error) {
      throw toError(error)
    }
  }, [dispatch])

  return { user, company, role, loading: initializing, status, error, login, signup, logout, acceptInvite }
}