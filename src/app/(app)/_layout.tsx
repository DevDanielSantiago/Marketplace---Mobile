import { Stack } from 'expo-router'
import { useAuth } from '@hooks/useAuth'
import SignInScreen from '@app/auth/sign-in'
import { Loading } from '@components/Loading'

export default function PrivateLayout() {
  const { sellerLogged, isLoadingSellerStorageData } = useAuth()

  if (isLoadingSellerStorageData) {
    return <Loading />
  }

  return sellerLogged?.id ? (
    <Stack screenOptions={{ headerShown: false }} />
  ) : (
    <SignInScreen />
  )
}
