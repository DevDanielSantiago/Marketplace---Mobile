import { Icon } from '@gluestack-ui/themed'
import { Tabs } from 'expo-router'
import { Store, User } from 'lucide-react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F24D0D',
        tabBarInactiveTintColor: '#ADADAD',
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 10,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={Store} size={'lg'} color={color} />
          ),
          tabBarLabel: 'Produtos',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={User} size={'lg'} color={color} />
          ),
          tabBarLabel: 'Perfil',
        }}
      />
    </Tabs>
  )
}
