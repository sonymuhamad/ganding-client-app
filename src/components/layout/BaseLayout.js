import React, { useCallback, useContext } from "react";
import { AppShell, Navbar, Header, Footer, Group, Menu, Text, Button, Image, ScrollArea, NavLink, Tooltip } from "@mantine/core";
import { IconUserCircle, IconLogout } from "@tabler/icons";
import { appshellStyle } from "../../styles";
import Time from "./Time";
import { AuthContext } from "../../context";
import { DivisionIcons } from "../../services";
import { openConfirmModal } from "@mantine/modals";

const BaseLayout = ({ outlet, navlink }) => {

    const { classes } = appshellStyle()
    const auth = useContext(AuthContext)



    const openConfirmChangeDivision = useCallback((name) => openConfirmModal({
        title: `Switch division to ${name} `,
        children: (
            <Text size='sm' >
                Are you sure?, this action will change access right to selected division
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, switch ', cancel: "No, don't switch it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => auth.changeDivision(name)
    }), [])

    return (
        <>
            <AppShell


                header={
                    <Header className={classes.header} height={70} p='md'>

                        <div className={classes.headerGroup} mb='xl' >

                            <div className={classes.innerHeaderLeft}  >
                                <Group position="left" >

                                    <Image src="/logoganding.png" radius='xl' className={classes.image} />

                                    <Text variant="gradient"
                                        gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}
                                        weight={700} >
                                        Ganding Enterprise System
                                    </Text>
                                </Group>
                            </div>

                            <div className={classes.innerHeaderRight} >

                                <Group position="left" >

                                    <Text className={classes.responsiveTime} color='dimmed' align="left" >
                                        <Time />
                                    </Text>

                                    <Menu openDelay={50} closeDelay={400} mb='xs' position="left-start" withArrow  >

                                        <Menu.Target height='xl' >

                                            <Button
                                                size='lg'
                                                radius='xl'
                                                color='dark.4'
                                                variant="subtle"
                                                sx={(theme) => ({
                                                    [theme.fn.smallerThan('md')]: {
                                                        border: 0,
                                                        backgroundColor: theme.colors.blue[0],
                                                    },
                                                })}

                                                leftIcon={<IconUserCircle width={45} height={45} color='#101113' />}

                                            >

                                                <Text className={classes.responsiveTitleMenu} transform="capitalize" >
                                                    {auth.user.username} || {auth.user.division}
                                                </Text>

                                            </Button>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Label>
                                                Division
                                            </Menu.Label>

                                            {auth.user.groups.filter(group => group.name !== auth.user.division).map(group => (
                                                <Menu.Item icon={DivisionIcons[group.id]}
                                                    onClick={() => openConfirmChangeDivision(group.name)}
                                                    key={group.id}
                                                >
                                                    <Tooltip
                                                        label={`Change to ${group.name}`}
                                                    >

                                                        <Text transform="capitalize" >
                                                            {group.name}
                                                        </Text>

                                                    </Tooltip>
                                                </Menu.Item>
                                            ))}

                                        </Menu.Dropdown>

                                    </Menu>
                                </Group>
                            </div>
                        </div>
                    </Header>
                }

                footer={
                    <Footer height={50} p='md' >
                        <Text weight={100} align='center' color='dimmed' size='md'  >
                            Built by Sony muhamad
                        </Text>
                    </Footer>
                }

                navbar={
                    <Navbar className={classes.navbar} width=
                        {{
                            // When other breakpoints do not match base width is used, defaults to 100%
                            base: 50,
                            // When viewport is larger than theme.breakpoints.xs, Navbar width will be 50
                            xs: 50,
                            // When viewport is larger than theme.breakpoints.sm, Navbar width will be 150
                            sm: 150,
                            // When viewport is larger than theme.breakpoints.md, Navbar width will be 200
                            md: 200,

                            // When viewport is larger than theme.breakpoints.lg, Navbar width will be 230
                            lg: 230,

                            // When viewport is larger than theme.breakpoints.xl, Navbar width will be 300
                            xl: 250,

                        }}

                    >

                        <Navbar.Section className={classes.bodyNav} grow   >

                            {navlink}

                        </Navbar.Section>


                        <Navbar.Section className={classes.footerNav} >

                            <NavLink label=
                                {
                                    <Text weight={600} className={classes.responsiveText} color='red.9'>
                                        Sign out
                                    </Text>
                                }
                                icon={<IconLogout size={19} stroke={2} color='red' />} className={classes.link} mb='xl' onClick={(event) => (auth.signOut(auth.user.token))} />


                        </Navbar.Section>

                    </Navbar>
                }
            >

                {outlet}

            </AppShell >


        </>
    )
}









export default BaseLayout
