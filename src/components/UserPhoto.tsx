import { Image, Center, Icon } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'
import { ImageUp } from 'lucide-react-native'

type Props = ComponentProps<typeof Image>

export function UserPhoto({ source, width, height, ...props }: Props) {
  return (
    <Center
      width={width || 100}
      height={height || 100}
      rounded={12}
      backgroundColor="$shape"
      overflow="hidden"
    >
      {source ? (
        <Image source={source} {...props} size="full" />
      ) : (
        <Center flex={1}>
          <Icon as={ImageUp} size="xl" color="$orangeBase" />
        </Center>
      )}
    </Center>
  )
}
