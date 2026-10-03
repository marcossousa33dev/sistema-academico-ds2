/*
 * A View é responsável pela interface.
 *
 * Ela lê o formulário, apresenta mensagens,
 * atualiza a tabela e exibe o JSON.
 */
const AlunoView = {
    /*
     * Armazena referências aos elementos HTML.
     */
    elementos: {},

    /*
     * Localiza os elementos da página.
     *
     * Este método deve ser executado somente
     * depois que o HTML estiver carregado.
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
            document.querySelector("#corpo-tabela-alunos");

        AlunoView.elementos.saidaJson =
            document.querySelector("#saida-json");

        AlunoView.elementos.botaoSalvar =
            document.querySelector("#botao-salvar");
    },

    /*
     * Registra a função que será executada
     * quando o formulário for enviado.
     */
    configurarFormulario(aoEnviar) {
        AlunoView.elementos.formulario.addEventListener(
            "submit",
            aoEnviar
        );
    },

    /*
     * Lê os valores digitados no formulário.
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
     * Apresenta uma mensagem na interface.
     *
     * O tipo pode ser:
     *
     * - sucesso;
     * - erro;
     * - informacao.
     */
    exibirMensagem(mensagem, tipo) {
        AlunoView.elementos.mensagem.textContent = mensagem;

        AlunoView.elementos.mensagem.className =
            `mensagem ${tipo}`;
    },

    /*
     * Cria uma célula da tabela.
     *
     * textContent é utilizado para inserir o texto
     * de forma segura, sem interpretá-lo como HTML.
     */
    criarCelula(valor) {
        const celula = document.createElement("td");

        celula.textContent = valor;

        return celula;
    },

    /*
     * Exibe a lista de alunos na tabela.
     */
    exibirLista(alunos) {
        /*
         * Remove as linhas exibidas anteriormente.
         */
        AlunoView.elementos.corpoTabela.innerHTML = "";

        /*
         * Se o array estiver vazio, cria uma linha
         * informando que não existem alunos.
         */
        if (alunos.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 7;
            celula.textContent =
                "Nenhum aluno foi cadastrado.";

            linha.appendChild(celula);

            AlunoView.elementos.corpoTabela.appendChild(
                linha
            );

            return;
        }

        /*
         * Cria uma linha para cada aluno recebido.
         */
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

            AlunoView.elementos.corpoTabela.appendChild(
                linha
            );
        });
    },

    /*
     * Exibe os alunos no formato JSON.
     */
    exibirJson(alunos) {
        AlunoView.elementos.saidaJson.textContent =
            JSON.stringify(alunos, null, 2);
    },

    /*
     * Limpa os campos depois de um cadastro.
     */
    limparFormulario() {
        AlunoView.elementos.formulario.reset();

        /*
         * Devolve o foco para o campo RA.
         */
        AlunoView.elementos.ra.focus();
    },

    /*
     * Altera o estado do formulário durante
     * uma operação assíncrona.
     */
    alterarEstadoFormulario(processando) {
        /*
         * Impede vários envios enquanto a requisição
         * estiver em andamento.
         */
        AlunoView.elementos.botaoSalvar.disabled =
            processando;

        /*
         * Modifica o texto apresentado no botão.
         */
        AlunoView.elementos.botaoSalvar.textContent =
            processando ? "Salvando..." : "Cadastrar aluno";
    }
};
