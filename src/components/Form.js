import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'



const API_BASE_URL = process.env.API_BASE_URL || 'https://genbox.onrender.com/api'
function Form() {
  const Location = useLocation()
  console.log(Location.search)
  const [invalidUser, setinvalidUser] = useState('')
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const [Newpassword, setNewpassword] = useState({
    password: '',
    confirmPassword: ''
  })
  const [success, setsuccess] = useState(false)
  const navigate = useNavigate()
  

  const {token, id}= queryString.parse(Location.search)

  const verifyToken=async ()=> {
    try {
    const {data} = await axios(`${API_BASE_URL}/verify-token?token=${token}&id=${id}`)
    setBusy(false)

  } catch (error) {
    if(error?.response?.data){
      const {data} = error.response;
      if(!data.success) return setinvalidUser(data.error)
      return console.log(error.response.data)
      setBusy(false)
    }
    console.log(error)
      
  }



  }
  useEffect(() => {
    verifyToken()
  
  }, [])
  const handleOnChange =({target})=>{
    setNewpassword({
      ...Newpassword,
      [target.name]: target.value
    })
    console.log(target)
    
  }

  const handleSubmit = async(e)=> {
    // setError(false)
    e.preventDefault()

    const {password, confirmPassword} = Newpassword
    if(password.trim().length <8 || password.trim().length >20 ){
      return setError('Password must be between 8 and 20 characters')
    }
    if(password !== confirmPassword){
      return setError('Passwords do not match')
    }
    if(password.trim().length < 8){
      return setError('Password must be at least 8 characters')
    }

    try {
      setBusy(true)
    const {data} = await axios.post(`${API_BASE_URL}/reset-password?token=${token}&id=${id}`, {password})
    setBusy(false)
    console.log(data)
    
    if(data.success) {
      
      navigate('/reset-password')
      setsuccess(true)

    }

      
    } catch (error) {
      setBusy(false)
      if(error?.response?.data){
        const {data} = error.response;
        if(!data.success) return setError(data.error)
        return console.log(error.response.data)
        }
        console.log(error)


      
    }
  } 

  if(invalidUser) return <div className='max-w-screen-sm m-auto pt-40'>
    <h1 className='text-center text-3xl text-gray-500 mb-3' >
      {invalidUser}
    </h1>
  </div>

if(busy) return <div className='max-w-screen-sm m-auto pt-40'>
  <div className="flex justify-center items-center">
  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
</div>
</div>

if(success) return <div className='max-w-screen-sm m-auto pt-40'>
<h1 className='text-center text-3xl text-gray-500 mb-3' >
  Password Reset Successfully
</h1>
</div>
  
  return (
    <div className="max-w-screen-sm m-auto pt-40">
      <h1 className='text-center text-3xl text-gray-500 mb-3' >
        Reset password
      </h1>
      <form className='shadow w-full rounded-lg p-10'
      onSubmit={handleSubmit}
      >
        {error &&  <p className='text-center p-2 mb-3 bg-red-500 text-white'>
            {error}
          </p>}
         <div className='space-y-8'>

        <input
          type="password"
          placeholder="New password"
          name="password"
          onChange={handleOnChange}
          className='px-3 text-lg h-10 w-full border-gray-500 border-2 rounded'
          />
        <input
          type="password"
          name='confirmPassword'
          placeholder="Confirm password"
          onChange={handleOnChange}
          className='px-3 text-lg h-10 w-full border-gray-500 border-2 rounded'
          />
          
        <button className='bg-blue-500 text-white text-lg h-10 w-full rounded mt-3'>
          Reset password
        </button>
        

          </div>
      </form>


    </div>
    
  )
}

export default Form