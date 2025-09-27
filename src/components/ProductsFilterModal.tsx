import { ComponentProps, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Text,
  Heading,
  Icon,
  Modal as GluestackModal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  View,
  Center,
  useToast,
} from '@gluestack-ui/themed'
import { Input } from '@components/Input'
import { Checkbox } from '@components/Checkbox'
import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ToastMessage } from '@components/ToastMessage'
import { CategoryDTO } from '@dtos/CategoryDTO'
import { listAllCategories } from '@services/categoriesService'
import { AppError } from '@utils/AppError'
import { formatCurrency } from '@utils/formatCurrency'
import { X } from 'lucide-react-native'

export type ProductsFilterProps = {
  minPrice: string
  maxPrice: string
  categories: string[]
}

type ProductsFilterModalProps = ComponentProps<typeof GluestackModal> & {
  defaultFilters: ProductsFilterProps
  onApplyFilters: (filters: ProductsFilterProps) => void
  onClearFilters: () => void
}

export function ProductsFilterModal({
  onClose,
  defaultFilters,
  onApplyFilters,
  onClearFilters,
  ...props
}: ProductsFilterModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductsFilterProps>({
    defaultValues: defaultFilters,
  })

  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const [isClearingFilters, setIsClearingFilters] = useState(false)

  const toast = useToast()

  function handleFilter(data: ProductsFilterProps) {
    onApplyFilters(data)
  }

  function handleClearFilter() {
    setIsClearingFilters(true)

    reset()
    onClearFilters()

    setIsClearingFilters(false)
  }

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoadingCategories(true)

        const categoriesData = await listAllCategories()
        setCategories(categoriesData.categories)
      } catch (error) {
        const isAppError = error instanceof AppError
        const title = isAppError
          ? error.message
          : 'Não foi possível carregar as categorias!'

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
        setIsLoadingCategories(false)
      }
    }

    loadCategories()
  }, [toast])

  return (
    <GluestackModal {...props}>
      <ModalBackdrop />
      <ModalContent
        width={'$full'}
        height={583}
        mt="auto"
        px={10}
        borderTopLeftRadius={28}
        borderTopRightRadius={28}
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
        bg={'$white'}
      >
        <ModalHeader>
          <View flex={1}>
            <Center mb={24}>
              <View bg={'$gray100'} w={56} h={4} opacity={0.3} />
            </Center>

            <View flexDirection="row" justifyContent="space-between">
              <Heading color="$gray500" fontFamily="$heading">
                Filtrar anúncios
              </Heading>

              <ModalCloseButton onPress={onClose}>
                <Icon as={X} color="$gray300" size={'lg'} />
              </ModalCloseButton>
            </View>
          </View>
        </ModalHeader>
        <ModalBody mt={'$2'}>
          <View gap={'$2'}>
            <Text color="$gray400" fontFamily="$heading" fontSize={'$title_xs'}>
              Valor
            </Text>

            <View flexDirection="row" justifyContent="space-between">
              <View w={'48%'}>
                <Controller
                  control={control}
                  name="minPrice"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      variant="underlined"
                      placeholder="De"
                      onChangeText={(text) => {
                        const masked = formatCurrency(text)
                        onChange(masked)
                      }}
                      value={value}
                      keyboardType="number-pad"
                    />
                  )}
                />
              </View>

              <View w={'48%'}>
                <Controller
                  control={control}
                  name="maxPrice"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      variant="underlined"
                      placeholder="Até"
                      onChangeText={(text) => {
                        const masked = formatCurrency(text)
                        onChange(masked)
                      }}
                      value={value}
                      keyboardType="number-pad"
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <View gap={'$5'} mt={'$6'}>
            <Text color="$gray400" fontFamily="$heading" fontSize={'$title_xs'}>
              Categoria
            </Text>

            {isLoadingCategories ? (
              <Loading />
            ) : (
              <View gap={'$5'}>
                {categories.map((category) => (
                  <Controller
                    key={category.id}
                    control={control}
                    name="categories"
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        label={category.title}
                        value={category.slug}
                        isChecked={value.includes(category.slug)}
                        onChange={(isChecked) => {
                          if (isChecked) {
                            onChange([...value, category.slug])
                          } else {
                            onChange(
                              value.filter((slug) => slug !== category.slug),
                            )
                          }
                        }}
                      />
                    )}
                  />
                ))}
              </View>
            )}
          </View>
        </ModalBody>
        <ModalFooter justifyContent="space-between" mb={'$2'}>
          <Button
            width={'48%'}
            height={40}
            fontSize={14}
            title="Limpar filtro"
            variant="outline"
            isLoading={isClearingFilters}
            isDisabled={isSubmitting}
            onPress={handleClearFilter}
          />

          <Button
            width={'48%'}
            height={40}
            fontSize={14}
            title="Filtrar"
            isLoading={isSubmitting}
            isDisabled={isClearingFilters}
            onPress={handleSubmit(handleFilter)}
          />
        </ModalFooter>
      </ModalContent>
    </GluestackModal>
  )
}
