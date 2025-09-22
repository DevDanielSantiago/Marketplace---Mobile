import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input as GluestackInput,
  InputField,
  InputSlot,
  InputIcon,
  Pressable,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
} from '@gluestack-ui/themed'
import { ComponentProps, useState } from 'react'
import { Eye, EyeOff, CircleAlert, LucideIcon } from 'lucide-react-native'

type Props = ComponentProps<typeof InputField> & {
  label?: string
  icon?: LucideIcon
  type?: 'text' | 'password'
  variant?: 'outline' | 'underlined'
  errorMessage?: string | null
  isInvalid?: boolean
  isReadOnly?: boolean
}

export function Input({
  label,
  value,
  icon,
  type = 'text',
  variant = 'outline',
  errorMessage = null,
  isInvalid = false,
  isReadOnly = false,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const invalid = !!errorMessage || isInvalid

  const [isFocused, setIsFocused] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <FormControl isInvalid={invalid} w="$full">
      {label && (
        <FormControlLabel>
          <FormControlLabelText
            color={isFocused ? '$orangeBase' : '$gray300'}
            fontFamily="$label"
            fontSize={'$label_md'}
            textTransform="uppercase"
          >
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )}

      <GluestackInput
        variant={variant}
        isInvalid={isInvalid}
        gap={8}
        borderBottomWidth={1}
        borderColor="$gray100"
        isReadOnly={isReadOnly}
        $focus={{
          borderColor: invalid ? '$redDanger' : '$gray400',
        }}
        $invalid={{
          borderColor: '$redDanger',
        }}
      >
        {icon && (
          <InputSlot>
            <InputIcon
              as={icon}
              color={
                invalid
                  ? '$redDanger'
                  : isFocused || value
                    ? '$orangeBase'
                    : '$gray200'
              }
              size="lg"
              alignSelf="center"
            />
          </InputSlot>
        )}

        <InputField
          type={type === 'password' && !showPassword ? 'password' : 'text'}
          px={2}
          fontFamily="$body"
          fontSize={'$body_md'}
          color="$gray400"
          placeholderTextColor={'$gray200'}
          selectionColor="#F24D0D"
          onFocus={() => {
            setIsFocused(true)
            onFocus && onFocus()
          }}
          onBlur={() => {
            setIsFocused(false)
            onBlur && onBlur()
          }}
          value={value}
          {...props}
        />

        {type === 'password' && (
          <Pressable justifyContent="center" onPress={togglePasswordVisibility}>
            <InputIcon
              as={showPassword ? Eye : EyeOff}
              color="$gray300"
              size="lg"
            />
          </Pressable>
        )}
      </GluestackInput>

      <FormControlError>
        <FormControlErrorIcon as={CircleAlert} color="$redDanger" size={'sm'} />
        <FormControlErrorText
          color="$redDanger"
          fontSize={'$body_xs'}
          lineHeight={'$body_xs'}
        >
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}
