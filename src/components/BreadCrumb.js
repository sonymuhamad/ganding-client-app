import React from "react";
import { Breadcrumbs, Text, Anchor } from "@mantine/core";
import { Link } from "react-router-dom";

export default function BreadCrumb({ links }) {


    const items = links.map((link) => {
        return (
            <Anchor variant="subtle" radius='xl' component={Link} to={link.path} key={link.path} >

                <Text transform='capitalize' color='blue' size='lg'  >
                    {link.label}
                </Text>

            </Anchor>
        )
    })
    return (

        <Breadcrumbs separator='/'
            mb='lg'
        >
            {items}
        </Breadcrumbs>
    )
}

