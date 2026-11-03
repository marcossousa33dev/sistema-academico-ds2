/*
 * O Service concentra a comunicação do frontend
 * com a API de alunos.
 */
const AlunoService = {
    /*
     * Endereço base dos endpoints de alunos.
     */
    URL_API: "http://localhost:3000/api/alunos",

    /*
     * Processa uma resposta recebida da API.
     */
    async processarResposta(resposta) {
        let resultado;

        try {
            /*
             * Converte a resposta JSON para
             * um objeto JavaScript.
             */
            resultado = await resposta.json();
        } catch (erro) {
            throw new Error(
                "O servidor retornou uma resposta inválida."
            );
        }

        /*
         * resposta.ok será false em respostas
         * como 400, 404, 409 e 500.
         */
        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem ||
                "Não foi possível concluir a operação."
            );
        }

        return resultado;
    },

    /*
     * Executa uma requisição para a API.
     *
     * caminho:
     * complemento adicionado à URL.
     *
     * Exemplos:
     *
     * ""   → /api/alunos
     * "/1" → /api/alunos/1
     */
    async requisitar(caminho = "", opcoes = {}) {
        let resposta;

        try {
            resposta = await fetch(
                `${AlunoService.URL_API}${caminho}`,
                opcoes
            );
        } catch (erro) {
            throw new Error(
                "Não foi possível conectar ao servidor."
            );
        }

        return AlunoService.processarResposta(resposta);
    },

    /*
     * Lista todos os alunos.
     *
     * GET /api/alunos
     */
    async listar() {
        const resultado =
            await AlunoService.requisitar("", {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

        return resultado.dados;
    },

    /*
     * Consulta um aluno pelo ID.
     *
     * GET /api/alunos/:id
     */
    async buscarPorId(id) {
        /*
         * encodeURIComponent() prepara o valor
         * para ser utilizado em uma URL.
         */
        const idSeguro = encodeURIComponent(id);

        const resultado =
            await AlunoService.requisitar(
                `/${idSeguro}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

        return resultado.dados;
    },

    /*
     * Cadastra um aluno.
     *
     * POST /api/alunos
     */
    async cadastrar(aluno) {
        return AlunoService.requisitar("", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aluno)
        });
    },

    /*
     * Atualiza um aluno.
     *
     * PUT /api/alunos/:id
     */
    async atualizar(id, aluno) {
        const idSeguro = encodeURIComponent(id);

        return AlunoService.requisitar(
            `/${idSeguro}`,
            {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },

                /*
                 * Converte os novos dados para JSON.
                 */
                body: JSON.stringify(aluno)
            }
        );
    },

    /*
     * Exclui um aluno.
     *
     * DELETE /api/alunos/:id
     */
    async remover(id) {
        const idSeguro = encodeURIComponent(id);

        return AlunoService.requisitar(
            `/${idSeguro}`,
            {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            }
        );
    }
};