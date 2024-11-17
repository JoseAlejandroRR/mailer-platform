import { useState } from 'react'
import { EmailProviderDto } from '../models/ProviderEmailDto'
import ProvidersServiceAPI from '../services/ProvidersServiceAPI'
import { CreateEmailProviderDto } from '../models/CreateEmailProviderDto'
import { UpdateEmailProviderDto } from '../models/UpdateEmailProviderDto'

const providerService = new ProvidersServiceAPI()

const useProviders = () => {
  const [providers, setProviders] = useState<EmailProviderDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAllProviders = async (): Promise<EmailProviderDto[]> => {
    setLoading(true)
    try {
      const data = await providerService.getAll()
      setProviders(data.sort((a, b) => a.name.localeCompare(b.name)))
      return data
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
    return []
  }

  const getProviderById = async (providerId: string): Promise<EmailProviderDto | null> => {
    setLoading(true)
    try {
      const data = await providerService.getById(providerId)
      return data
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
    return null
  }

  const createProvider = async (input: CreateEmailProviderDto): Promise<EmailProviderDto | null> => {
    setLoading(true)
    try {
      const data = await providerService.createOne(input)

      return data
    } catch (err) {
      setError((err as Error).message)
      throw err
    } finally {
      setLoading(false)
      return null
    }
  }

  const updateProvider = async (
    id: string, data: UpdateEmailProviderDto
  ): Promise<EmailProviderDto | null> => {
    setLoading(true)
    try {
      const updatedProvider = await providerService.updateOne(id, data)

      setProviders(
        providers.map((item) => (item.id === id ? updatedProvider : item))
      )
      return updatedProvider
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
    return null
  }

  const deleteById = async (providerId: string): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await providerService.deleteById(providerId)
      return res
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
    return false
  }

  return {
    providers,
    loading,
    error,
    getProviderById,
    getAllProviders,
    createProvider,
    updateProvider,
    deleteById
  }
}

export default useProviders
