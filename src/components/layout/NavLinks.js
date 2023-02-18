import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { NavLink, Text } from "@mantine/core";
import { navbarStyle } from '../../styles'
import { usePath } from "../../hooks";


const NavLinks = ({ links }) => {

    const { classes, cx } = navbarStyle()

    const { getCurrentPath } = usePath()

    const navlink = useMemo(() => {
        return links.map((link) => {

            if (link.nested) {

                return (
                    <NavLink
                        label={
                            <Text weight={700} className={classes.responsiveText} >

                                {link.label}

                            </Text>}
                        icon={link.icon}
                        childrenOffset={10}
                        key={link.label}
                    >

                        {link.nested.map((nestedLink) => {

                            return (
                                <NavLink

                                    label={
                                        <Text weight={600} size='sm' className={classes.responsiveText} >
                                            {nestedLink.label}
                                        </Text>
                                    }
                                    icon={nestedLink.icon}
                                    className={cx(classes.link, {
                                        [classes.linkActive]: getCurrentPath() === nestedLink.url
                                    })}

                                    component={Link} to={nestedLink.url}
                                    key={nestedLink.label}
                                />
                            )

                        })}

                    </NavLink>
                )

            } else {

                return (
                    <NavLink label=
                        {
                            <Text weight={700} className={classes.responsiveText} >
                                {link.label}
                            </Text>
                        }
                        icon={link.icon}
                        className={cx(classes.link, {
                            [classes.linkActive]: getCurrentPath() === link.url
                        })}

                        component={Link} to={link.url}
                        key={link.label}
                    />
                )

            }
        })
    }, [getCurrentPath, classes, cx, links])


    return (
        <>
            {navlink}
        </>
    )


}


export default NavLinks



