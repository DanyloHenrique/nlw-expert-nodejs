//metodos basicos do http
// GET, POST, PUT, DELETE, PATCH, (HEAD, OPTIONS) = menos utilizadas

import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { randomUUID } from "crypto";

export async function voteOnPoll(app: FastifyInstance) {
  //rota para a criação de uma enquete
  app.post("/polls/:pollId/votes", async (req, res) => {
    //const com typagem dos dados que são esperados pela req
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = voteOnPollParams.parse(req.params);
    const { pollOptionId } = voteOnPollBody.parse(req.body);

    let { sessionId } = req.cookies;

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      });

      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        //apagar o voto
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          },
        });
        //la embaixo vai criar um novo voto
      } else if (userPreviousVoteOnPoll) {
        return res
          .status(400)
          .send({ message: "você já votou nessa opção anteriormente" });
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      res.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, //30 dias
        signed: true,
        httpOnly: true,
      });
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    //retorna o status e envia a id de volta para o navegador
    return res.status(201).send({ message: "voto feito com sucesso" });
  });
}
