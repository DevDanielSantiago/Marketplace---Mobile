/* eslint-disable camelcase */
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'
import {
  useFonts as useGoogleFonts,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans'
import {
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins'

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  const [googleFontsLoaded] = useGoogleFonts({
    DMSans_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  })

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({})
      setFontsLoaded(true)
    }
    loadFonts()
  }, [])

  return googleFontsLoaded && fontsLoaded
}
