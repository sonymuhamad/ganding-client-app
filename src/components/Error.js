import { Title, Text, Button, Container, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useErrorPageStyle } from '../styles/useErrorPageStyle';

export default function Error() {
    const { classes } = useErrorPageStyle()

    return (
        <Container className={classes.root}>
            <div className={classes.label}>404</div>
            <Title className={classes.title}>Nothing to see here.</Title>
            <Text color="dimmed" size="lg" align="center" className={classes.description}>
                You may have mistyped the address, or the page has
                been moved to another URL.
            </Text>
            <Group position="center">
                <Button variant="subtle" size="md" component={Link} to='/home'  >
                    Take me back to home page
                </Button>
            </Group>
        </Container>
    );
}
