import { ComponentProps } from 'react'
import {
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  Checkbox as GluestackCheckbox,
} from '@gluestack-ui/themed'
import { Check } from 'lucide-react-native'

type Props = ComponentProps<typeof GluestackCheckbox> & {
  label?: string
}

export function Checkbox({ label, ...props }: Props) {
  return (
    <GluestackCheckbox aria-label={label} gap={8} {...props}>
      <CheckboxIndicator
        borderColor="$gray100"
        $checked-backgroundColor="$orangeBase"
        $checked-borderColor="$orangeDark"
      >
        <CheckboxIcon as={Check} color="white" size={'md'} />
      </CheckboxIndicator>
      <CheckboxLabel
        color="$gray400"
        fontSize={'$body_md'}
        lineHeight={'$body_md'}
      >
        {label}
      </CheckboxLabel>
    </GluestackCheckbox>
  )
}
