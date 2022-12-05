import React, { useRef, useEffect, useContext, useState } from "react";
import { Container, Button, Card, Text, TextInput, Title, Image, Paper, PasswordInput, LoadingOverlay } from "@mantine/core";
import Typed from "typed.js";
import { IconUser, IconKey, IconEyeCheck, IconEyeOff, IconLogin } from "@tabler/icons";
import { loginpageStyle } from "../styles";
import { AuthContext } from '../context'
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const auth = useContext(AuthContext)
    const { classes } = loginpageStyle()
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false);

    const form = useForm({
        initialValues: { username: '', password: '' },
    })


    const el = useRef(null)
    const typed = useRef(null)


    const handleLogin = async (data) => {
        setVisible(true)
        try {
            await auth.signIn(data)
        } catch (e) {
            form.setErrors({ ...e.message })
        } finally {
            setVisible(false)
        }
    }

    useEffect(() => {
        if (auth.user !== null) {
            navigate('/home', { replace: true })
        }
        const options = {
            strings: [
                `Ganding Enterprise System`
            ],
            typeSpeed: 75,
            startDelay: 500,
            loop: true,
            fadeOut: true,
            showCursor: false,
        }
        typed.current = new Typed(el.current, options)

        return () => {
            typed.current.destroy()
        }
    }, [])


    return (
        <div className={classes.wrapper}>
            <Container size={900} className={classes.inner}>


                <Paper p='xl' heigth='xl' radius='sm' className={classes.contentRight} >
                    <Card p='sm' radius='sm'>
                        <Image src='/logoganding.png' radius='xl' className={classes.image} />

                        <Text weight={700} color='dimmed' className={classes.textRight} ref={el} size='xl'></Text>

                    </Card>

                </Paper>
                <Paper p='xl' radius='sm'>
                    <Card p='xl' radius='sm'>
                        <Title className={classes.title} align="left"
                            variant="gradient"
                            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                            weight={700}
                            style={{ fontFamily: 'Noto Sans, sans-serif' }} >Welcome</Title>

                        <Text mb='md' align="center" size='lg' color='dimmed' >
                            Sign in to system
                        </Text>
                        <Card.Section>
                            <LoadingOverlay visible={visible} overlayBlur={2} />
                            <form method="post" onSubmit={form.onSubmit(handleLogin)}  >

                                <TextInput
                                    placeholder="Username"
                                    required={true}
                                    icon={<IconUser size={20} />}
                                    {...form.getInputProps('username')}

                                />

                                <PasswordInput
                                    placeholder="Password"
                                    my='lg'
                                    required={true}
                                    icon={<IconKey size={20} />}
                                    visibilityToggleIcon={({ reveal, size }) =>
                                        reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
                                    }
                                    {...form.getInputProps('password')}
                                />

                                <Button fullWidth radius='md' type="submit" leftIcon={<IconLogin size={20} />} >Sign In</Button>
                            </form>

                        </Card.Section>

                    </Card>

                </Paper>


            </Container>
        </div>
    )
}

export default Login

