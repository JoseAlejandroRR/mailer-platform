export namespace EventType {

  export enum Email {
    CREATED = 'EmailCreatedEvent',
    QUEUED = 'EmailQueuedEvent',
    SENT = 'EmailSentEvent'
  }

  export enum Provider {
    FAILED = 'EmailProviderFailed'
  }

}