import type { FastifyInstance, FastifyRequest } from "fastify";

export interface AuthUser {
  id: string;
  wallet: string;
}

export async function authPlugin(app: FastifyInstance): Promise<void> {
  app.decorateRequest("authUser", null);

  app.addHook("preHandler", async (request) => {
    request.authUser = {
      id: "user_demo",
      wallet: "0x1234fA8E91c0B2dE3aA4578f90bC5678"
    };
  });
}

export function getUser(request: FastifyRequest): AuthUser {
  return request.authUser ?? {
    id: "user_demo",
    wallet: "0x1234fA8E91c0B2dE3aA4578f90bC5678"
  };
}

declare module "fastify" {
  interface FastifyRequest {
    authUser: AuthUser | null;
  }
}
