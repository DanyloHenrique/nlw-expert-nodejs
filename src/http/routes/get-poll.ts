//metodos basicos do http
// GET, POST, PUT, DELETE, PATCH, (HEAD, OPTIONS) = menos utilizadas

import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z, { string } from "zod";

export async function getPoll(app: FastifyInstance) {
  //rota para a criação de uma enquete
  app.get("/polls/:pollID", async (req, res) => {
    //const com typagem dos dados que são esperados pela req
    const getPollsParams = z.object({
      pollID: z.string().uuid(),
    });
    

    //pega o title que foi enviado na req
    const { pollID } = getPollsParams.parse(req.params);

    // cria uma poll que recebe os dados atraves de uma função assincrona
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollID,
      },
      include: {
        options: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    });

    //retorna o status e envia a id de volta para o navegador
    return res.send({ poll });
  });
}
