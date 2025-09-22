import { useFonts } from '@hooks/useFonts'
import { Slot, Stack } from 'expo-router'
import { StatusBar } from 'react-native'
import { Center, GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '../../config/gluestack-ui.config'
import { Loading } from '@components/Loading'
import { AuthContextProvider } from '@contexts/AuthContext'

export default function RootLayout() {
  const fontsLoaded = useFonts()

  return (
    <GluestackUIProvider config={config}>
      <StatusBar backgroundColor="transparent" translucent />
      <AuthContextProvider>
        {fontsLoaded ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Slot />
          </Stack>
        ) : (
          <Center flex={1} bg="$background">
            <Loading />
          </Center>
        )}
      </AuthContextProvider>
    </GluestackUIProvider>
  )
}
