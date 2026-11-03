/*
 * Importa o Model de alunos.
 */
import AlunoModel from "../model/aluno-model.js";

/*
 * O Controller coordena as requisições,
 * chama o Model e produz as respostas.
 */
const AlunoController = {
    /*
     * Lista todos os alunos.
     *
     * GET /api/alunos
     */
    listar(req, res) {
        const alunos = AlunoModel.listar();

        return res.status(200).json({
            total: alunos.length,
            dados: alunos
        });
    },

    /*
     * Consulta um aluno pelo ID.
     *
     * GET /api/alunos/:id
     */
    buscarPorId(req, res) {
        /*
         * Recupera o ID enviado na URL.
         */
        const id = req.params.id;

        /*
         * Solicita a consulta ao Model.
         */
        const resultado =
            AlunoModel.buscarPorId(id);

        /*
         * Trata o aluno não encontrado.
         */
        if (!resultado.sucesso) {
            return res
                .status(resultado.status)
                .json({
                    sucesso: false,
                    mensagem: resultado.mensagem
                });
        }

        /*
         * Envia o aluno encontrado.
         */
        return res.status(200).json({
            sucesso: true,
            dados: resultado.aluno
        });
    },

    /*
     * Cadastra um aluno.
     *
     * POST /api/alunos
     */
    cadastrar(req, res) {
        /*
         * O corpo JSON está disponível
         * na propriedade req.body.
         */
        const dados = req.body;

        const resultado =
            AlunoModel.cadastrar(dados);

        if (!resultado.sucesso) {
            return res
                .status(resultado.status)
                .json({
                    sucesso: false,
                    mensagem: resultado.mensagem
                });
        }

        return res.status(201).json({
            sucesso: true,
            mensagem: "Aluno cadastrado com sucesso.",
            dados: resultado.aluno
        });
    },

    /*
     * Atualiza um aluno.
     *
     * PUT /api/alunos/:id
     */
    atualizar(req, res) {
        /*
         * O ID vem da URL.
         */
        const id = req.params.id;

        /*
         * Os novos dados vêm do corpo JSON.
         */
        const dados = req.body;

        /*
         * Solicita a atualização ao Model.
         */
        const resultado =
            AlunoModel.atualizar(id, dados);

        if (!resultado.sucesso) {
            return res
                .status(resultado.status)
                .json({
                    sucesso: false,
                    mensagem: resultado.mensagem
                });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: "Aluno atualizado com sucesso.",
            dados: resultado.aluno
        });
    },

    /*
     * Exclui um aluno.
     *
     * DELETE /api/alunos/:id
     */
    remover(req, res) {
        /*
         * Recupera o ID informado na URL.
         */
        const id = req.params.id;

        /*
         * Solicita a exclusão ao Model.
         */
        const resultado =
            AlunoModel.remover(id);

        if (!resultado.sucesso) {
            return res
                .status(resultado.status)
                .json({
                    sucesso: false,
                    mensagem: resultado.mensagem
                });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: "Aluno excluído com sucesso.",
            dados: resultado.aluno
        });
    }
};

/*
 * Exporta o Controller.
 */
export default AlunoController;