/*
 * A View manipula os elementos da interface.
 */
const AlunoView = {
    /*
     * Armazena as referências aos elementos HTML.
     */
    elementos: {},

    /*
     * Indica se o formulário está em modo de edição.
     */
    modoEdicao: false,

    /*
     * Localiza os elementos da página.
     */
    iniciar() {
        AlunoView.elementos.formulario =
            document.querySelector("#form-aluno");

        AlunoView.elementos.ra =
            document.querySelector("#ra");

        AlunoView.elementos.nome =
            document.querySelector("#nome");

        AlunoView.elementos.email =
            document.querySelector("#email");

        AlunoView.elementos.curso =
            document.querySelector("#curso");

        AlunoView.elementos.turma =
            document.querySelector("#turma");

        AlunoView.elementos.mensagem =
            document.querySelector("#mensagem");

        AlunoView.elementos.corpoTabela =
            document.querySelector(
                "#corpo-tabela-alunos"
            );

        AlunoView.elementos.saidaJson =
            document.querySelector("#saida-json");

        AlunoView.elementos.botaoSalvar =
            document.querySelector("#botao-salvar");

        /*
         * Novo botão da versão 1.4.
         */
        AlunoView.elementos.botaoCancelar =
            document.querySelector("#botao-cancelar");
    },

    /*
     * Configura o envio do formulário.
     */
    configurarFormulario(aoEnviar) {
        AlunoView.elementos.formulario
            .addEventListener("submit", aoEnviar);
    },

    /*
     * Configura o botão de cancelamento.
     */
    configurarBotaoCancelar(aoCancelar) {
        AlunoView.elementos.botaoCancelar
            .addEventListener("click", aoCancelar);
    },

    /*
     * Configura os botões de editar e excluir.
     *
     * Utilizamos um único evento no corpo da tabela.
     */
    configurarAcoesTabela(aoEditar, aoExcluir) {
        AlunoView.elementos.corpoTabela
            .addEventListener("click", evento => {
                /*
                 * closest() procura o botão clicado.
                 */
                const botao = evento.target.closest(
                    "button[data-acao]"
                );

                /*
                 * Se o clique não ocorreu em um botão
                 * de ação, encerramos a função.
                 */
                if (!botao) {
                    return;
                }

                /*
                 * Recupera os valores armazenados
                 * nos atributos data-* do botão.
                 */
                const acao = botao.dataset.acao;
                const id = Number(botao.dataset.id);

                if (acao === "editar") {
                    aoEditar(id);
                    return;
                }

                if (acao === "excluir") {
                    aoExcluir(id);
                }
            });
    },

    /*
     * Lê os campos do formulário.
     */
    lerDados() {
        return {
            ra: AlunoView.elementos.ra.value,
            nome: AlunoView.elementos.nome.value,
            email: AlunoView.elementos.email.value,
            curso: AlunoView.elementos.curso.value,
            turma: AlunoView.elementos.turma.value
        };
    },

    /*
     * Preenche o formulário com um aluno
     * recebido da API.
     */
    preencherFormulario(aluno) {
        AlunoView.elementos.ra.value = aluno.ra;
        AlunoView.elementos.nome.value = aluno.nome;
        AlunoView.elementos.email.value = aluno.email;
        AlunoView.elementos.curso.value = aluno.curso;
        AlunoView.elementos.turma.value = aluno.turma;
    },

    /*
     * Apresenta uma mensagem na página.
     */
    exibirMensagem(mensagem, tipo) {
        AlunoView.elementos.mensagem.textContent =
            mensagem;

        AlunoView.elementos.mensagem.className =
            `mensagem ${tipo}`;
    },

    /*
     * Cria uma célula da tabela.
     */
    criarCelula(valor) {
        const celula = document.createElement("td");

        celula.textContent = valor;

        return celula;
    },

    /*
     * Cria um botão de ação.
     */
    criarBotao(texto, classe, acao, id) {
        const botao = document.createElement("button");

        /*
         * Evita que o botão tente enviar
         * algum formulário.
         */
        botao.type = "button";

        botao.textContent = texto;
        botao.className = classe;

        /*
         * Os atributos data-* armazenam informações
         * no próprio elemento HTML.
         */
        botao.dataset.acao = acao;
        botao.dataset.id = id;

        return botao;
    },

    /*
     * Exibe a lista de alunos.
     */
    exibirLista(alunos) {
        /*
         * Limpa as linhas anteriores.
         */
        AlunoView.elementos.corpoTabela.innerHTML = "";

        if (alunos.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            /*
             * Agora a tabela possui oito colunas.
             */
            celula.colSpan = 8;
            celula.textContent =
                "Nenhum aluno foi cadastrado.";

            linha.appendChild(celula);

            AlunoView.elementos.corpoTabela
                .appendChild(linha);

            return;
        }

        alunos.forEach(aluno => {
            const linha = document.createElement("tr");

            linha.appendChild(
                AlunoView.criarCelula(aluno.id)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.ra)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.nome)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.email)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.curso)
            );

            linha.appendChild(
                AlunoView.criarCelula(aluno.turma)
            );

            linha.appendChild(
                AlunoView.criarCelula(
                    aluno.ativo ? "Sim" : "Não"
                )
            );

            /*
             * Cria a célula das ações.
             */
            const celulaAcoes =
                document.createElement("td");

            celulaAcoes.className = "acoes-tabela";

            /*
             * Botão de edição.
             */
            const botaoEditar =
                AlunoView.criarBotao(
                    "Editar",
                    "botao-editar",
                    "editar",
                    aluno.id
                );

            /*
             * Botão de exclusão.
             */
            const botaoExcluir =
                AlunoView.criarBotao(
                    "Excluir",
                    "botao-excluir",
                    "excluir",
                    aluno.id
                );

            celulaAcoes.appendChild(botaoEditar);
            celulaAcoes.appendChild(botaoExcluir);

            linha.appendChild(celulaAcoes);

            AlunoView.elementos.corpoTabela
                .appendChild(linha);
        });
    },

    /*
     * Exibe os dados no formato JSON.
     */
    exibirJson(alunos) {
        AlunoView.elementos.saidaJson.textContent =
            JSON.stringify(alunos, null, 2);
    },

    /*
     * Altera o formulário entre:
     *
     * - modo de cadastro;
     * - modo de edição.
     */
    alterarModoEdicao(editando) {
        AlunoView.modoEdicao = editando;

        /*
         * Mostra ou esconde o botão de cancelamento.
         */
        AlunoView.elementos.botaoCancelar.hidden =
            !editando;

        /*
         * Altera o texto do botão principal.
         */
        AlunoView.elementos.botaoSalvar.textContent =
            editando
                ? "Atualizar aluno"
                : "Cadastrar aluno";
    },

    /*
     * Altera o estado enquanto uma requisição
     * estiver sendo processada.
     */
    alterarEstadoFormulario(processando) {
        AlunoView.elementos.botaoSalvar.disabled =
            processando;

        AlunoView.elementos.botaoCancelar.disabled =
            processando;

        if (processando) {
            AlunoView.elementos.botaoSalvar.textContent =
                AlunoView.modoEdicao
                    ? "Atualizando..."
                    : "Salvando...";

            return;
        }

        AlunoView.elementos.botaoSalvar.textContent =
            AlunoView.modoEdicao
                ? "Atualizar aluno"
                : "Cadastrar aluno";
    },

    /*
     * Limpa o formulário.
     */
    limparFormulario() {
        AlunoView.elementos.formulario.reset();
        AlunoView.elementos.ra.focus();
    },

    /*
     * Solicita a confirmação antes da exclusão.
     */
    confirmarExclusao() {
        return confirm(
            "Deseja realmente excluir este aluno?"
        );
    },

    /*
     * Leva a página até o formulário.
     */
    irParaFormulario() {
        AlunoView.elementos.formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        AlunoView.elementos.ra.focus();
    }
};