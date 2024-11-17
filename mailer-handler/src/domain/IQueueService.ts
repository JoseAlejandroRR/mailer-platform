
interface Queue {
  url: string
}

interface MessageObject {
  data: Record<string, any>
  extra?: Record<string, any>
}

type Callback = (error: Error | null, data?: any) => void

interface IQueueService {
  publish(queue: Queue, object: MessageObject, callback?: Callback): Promise<void>
  consumer(
    queue: Queue,
    onReceive?: (message: any) => void,
    onError?: (error: Error) => void
  ): void
}

export { IQueueService, Queue, MessageObject, Callback }
