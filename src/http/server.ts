import fastify from "fastify";
import { PrismaClient } from "@prisma/client"; //para conectar com o banco de dados
import { z } from "zod";
import { UNABLE_TO_FIND_POSTINSTALL_TRIGGER__ENVAR_MISSING } from "@prisma/client/scripts/postinstall.js";

const app = fastify();
const prisma = new PrismaClient();

//metodos basicos do http
// GET, POST, PUT, DELETE, PATCH, (HEAD, OPTIONS) = menos utilizadas

app.post("/polls", async (req, res) => {
  const createPollBody = z.object({
    title: z.string(),
  });

  const { title } = createPollBody.parse(req.body);

  const poll = await prisma.poll.create({
    data: {
      title,
    },
  });

  return res.status(201).send({ pollId: poll.id });
});

app.listen({ port: 3000 }).then(() => {
  console.log("HTTP server runnig!");
});

// Driver Nativo
// ORMs (bibliotecas que trazem ferramentas para a gente trabalhar com banco de dados)

//
