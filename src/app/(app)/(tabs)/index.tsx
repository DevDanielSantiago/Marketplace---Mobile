import { router } from 'expo-router'
import { useState, useEffect, useMemo } from 'react'
import { TouchableOpacity, FlatList } from 'react-native'
import { Icon, Text, useToast, View } from '@gluestack-ui/themed'
import { UserPhoto } from '@components/UserPhoto'
import { Input } from '@components/Input'
import { ProductCard } from '@components/ProductCard'
import { Loading } from '@components/Loading'
import {
  ProductsFilterModal,
  ProductsFilterProps,
} from '@components/ProductsFilterModal'
import { ToastMessage } from '@components/ToastMessage'
import { ProductDTO } from '@dtos/ProductDTO'
import { useAuth } from '@hooks/useAuth'
import { listAllProducts } from '@services/productsService'
import { AppError } from '@utils/AppError'
import { priceToCents } from '@utils/priceToCents'
import { MoveRight, Search, Filter, User } from 'lucide-react-native'

export default function ProductsScreen() {
  const { sellerLogged } = useAuth()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const toast = useToast()

  const [products, setProducts] = useState<ProductDTO[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  const [search, setSearch] = useState('')

  const defaultFilters: ProductsFilterProps = {
    minPrice: '',
    maxPrice: '',
    categories: [],
  }

  const [filters, setFilters] = useState<ProductsFilterProps>(defaultFilters)

  const filteredProducts = useMemo(() => {
    setIsLoadingProducts(true)

    const filterResult = products.filter((product) => {
      const searchValid =
        !search ||
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())

      const priceValid =
        (!filters.minPrice ||
          product.priceInCents >= priceToCents(filters.minPrice)) &&
        (!filters.maxPrice ||
          product.priceInCents <= priceToCents(filters.maxPrice))

      const categoryValid =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category.slug)

      return searchValid && priceValid && categoryValid
    })

    setIsLoadingProducts(false)

    return filterResult
  }, [products, search, filters])

  function applyFilters(newFilters: ProductsFilterProps) {
    setFilters(newFilters)
    setIsModalVisible(false)
  }

  function clearFilters() {
    setFilters(defaultFilters)
    setIsModalVisible(false)
  }

  function handleProfile() {
    router.navigate('/(app)/(tabs)/profile')
  }

  function handleFilter() {
    setIsModalVisible(true)
  }

  useEffect(() => {
    async function fetchProducts() {
      const { products } = await listAllProducts()
      setProducts(products)
    }

    try {
      setIsLoadingProducts(true)
      fetchProducts()
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os produtos!'

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
      setIsLoadingProducts(false)
    }
  }, [toast])

  return (
    <View flex={1} gap={'$3'} bg={'$background'}>
      <ProductsFilterModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        defaultFilters={filters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      <View
        pt="$16"
        px={'$6'}
        pb={'$6'}
        gap={'$8'}
        bg="$white"
        borderRadius={20}
      >
        <View flexDirection="row" gap={20}>
          {sellerLogged.avatar ? (
            <UserPhoto
              source={sellerLogged.avatar.url}
              width={56}
              height={56}
              alt="Imagem do usuário"
            />
          ) : (
            <View
              width={56}
              height={56}
              rounded={12}
              backgroundColor="$shape"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={User} size="xl" color="$orangeBase" />
            </View>
          )}

          <View gap={4} justifyContent="center">
            <Text color="$gray500" fontFamily="$heading" fontSize={'$title_sm'}>
              Olá, {sellerLogged.name}!
            </Text>

            <TouchableOpacity onPress={handleProfile}>
              <View flexDirection="row" gap={'$2'}>
                <Text
                  color="$orangeBase"
                  fontFamily="$action"
                  fontSize={'$action_sm'}
                >
                  Ver perfil
                </Text>

                <Icon as={MoveRight} color="$orangeBase" size={'lg'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View gap={4}>
          <Text color="$gray500" fontFamily="$body" fontSize={'$body_sm'}>
            Explore produtos
          </Text>

          <View flexDirection="row" gap={'$4'} alignItems="flex-end">
            <View flex={1}>
              <Input
                variant="underlined"
                icon={Search}
                placeholder="Pesquisar"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <TouchableOpacity onPress={handleFilter}>
              <View
                borderWidth={1}
                borderColor="$orangeBase"
                borderRadius={10}
                p="$2"
              >
                <Icon as={Filter} color="$orangeBase" size={'md'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isLoadingProducts ? (
        <Loading />
      ) : (
        <View flex={1} mx={'6%'}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                onPress={() => router.push(`/product/${item.id}`)}
                data={item}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{
              gap: '8%',
              width: '40%',
              marginBottom: 8,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  )
}
