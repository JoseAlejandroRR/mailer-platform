import Exception from './Exception'

export class EntityNotFoundException extends Exception {
  constructor(entity: Function, entityId?: string) {
    super(
      'ENTITY_NOT_FOUND',
      `The entity '${entity.name}' with ID '${entityId}' was not found.`,
      404
    )
  }
}

export default EntityNotFoundException
