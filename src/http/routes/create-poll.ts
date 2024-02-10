//metodos basicos do http
// GET, POST, PUT, DELETE, PATCH, (HEAD, OPTIONS) = menos utilizadas

import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function createPoll(app: FastifyInstance) {
  //rota para a criação de uma enquete
  app.post("/polls", async (req, res) => {
    //const com typagem dos dados que são esperados pela req
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });

    //pega o title que foi enviado na req
    const { title, options } = createPollBody.parse(req.body);

    // cria uma poll que recebe os dados atraves de uma função assincrona
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              return { title: option };
            }),
          },
        },
      },
    });

    //retorna o status e envia a id de volta para o navegador
    return res.status(201).send({ pollId: poll.id });
  });
}
