
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { Consumer } from 'sqs-consumer'
import { EventException } from '@/domain/exeptions/EventException'
import { Callback, IQueueService, MessageObject, Queue } from '@/domain/IQueueService'

const { AWS_REGION } = process.env

const emitter = new SQSClient({ region: AWS_REGION })

class SQSProvider implements IQueueService {

  publish(queue: Queue, object: MessageObject, callback?: Callback): void {
    const { data } = object
    const params = {
      MessageBody: JSON.stringify(data),
      QueueUrl: queue.url,
      DelaySeconds: 0
    }

    emitter
      .send(new SendMessageCommand(params))
      .then((data) => {
        if (callback) {
          callback(null, data)
        }
      })
      .catch((err: Error) => {

        if (callback) {
          callback(new EventException(err.message), null)
        }
      })
  }

  consumer(
    queue: Queue,
    onReceive?: (message: any) => void,
    onError?: (error: Error) => void
  ): void {
    const app = Consumer.create({
      queueUrl: queue.url,
      handleMessage: async (message: any) => {
        if (onReceive) {
          onReceive(message)
        }
      }
    })

    app.on('error', (err: Error) => {
      if (onError) {
        onError(err)
      }
    })

    app.on('processing_error', (err) => {
      if (onError) {
        onError(err)
      }
    })

    app.start()
  }
}

export default SQSProvider
