import { useState } from 'react'
import {
  Center,
  Icon,
  ScrollView,
  Text,
  useToast,
  View,
} from '@gluestack-ui/themed'
import { TouchableOpacity } from 'react-native'
import { UserPhoto } from '@components/UserPhoto'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ToastMessage } from '@components/ToastMessage'
import { useUserPhoto } from '@hooks/useUserPhoto'
import { useAuth } from '@hooks/useAuth'
import { uploadAttachments } from '@services/attachmentsService'
import { updateCurrentSeller } from '@services/sellersService'
import { AppError } from '@utils/AppError'
import { formatPhone } from '@utils/formatPhone'
import { LogOut, User, Phone, Mail, KeyRound } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

const profileFormSchema = z
  .object({
    name: z
      .string({
        required_error: 'Informe o seu nome completo',
      })
      .min(3, 'Informe o seu nome completo'),
    phone: z
      .string({
        required_error: 'Informe o seu telefone',
      })
      .refine(
        (val) => {
          const digitsOnly = val.replace(/\D/g, '')
          return digitsOnly.length === 10 || digitsOnly.length === 11
        },
        {
          message: 'Telefone inválido',
        },
      ),
    email: z
      .string({
        required_error: 'Informe o seu e-mail',
      })
      .email('E-mail inválido'),

    password: z
      .string()
      .transform((value) => value || undefined)
      .optional(),

    newPassword: z
      .string()
      .transform((value) => value || undefined)
      .optional(),

    newPasswordConfirmation: z
      .string()
      .transform((value) => value || undefined)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && !data.password) {
      ctx.addIssue({
        path: ['password'],
        message: 'Informe a senha atual',
        code: 'custom',
      })
    }

    if (data.newPassword && data.newPassword.length < 3) {
      ctx.addIssue({
        path: ['newPassword'],
        message: 'A nova senha deve ter pelo menos 3 caracteres',
        code: 'custom',
      })
    }

    if (data.newPassword && data.newPassword === data.password) {
      ctx.addIssue({
        path: ['newPassword'],
        message: 'A nova senha tem que ser diferente da senha atual',
        code: 'custom',
      })
    }

    if (data.newPassword && !data.newPasswordConfirmation) {
      ctx.addIssue({
        path: ['newPasswordConfirmation'],
        message: 'Confirme a nova senha',
        code: 'custom',
      })
    }

    if (data.newPassword && data.newPassword !== data.newPasswordConfirmation) {
      ctx.addIssue({
        path: ['newPasswordConfirmation'],
        message: 'A confirmação da nova senha não coincide',
        code: 'custom',
      })
    }
  })

type ProfileForm = z.infer<typeof profileFormSchema>

export default function ProfileScreen() {
  const { userPhoto, handleUserPhotoSelect, isNewPhoto, setIsNewPhoto } =
    useUserPhoto()
  const { sellerLogged, signOut, updateSellerLogged } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)

  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: sellerLogged.name,
      phone: formatPhone(sellerLogged.phone),
      email: sellerLogged.email,
    },
  })

  async function handleUpdateProfile(data: ProfileForm) {
    try {
      setIsUpdating(true)

      let avatarId = ''

      if (isNewPhoto) {
        const files = new FormData()
        files.append('files', userPhoto as unknown as Blob)

        const uploadedPhoto = await uploadAttachments({ files })
        const attachmentId = uploadedPhoto?.attachments[0]?.id

        if (!attachmentId) {
          throw new Error()
        }

        avatarId = attachmentId
        setIsNewPhoto(false)
      }

      const response = await updateCurrentSeller(
        data && avatarId ? { avatarId, ...data } : data,
      )

      const sellerLoggedUpdated = response?.seller
      updateSellerLogged(sellerLoggedUpdated)

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title="Perfil atualizado com sucesso!"
            onClose={() => toast.close(id)}
          />
        ),
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar o perfil!'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View flex={1} bg={'$background'}>
        <View position="relative">
          <Center mt="$16" mb="$8">
            <TouchableOpacity onPress={handleUserPhotoSelect}>
              <UserPhoto
                width={120}
                height={120}
                source={
                  userPhoto?.uri ? userPhoto.uri : sellerLogged?.avatar?.url
                }
                alt="Imagem do usuário"
              />
            </TouchableOpacity>
            <View position="absolute" top={0} right={24}>
              <TouchableOpacity onPress={signOut}>
                <View
                  borderWidth={1}
                  borderColor="$redDanger"
                  borderRadius={10}
                  p="$2"
                >
                  <Icon as={LogOut} color="$redDanger" size="xl" />
                </View>
              </TouchableOpacity>
            </View>
          </Center>
        </View>

        <View flex={1} px={'$10'} pb={'$4'} gap={'$5'}>
          <Center gap={'$5'}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="underlined"
                  label="Nome"
                  icon={User}
                  placeholder="Seu nome completo"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="underlined"
                  label="Telefone"
                  icon={Phone}
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  onChangeText={(text) => onChange(formatPhone(text))}
                  value={value}
                  errorMessage={errors.phone?.message}
                />
              )}
            />
          </Center>

          <View gap="$5">
            <Text
              color="$gray500"
              fontFamily="$heading"
              fontSize={'$title_sm'}
              lineHeight={'$title_sm'}
            >
              Acesso
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="underlined"
                  label="E-mail"
                  icon={Mail}
                  placeholder="mail@exemplo.br"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="underlined"
                  label="Senha atual"
                  type="password"
                  icon={KeyRound}
                  placeholder="Sua senha"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="underlined"
                  label="Nova senha"
                  type="password"
                  icon={KeyRound}
                  placeholder="Sua nova senha"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.newPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="newPasswordConfirmation"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="underlined"
                  label="Confirmar nova senha"
                  id="newPasswordConfirmation"
                  type="password"
                  icon={KeyRound}
                  placeholder="Confirme sua nova senha"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.newPasswordConfirmation?.message}
                  onSubmitEditing={handleSubmit(handleUpdateProfile)}
                  returnKeyType="send"
                />
              )}
            />
          </View>

          <Button
            title="Atualizar cadastro"
            isLoading={isUpdating}
            onPress={handleSubmit(handleUpdateProfile)}
          />
        </View>
      </View>
    </ScrollView>
  )
}
