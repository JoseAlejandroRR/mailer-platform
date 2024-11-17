import { useState } from "react"
import { EmailDto } from "../models/EmailDto"
import EmailsServiceAPI from "../services/EmailsServiceAPI"
import { EmailStatus } from "../models/EmailStatus"
import { CreateEmailDto } from "../models/CreateEmailDto"

const emailService = new EmailsServiceAPI()

type getEmailsByStatusProps = {
  status: EmailStatus
}

const useEmails = () => {
  const [emails, setEmails] = useState<EmailDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getEmailsByStatus = async (opc: getEmailsByStatusProps): Promise<EmailDto[]> => {
    setLoading(true)
    try {
      const data = await emailService.getAll(opc.status)
      setEmails(data)
      return data
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
    return []
  }

  const getEmailById = async (emailId: string): Promise<EmailDto | null> => {
    setLoading(true)
    try {
      const data = await emailService.getById(emailId)
      return data
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
    return null
  }

  const sendEmail = async (input: CreateEmailDto): Promise<EmailDto | null> => {
    setLoading(true)
    try {
      const data = await emailService.sendEmail(input)

      return data
    } catch (err) {
      setError((err as Error).message)
      throw err
    } finally {
      setLoading(false)
    }
    return null
  }

  return {
    emails,
    loading,
    error,
    getEmailsByStatus,
    getEmailById,
    sendEmail,
  }
}

export default useEmails
