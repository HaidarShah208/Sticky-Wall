import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import page404 from './page404'
import Register from './Register'

export default function Index() {
    return (
        <Routes>
            <Route path='login' element={<Login />} />
             <Route path='register' element={<Register />} />
            {/*<Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} /> */}
            <Route path="*" element={<page404/>} />
        </Routes>
    )
}
