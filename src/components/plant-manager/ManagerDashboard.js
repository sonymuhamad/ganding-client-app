import React, { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const ManagerDashboard = () => {

    const value = useContext(AuthContext)
    console.log(value, 'from manager')
    return (
        <>
            <h1>Hello World Plant Manager</h1>

        </>
    )
}


export default ManagerDashboard


