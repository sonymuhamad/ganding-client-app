import React from "react";
import { Breadcrumbs, Text, Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function BreadCrumb({ links }) {


    const items = links.map((link) => {
        return (
            <Button variant="subtle" radius='xl' component={Link} to={link.path} key={link.path} >

                <Text transform='capitalize' color='light' size='lg'  >
                    {link.label}
                </Text>

            </Button>
        )
    })
    return (

        <Breadcrumbs separator=
            {
                <Text size='lg' color='dimmed' >
                    {'~>'}
                </Text>
            }
            mb='sm'
        >
            {items}
        </Breadcrumbs>
    )
}

