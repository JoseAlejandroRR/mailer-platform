import { inject, injectable } from 'tsyringe'
import { GatewayRouter } from './GatewayRouter'
import ProvidersController from './controllers/ProvidersController'
import PostCreateProviderRequest from './requests/PostCreateProviderRequest'
import PutUpdateProviderRequest from './requests/PutUpdateProviderRequest'
import GetEmailProviderRequest from './requests/GetEmailProviderRequest'
import GetAllEmailProvidersRequest from './requests/GetAllEmailProvidersRequest'
import DeleteEmailProviderRequest from './requests/DeleteEmailProviderRequest'

@injectable()
class ProvidersRouter extends GatewayRouter {
  
  constructor(
    @inject(ProvidersController) protected controller: ProvidersController
  ) {
    super()
    this.setup()
  }

  setup(): void {

    this.routes.delete('/:providerId',
      ...DeleteEmailProviderRequest,
      this.controller.deleteById.bind(this.controller)
    )

    this.routes.put('/:providerId',
      ...PutUpdateProviderRequest,
      this.controller.updateOne.bind(this.controller)
    )

    this.routes.get('/:providerId',
      ...GetEmailProviderRequest,
      this.controller.getById.bind(this.controller)
    )

    this.routes.post('/',
      ...PostCreateProviderRequest,
      this.controller.createOne.bind(this.controller)
    )

    this.routes.get('/',
      ...GetAllEmailProvidersRequest,
      this.controller.getAll.bind(this.controller)
    )
  }
}

export default ProvidersRouter