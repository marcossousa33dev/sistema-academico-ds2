/*
 * O Controller coordena Model, View e Service.
 */
const AlunoController = {
    /*
     * Armazena o ID do aluno que está sendo editado.
     *
     * null significa que o formulário está
     * no modo de cadastro.
     */
    idEmEdicao: null,

    /*
     * Inicializa a aplicação.
     */
    async iniciar() {
        /*
         * Localiza os elementos HTML.
         */
        AlunoView.iniciar();

        /*
         * Configura o envio do formulário.
         */
        AlunoView.configurarFormulario(
            AlunoController.salvar
        );

        /*
         * Configura o botão de cancelamento.
         */
        AlunoView.configurarBotaoCancelar(
            AlunoController.cancelarEdicao
        );

        /*
         * Configura os botões da tabela.
         */
        AlunoView.configurarAcoesTabela(
            AlunoController.iniciarEdicao,
            AlunoController.excluir
        );

        AlunoView.exibirMensagem(
            "Carregando alunos...",
            "informacao"
        );

        try {
            await AlunoController
                .atualizarVisualizacao();

            AlunoView.exibirMensagem(
                "Dados carregados com sucesso.",
                "sucesso"
            );
        } catch (erro) {
            AlunoView.exibirMensagem(
                erro.message,
                "erro"
            );
        }
    },

    /*
     * Cadastra ou atualiza um aluno.
     *
     * A operação depende do valor armazenado
     * em idEmEdicao.
     */
    async salvar(evento) {
        evento.preventDefault();

        /*
         * Lê os dados do formulário.
         */
        const dadosInformados =
            AlunoView.lerDados();

        /*
         * Valida os dados no Model do frontend.
         */
        const validacao =
            AlunoModel.validar(dadosInformados);

        if (!validacao.sucesso) {
            AlunoView.exibirMensagem(
                validacao.mensagem,
                "erro"
            );

            return;
        }

        AlunoView.alterarEstadoFormulario(true);

        try {
            let resultado;

            /*
             * Se idEmEdicao for null, realizamos
             * um novo cadastro.
             */
            if (AlunoController.idEmEdicao === null) {
                AlunoView.exibirMensagem(
                    "Cadastrando aluno...",
                    "informacao"
                );

                resultado =
                    await AlunoService.cadastrar(
                        validacao.dados
                    );
            } else {
                /*
                 * Se existe um ID, atualizamos
                 * o aluno selecionado.
                 */
                AlunoView.exibirMensagem(
                    "Atualizando aluno...",
                    "informacao"
                );

                resultado =
                    await AlunoService.atualizar(
                        AlunoController.idEmEdicao,
                        validacao.dados
                    );
            }

            /*
             * Atualiza a tabela depois da operação.
             */
            await AlunoController
                .atualizarVisualizacao();

            /*
             * Limpa o modo de edição.
             */
            AlunoController.idEmEdicao = null;

            AlunoView.limparFormulario();
            AlunoView.alterarModoEdicao(false);

            /*
             * Mostra a mensagem enviada pela API.
             */
            AlunoView.exibirMensagem(
                resultado.mensagem,
                "sucesso"
            );
        } catch (erro) {
            AlunoView.exibirMensagem(
                erro.message,
                "erro"
            );
        } finally {
            AlunoView.alterarEstadoFormulario(false);
        }
    },

    /*
     * Inicia a edição de um aluno.
     */
    async iniciarEdicao(id) {
        AlunoView.exibirMensagem(
            "Carregando dados do aluno...",
            "informacao"
        );

        try {
            /*
             * Consulta os dados completos na API.
             *
             * GET /api/alunos/:id
             */
            const aluno =
                await AlunoService.buscarPorId(id);

            /*
             * Guarda o ID selecionado.
             */
            AlunoController.idEmEdicao = id;

            /*
             * Preenche o formulário.
             */
            AlunoView.preencherFormulario(aluno);

            /*
             * Coloca o formulário no modo de edição.
             */
            AlunoView.alterarModoEdicao(true);

            /*
             * Move a página até o formulário.
             */
            AlunoView.irParaFormulario();

            AlunoView.exibirMensagem(
                "Altere os dados e clique em Atualizar aluno.",
                "informacao"
            );
        } catch (erro) {
            AlunoView.exibirMensagem(
                erro.message,
                "erro"
            );
        }
    },

    /*
     * Cancela a edição atual.
     */
    cancelarEdicao(evento) {
        /*
         * O encadeamento opcional permite chamar
         * esse método mesmo sem receber um evento.
         */
        evento?.preventDefault();

        AlunoController.idEmEdicao = null;

        AlunoView.limparFormulario();
        AlunoView.alterarModoEdicao(false);

        AlunoView.exibirMensagem(
            "Edição cancelada.",
            "informacao"
        );
    },

    /*
     * Exclui um aluno.
     */
    async excluir(id) {
        /*
         * Pergunta ao usuário se deseja continuar.
         */
        const confirmou =
            AlunoView.confirmarExclusao();

        if (!confirmou) {
            return;
        }

        AlunoView.exibirMensagem(
            "Excluindo aluno...",
            "informacao"
        );

        try {
            /*
             * Executa:
             *
             * DELETE /api/alunos/:id
             */
            const resultado =
                await AlunoService.remover(id);

            /*
             * Se o aluno excluído estava em edição,
             * cancelamos o modo de edição.
             */
            if (
                AlunoController.idEmEdicao === id
            ) {
                AlunoController.idEmEdicao = null;

                AlunoView.limparFormulario();
                AlunoView.alterarModoEdicao(false);
            }

            /*
             * Consulta novamente a lista.
             */
            await AlunoController
                .atualizarVisualizacao();

            AlunoView.exibirMensagem(
                resultado.mensagem,
                "sucesso"
            );
        } catch (erro) {
            AlunoView.exibirMensagem(
                erro.message,
                "erro"
            );
        }
    },

    /*
     * Consulta a API e atualiza a tabela e o JSON.
     */
    async atualizarVisualizacao() {
        const alunos =
            await AlunoService.listar();

        AlunoView.exibirLista(alunos);
        AlunoView.exibirJson(alunos);
    }
};

/*
 * Inicia a aplicação.
 */
AlunoController.iniciar();