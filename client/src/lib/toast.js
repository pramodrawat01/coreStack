import { toast } from 'react-toastify'

const BASE_OPTS = {
  position: 'top-right',
  autoClose: 3500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  theme: 'dark',
}

export const notifySuccess = (message) => toast.success(message, BASE_OPTS)
export const notifyError = (message) => toast.error(message, BASE_OPTS)
export const notifyInfo = (message) => toast.info(message, BASE_OPTS)