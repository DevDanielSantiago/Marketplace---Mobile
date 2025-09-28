import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Linking, TouchableOpacity } from 'react-native'
import {
  View,
  Text,
  Icon,
  Image,
  ScrollView,
  useToast,
} from '@gluestack-ui/themed'
import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ToastMessage } from '@components/ToastMessage'
import { ProductDTO } from '@dtos/ProductDTO'
import { countProductViewsInTheLastSevenDays } from '@services/metricsService'
import { getProductById } from '@services/productsService'
import { AppError } from '@utils/AppError'
import { centsToPrice } from '@utils/centsToPrice'
import { ChartColumn, MoveLeft } from 'lucide-react-native'

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams()

  const toast = useToast()

  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)
  const [isLoadingProductDetails, setIsLoadingProductDetails] = useState(true)

  const [productViews, setProductViews] = useState(0)
  const [
    isLoadingProductViewsInTheLastSevenDays,
    setIsLoadingProductViewsInTheLastSevenDays,
  ] = useState(true)

  async function fecthProductDetails() {
    try {
      setIsLoadingProductDetails(true)

      const response = await getProductById({ id: String(id) })
      setProduct(response?.product)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do produto!'

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
      setIsLoadingProductDetails(false)
    }
  }

  async function fecthProductViewsInTheLastSevenDays() {
    try {
      setIsLoadingProductViewsInTheLastSevenDays(true)

      const response = await countProductViewsInTheLastSevenDays({
        id: String(id),
      })

      setProductViews(response?.amount)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar a quantidade de visualizações que o produto teve nos últimos 7 dias!'

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
      setIsLoadingProductViewsInTheLastSevenDays(false)
    }
  }

  function handleGoBack() {
    router.back()
  }
  function handlePhoneContact() {
    const phoneNumber = `55${product.owner.phone.replace(/\D/g, '')}`
    const message = encodeURIComponent(
      `Olá, ${product.owner.name}! Estou interessado no produto "${product.title}"!`,
    )
    const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${message}`

    Linking.openURL(whatsAppUrl).catch(() => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={'Não foi possível abrir o WhatsApp!'}
            onClose={() => toast.close(id)}
          />
        ),
      })
    })
  }

  useEffect(() => {
    async function fetchProductDetailsScreenData() {
      await Promise.all([
        fecthProductDetails(),
        fecthProductViewsInTheLastSevenDays(),
      ])
    }

    fetchProductDetailsScreenData()
  }, [id])

  return (
    <View flex={1} bg={'$background'}>
      {isLoadingProductDetails ? (
        <Loading />
      ) : (
        <View flex={1}>
          <View flex={1} gap={'$4'} px={'$6'} mt="$16">
            <TouchableOpacity onPress={handleGoBack}>
              <View flexDirection="row" gap={'$2'} p={2} alignItems="flex-end">
                <Icon as={MoveLeft} color="$orangeBase" size={'lg'} />

                <Text
                  color="$orangeBase"
                  fontFamily="$action"
                  fontSize={'$action_sm'}
                  lineHeight={16}
                >
                  Voltar
                </Text>
              </View>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Image
                w="$full"
                h={197}
                mb={'$8'}
                rounded={6}
                source={
                  product?.attachments[0]?.url ? product.attachments[0].url : ''
                }
              />

              <View flex={1} gap={'$7'}>
                <View gap={'$4'}>
                  <View flexDirection="row" justifyContent="space-between">
                    <Text
                      color="$gray400"
                      fontFamily="$heading"
                      fontSize={'$title_md'}
                      flex={1}
                    >
                      {product.title}
                    </Text>

                    <View flexDirection="row" gap={'$1'} alignItems="center">
                      <Text
                        color="$gray500"
                        fontFamily="$label"
                        fontSize={'$label_md'}
                      >
                        R$
                      </Text>

                      <Text
                        color="$gray500"
                        fontFamily="$heading"
                        fontSize={'$title_md'}
                        lineHeight={'$title_md'}
                      >
                        {centsToPrice(product.priceInCents)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    color="$gray400"
                    fontFamily="$body"
                    fontSize={'$body_sm'}
                  >
                    {product.description}
                  </Text>
                </View>

                <View gap={6}>
                  <Text
                    color="$gray500"
                    fontFamily="$heading"
                    fontSize={'$title_xs'}
                  >
                    Categoria
                  </Text>

                  <Text
                    color="$gray400"
                    fontFamily="$body"
                    fontSize={'$body_xs'}
                  >
                    {product.category.title}
                  </Text>
                </View>

                <View
                  flexDirection="row"
                  h={60}
                  gap={'$3'}
                  pl={'$3'}
                  pr={'$4'}
                  py={'$3'}
                  rounded={10}
                  alignItems="center"
                  bg={'$blueLigth'}
                >
                  <View bg={'$blueDark'} p={'$2'} rounded={6}>
                    <Icon as={ChartColumn} color="$white" size={'lg'} />
                  </View>

                  {isLoadingProductViewsInTheLastSevenDays ? (
                    <Loading />
                  ) : (
                    <Text
                      flex={1}
                      color="$gray400"
                      fontFamily="$body"
                      fontSize={'$body_xs'}
                      lineHeight={16.8}
                    >
                      <Text
                        fontWeight="bold"
                        color="$gray400"
                        fontFamily="$body"
                        fontSize={'$body_sm'}
                        lineHeight={16.8}
                      >
                        {productViews} pessoas
                      </Text>{' '}
                      visualizaram este produto nos últimos 7 dias
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>

          <View
            flexDirection="row"
            h={96}
            p={'$6'}
            pb={'$8'}
            bg={'$white'}
            alignItems="center"
            justifyContent="space-between"
            style={{
              elevation: 10,
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
            }}
          >
            <View flexDirection="row" gap={'$1'} alignItems="flex-end">
              <Text color="$gray500" fontFamily="$label" fontSize={'$label_md'}>
                R$
              </Text>

              <Text
                color="$gray500"
                fontFamily="$heading"
                fontSize={'$title_lg'}
                lineHeight={'$title_lg'}
              >
                {centsToPrice(product.priceInCents)}
              </Text>
            </View>

            <Button
              title="Entrar em contato"
              width={172}
              height={40}
              fontSize={14}
              onPress={handlePhoneContact}
            />
          </View>
        </View>
      )}
    </View>
  )
}
