import { Outlet } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { AuthContext, LoaderContext } from './context/'
import { useMemo } from 'react'
import { useAuth } from './hooks/useAuth'
import { NotificationsProvider } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'


import { Chart, registerables } from 'chart.js';
import { useLoader } from './hooks/useLoader'

function App() {
  Chart.register(...registerables)
  const props = useAuth()
  const { Loader, changeVisibility } = useLoader()

  const value = useMemo(() => ({ ...props }), [props])
  const loaderValue = useMemo(() => ({ changeVisibility: changeVisibility }), [changeVisibility])

  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: 'Noto Sans , sans-serif',
          spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
          colorScheme: 'light',
          primaryColor: 'blue',
          defaultRadius: 0,
          headings: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: 1000
          },
          components: {
            Button: {
              styles: (theme, params) => ({
                root: {
                  height: 42,
                  padding: '0,30px',
                  backgroundColor: params.variant === 'filled' ? theme.colors[params.color || theme.primaryColor[9]] : undefined,
                },
              })
            },
          },
        }}>


        <AuthContext.Provider value={value} >

          <NotificationsProvider>

            <ModalsProvider>

              <LoaderContext.Provider value={loaderValue} >

                <Loader />
                <Outlet />

              </LoaderContext.Provider>

            </ModalsProvider>

          </NotificationsProvider>

        </AuthContext.Provider>

      </MantineProvider>

    </>
  );
}

export default App;
