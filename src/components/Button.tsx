import {
  ButtonSpinner,
  Button as GluestackButton,
  HStack,
  Text,
  Icon,
} from '@gluestack-ui/themed'
import { ComponentProps } from 'react'
import { LucideIcon } from 'lucide-react-native'

type Props = ComponentProps<typeof GluestackButton> & {
  title: string
  icon?: LucideIcon
  fontSize?: number
  isLoading?: boolean
}

export function Button({
  title,
  variant = 'solid',
  icon,
  width,
  height,
  fontSize,
  isLoading = false,
  isDisabled,
  ...props
}: Props) {
  return (
    <GluestackButton
      w={width || '$full'}
      h={height || 56}
      gap={12}
      px={20}
      bg={variant === 'outline' ? 'transparent' : '$orangeBase'}
      borderWidth={variant === 'outline' ? '$1' : '$0'}
      borderColor="$orangeBase"
      rounded={10}
      $active-bg={variant === 'outline' ? '$light100' : '$orangeDark'}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ButtonSpinner
          color={variant === 'outline' ? '$orangeBase' : '$white'}
        />
      ) : (
        <HStack
          flex={1}
          justifyContent={icon ? 'space-between' : 'center'}
          alignItems="center"
        >
          <Text
            color={variant === 'outline' ? '$orangeBase' : '$white'}
            fontFamily="$action"
            fontSize={fontSize || '$md'}
          >
            {title}
          </Text>

          {icon && (
            <Icon
              as={icon}
              color={variant === 'outline' ? '$orangeBase' : '$white'}
              size={'lg'}
            />
          )}
        </HStack>
      )}
    </GluestackButton>
  )
}
