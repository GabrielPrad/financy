import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'
import http from 'node:http'
import { corsOrigins, env } from './lib/env.js'
import { prisma } from './lib/prisma.js'
import { createContext, type GraphQLContext } from './graphql/context.js'
import { resolvers } from './graphql/resolvers/index.js'
import { typeDefs } from './graphql/typeDefs.js'

async function main() {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  // CORS habilitado para o front-end consumir a API de outra origem.
  app.use(
    cors<cors.CorsRequest>({
      origin: corsOrigins,
      credentials: true,
    }),
  )

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok', uptime: process.uptime() })
  })

  app.use('/graphql', express.json({ limit: '1mb' }), expressMiddleware(server, {
    context: createContext,
  }))

  await new Promise<void>((resolve) => httpServer.listen({ port: env.PORT }, resolve))

  console.log(`\n  Financy API rodando em http://localhost:${env.PORT}/graphql`)
  console.log(`  CORS liberado para: ${Array.isArray(corsOrigins) ? corsOrigins.join(', ') : corsOrigins}\n`)

  const shutdown = async () => {
    await server.stop()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main().catch(async (error) => {
  console.error('Falha ao iniciar o servidor:', error)
  await prisma.$disconnect()
  process.exit(1)
})
