import fastify from "fastify";
import { PrismaClient } from "@prisma/client"; //para conectar com o banco de dados
import { z } from "zod";

//rotas
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { voteOnPoll } from "./routes/vote-on-poll";
import cookie from "@fastify/cookie";

const app = fastify();

app.register(cookie, {
  secret: "polls-app-nlw", // for cookies signature
  hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
})

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.listen({ port: 3000 }).then(() => {
  console.log("HTTP server runnig!");
});

// Driver Nativo
// ORMs (bibliotecas que trazem ferramentas para a gente trabalhar com banco de dados)

//
