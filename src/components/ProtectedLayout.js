import React, { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";

const ProtectedLayout = () => {

    const auth = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (auth.user === null) {
            showNotification({
                title: 'Access Denied',
                message: 'sign in to continue',
                disallowClose: true,
                autoClose: 3500,
                icon: <IconX />,
                color: 'red'
            })
            navigate('/', { replace: true })
        } else {
            const regex = new RegExp('/home\/*(?=marketing|purchasing|plant-manager|ppic)')
            // users are not allowed to visit just /home/ path but must be a sequel path eg. /home/marketing
            if (!regex.test(location.pathname) || !(location.pathname.split('/')[2] === auth.user.division)) {
                // if auth.user.group marketing navigate to dashboard marketing
                // elif auth.user.group purchasing navigate to dashboard purchasing etc.
                const division = auth.user.division
                navigate(`/home/${division}`, { replace: true })
            }
        }


    }, [])


    return (
        <>

            {
                auth.user != null && <Outlet />
            }


        </>
    )
};


export default ProtectedLayout