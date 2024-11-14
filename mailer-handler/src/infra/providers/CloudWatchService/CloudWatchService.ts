//import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'

import { EmailProvider } from "@/domain/models/EmailProvider";


class CloudWatchService {
  
  //private cloudwatchClient = new CloudWatchClient({ region: process.env.AWS_REGION || 'us-east-1' })

  async reportProviderFaulire(provider: EmailProvider) {
    const params = {
      Namespace: 'Custom/ProviderMetrics',
      MetricData: [
        {
          MetricName: 'ProviderFailure',
          Dimensions: [
            { Name: 'ProviderName', Value: provider.name }
          ],
          Unit: 'Count',
          Value: 1
        }
      ]
    }
  
    //await this.cloudwatchClient.send(new PutMetricDataCommand(params))
  }
}