import { Hono } from 'hono'

export abstract class GatewayRouter {

  public routes = new Hono()

  abstract setup(): void
}
