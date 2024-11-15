import 'dotenv/config'
import 'reflect-metadata'
import 'tsconfig-paths/register'

import { IEmailRepository } from '@/domain/repositories/IEmailRepository'
import { MockEventBus } from '../mocks/MockEventBust'
import { IProviderRepository } from '@/domain/repositories/IProviderRepository'
import { IEvent } from '@/domain/IEvent'
import MockEmailRepository from '../mocks/MockEmailRepository'
import { EmailProvider } from '@/domain/models/EmailProvider'
import MockProviderRepository from '../mocks/MockProviderRepository'
import EmailSenderManager from '@/application/EmailSenderManager'
import { CreateEmailDto } from '@/domain/dto/CreateEmailDto'
import { EmailAddress } from '@/domain/value-object/EmailAddress'
import { EventType } from '@/domain/EventType'
import { Email } from '@/domain/models/Email'
import MockEmailSenderService from '../mocks/MockEmailSenderService'
import { InvalidArgumentException } from '@/domain/exeptions/InvalidArgumentException'
import { ProviderInvokeException } from '@/domain/exeptions/ProviderInvokeException'
import { MaxRetriesException } from '@/domain/exeptions/MaxRetriesException'

const { MAX_RETRIES_SENDER } = process.env

describe('src/application/EmailSenderManager Unit Tests', () => {

  let mockEmailRepository: IEmailRepository
  let mockProviderRepository: IProviderRepository
  let mockEventBus: MockEventBus
  let mailerSender: EmailSenderManager
  let mockSESService: MockEmailSenderService
  let mockSparkService: MockEmailSenderService
  let mockGmailService: MockEmailSenderService

  const mockProviders = [
    {
        "id": "4bcdb09e-9f6d-4e18-919a-cbabff31e8b3",
        "name": "SparkPost",
        "priority": 2,
        "status": "ACTIVE",
        "createdAt": "2024-11-15T00:38:27.012Z",
        "updatedAt": "2024-11-15T00:38:27.012Z"
    },
    {
        "id": "c0a7b280-5b06-4f18-a6aa-8cd93c52b850",
        "name": "AWS-SES",
        "priority": 1,
        "status": "ACTIVE",
        "createdAt": "2024-11-15T00:38:40.491Z",
        "updatedAt": "2024-11-15T01:45:14.104Z"
    },
    {
      "id": "c0a7b280-5b06-4f18-a6aa-8cd93c52b850",
      "name": "GMAIL",
      "priority": 3,
      "status": "ACTIVE",
      "createdAt": "2024-11-15T00:38:40.491Z",
      "updatedAt": "2024-11-15T01:45:14.104Z"
  },
    {
      "id": "c0a7b280-5b06-4f18-a6aa-8cd93c52b850",
      "name": "AWS-SES",
      "priority": 4,
      "status": "ACTIVE",
      "createdAt": "2024-11-15T00:38:40.491Z",
      "updatedAt": "2024-11-15T01:45:14.104Z"
  }
]

  const handlerFailed = jest.fn(async (event: IEvent) => {
    //console.log(`Evento called: ${event.name}`);
  })

  beforeEach(async () => {

    mockEmailRepository = new MockEmailRepository()
    mockProviderRepository = new MockProviderRepository(
      mockProviders.map((item) => EmailProvider.fromJSON(item))
    )

    mockEventBus = new MockEventBus()
    mockSESService = new MockEmailSenderService('AWS-SES')
    mockSparkService = new MockEmailSenderService('SparkPost')
    mockGmailService = new MockEmailSenderService('GMAIL')

    mailerSender = new EmailSenderManager(
      mockEventBus,
      mockProviderRepository,
      mockEmailRepository,
      [
        mockSESService, mockSparkService, mockGmailService
      ]
    )
  })

  afterEach(() => {
    mockEventBus.clearSubscriptions()
  })

  test('[EmailSenderManager.process]: should send a email successfully', async () => {

    const emailInput: CreateEmailDto = {
      "subject": "Second Email",
      "body": "<h3>Email Welcome!</h3>",
      "to": [
          new EmailAddress("Jose Realza", "josealejandror28@gmail.com")
      ],
      "from":  new EmailAddress("Alejandro Rojas", "jrojas@gmail.com")
    }

    const email = Email.create(emailInput)

    mockSESService.setupAttemps([
      true,
    ])

    await mailerSender.initialize()
    const [err, isSent, attempts, provider] = await mailerSender.process(email)

    expect(isSent).toBe(true)
    expect(attempts).toBe(1)
    expect(provider).toBe(mockSESService.serviceName)

  })

  test('[EmailSenderManager.process]: should fail sending a email', async () => {

    const emailInput: CreateEmailDto = {
      "subject": "Hi Jose",
      "body": "<h3>Email Welcome!</h3>",
      "to": [
          new EmailAddress("Jose Realza", "josealejandror28@gmail.com")
      ],
      "from":  new EmailAddress("Alejandro Rojas", "jrojas@gmail.com")
    }

    const email = Email.create(emailInput)

    mockSESService.setupAttemps([
      false
    ])

    await mailerSender.initialize()
    const [err, isSent, attempts, provider] = await mailerSender.process(email)

    expect(isSent).toBe(false)
    expect(attempts).toBe(2)
    expect(err).toBeInstanceOf(MaxRetriesException)
    expect(provider).toBeUndefined()
  })

  test('[EmailSenderManager.process]: should throw InvalidArgumentException', async () => {

    const emailInput: CreateEmailDto = {
      "subject": "InvalidArgumentException",
      "body": "<h3>Email Welcome!</h3>",
      "to": [
          new EmailAddress("Jose Realza", "josealejandror28@gmail.com")
      ],
      "from":  new EmailAddress("Alejandro Rojas", "jrojas@gmail.com")
    }

    const email = Email.create(emailInput)

    mockSESService.setupAttemps([
      new InvalidArgumentException(),
    ])

    await mailerSender.initialize()
    const [err, isSent, attempts, provider] = await mailerSender.process(email)

    expect(isSent).toBe(false)
    expect(err).toBeInstanceOf(InvalidArgumentException)
    expect(attempts).toBe(1)
    expect(provider).toBe(mockSESService.serviceName)
  })

  test('[EmailSenderManager.process]: should throw MaxRetriesException', async () => {

    const emailInput: CreateEmailDto = {
      "subject": "ProviderInvokeException",
      "body": "<h3>Email Welcome!</h3>",
      "to": [
          new EmailAddress("Jose Realza", "josealejandror28@gmail.com")
      ],
      "from":  new EmailAddress("Alejandro Rojas", "jrojas@gmail.com")
    }

    const email = Email.create(emailInput)

    mockEventBus.subscribe(EventType.Provider.FAILED, handlerFailed)
    mockSESService.setupAttemps([
      new ProviderInvokeException(),
    ])

    await mailerSender.initialize()

    const [err, isSent, attempts, provider] = await mailerSender.process(email)

    expect(isSent).toBe(false)
    expect((err as MaxRetriesException).attempts).toBe(Number(MAX_RETRIES_SENDER))
    expect(attempts).toBe(Number(MAX_RETRIES_SENDER))
    expect(provider).toBeUndefined()
    expect(err).toBeInstanceOf(MaxRetriesException)
    expect(handlerFailed).toHaveBeenCalled()
  })

  test('[EmailSenderManager.process]: should run 2 attempts', async () => {

    const emailInput: CreateEmailDto = {
      "subject": "Hi Jose",
      "body": "<h3>Email Welcome!</h3>",
      "to": [
          new EmailAddress("Jose Realza", "josealejandror28@gmail.com")
      ],
      "from":  new EmailAddress("Alejandro Rojas", "jrojas@gmail.com")
    }

    const email = Email.create(emailInput)

    mockSESService.setupAttemps([
      new ProviderInvokeException(),
    ])

    mockSparkService.setupAttemps([
      true
    ])

    await mailerSender.initialize()
    mailerSender.setup({ failureThreshold: 2, maxTries: 2})

    const [err, isSent, attempts, provider] = await mailerSender.process(email)


    expect(isSent).toBe(true)
    expect(attempts).toBe(2)
    expect(provider).toBe(mockSparkService.serviceName)
  })
})