/*
 * Importa o Express.
 */
import express from "express";

/*
 * Importa o Controller.
 */
import AlunoController
    from "../controller/aluno-controller.js";

/*
 * Cria o Router dos alunos.
 */
const router = express.Router();

/*
 * GET /api/alunos
 *
 * Lista todos os alunos.
 */
router.get(
    "/",
    AlunoController.listar
);

/*
 * GET /api/alunos/:id
 *
 * Consulta um aluno pelo ID.
 */
router.get(
    "/:id",
    AlunoController.buscarPorId
);

/*
 * POST /api/alunos
 *
 * Cadastra um aluno.
 */
router.post(
    "/",
    AlunoController.cadastrar
);

/*
 * PUT /api/alunos/:id
 *
 * Atualiza todos os campos editáveis do aluno.
 */
router.put(
    "/:id",
    AlunoController.atualizar
);

/*
 * DELETE /api/alunos/:id
 *
 * Exclui um aluno.
 */
router.delete(
    "/:id",
    AlunoController.remover
);

/*
 * Exporta o Router.
 */
export default router;