/*
 * MODEL DE ALUNOS
 *
 * O Model é responsável:
 * - pelos dados dos alunos;
 * - pelas validações;
 * - pelas regras do cadastro.
 *
 * Ele não deve utilizar prompt(), alert(), console.log()
 * ou manipular elementos HTML.
 */
const AlunoModel = {

    /*
     * Array que armazena temporariamente os alunos cadastrados.
     *
     * Os dados permanecem apenas na memória do navegador.
     * Se a página for atualizada, o conteúdo será perdido.
     */
    alunos: [],

    /*
     * Padroniza um valor textual antes de utilizá-lo.
     *
     * Se o valor for null ou undefined, devolve uma string vazia.
     * Isso evita erros ao tentar utilizar métodos de texto.
     *
     * String(valor) garante que o valor seja convertido para texto.
     * trim() remove espaços no começo e no final.
     */
    normalizarTexto(valor) {
        if (valor === null || valor === undefined) {
            return "";
        }

        return String(valor).trim();
    },

    /*
     * Realiza uma validação simples do e-mail.
     *
     * Nesta primeira versão, consideramos válido um endereço
     * que contenha os caracteres "@" e ".".
     *
     * O método includes() verifica se determinado texto
     * está presente dentro de uma string.
     *
     * Como utilizamos &&, as duas condições precisam ser verdadeiras.
     */
    validarEmail(email) {
        return email.includes("@") && email.includes(".");
    },

    /*
     * Procura um aluno pelo RA.
     *
     * O método find() percorre o array até encontrar
     * o primeiro aluno cujo RA seja igual ao informado.
     *
     * Se encontrar, devolve o objeto do aluno.
     * Se não encontrar, devolve undefined.
     */
    localizarPorRa(ra) {
        return AlunoModel.alunos.find(
            aluno => aluno.ra === ra
        );
    },

    /*
     * Realiza o cadastro de um aluno.
     *
     * O parâmetro dados deverá ser um objeto com:
     * - ra;
     * - nome;
     * - email;
     * - curso;
     * - turma.
     *
     * Exemplo:
     *
     * {
     *     ra: "2026001",
     *     nome: "Ana Souza",
     *     email: "ana@email.com",
     *     curso: "DSM",
     *     turma: "2 DSM"
     * }
     */
    cadastrar(dados) {

        /*
         * Antes de validar os dados, normalizamos todos os valores.
         *
         * Isso remove espaços desnecessários e evita que valores
         * null ou undefined causem erros durante a execução.
         */
        const ra = AlunoModel.normalizarTexto(dados.ra);
        const nome = AlunoModel.normalizarTexto(dados.nome);
        const email = AlunoModel.normalizarTexto(dados.email);
        const curso = AlunoModel.normalizarTexto(dados.curso);
        const turma = AlunoModel.normalizarTexto(dados.turma);

        /*
         * Verifica se algum campo obrigatório está vazio.
         *
         * O operador || significa "ou".
         * Portanto, basta que uma das condições seja verdadeira
         * para que o cadastro seja recusado.
         */
        if (
            ra === "" ||
            nome === "" ||
            email === "" ||
            curso === "" ||
            turma === ""
        ) {
            /*
             * Em vez de mostrar a mensagem diretamente,
             * o Model devolve um objeto com o resultado.
             *
             * O Controller receberá esse objeto e pedirá
             * para a View apresentar a mensagem.
             */
            return {
                sucesso: false,
                mensagem: "Todos os campos são obrigatórios."
            };
        }

        /*
         * Envia o e-mail para o método validarEmail().
         *
         * O operador ! significa negação.
         * Portanto, esta condição será executada quando
         * o e-mail não for considerado válido.
         */
        if (!AlunoModel.validarEmail(email)) {
            return {
                sucesso: false,
                mensagem: "Informe um e-mail válido."
            };
        }

        /*
         * Verifica se já existe um aluno com o mesmo RA.
         *
         * localizarPorRa() devolve o objeto encontrado
         * ou undefined quando o RA não existe.
         *
         * Se um objeto for devolvido, a condição será verdadeira
         * e o cadastro duplicado será impedido.
         */
        if (AlunoModel.localizarPorRa(ra)) {
            return {
                sucesso: false,
                mensagem: "Já existe um aluno com esse RA."
            };
        }

        /*
         * Como todas as validações foram aprovadas,
         * criamos o objeto que representa o novo aluno.
         */
        const aluno = {

            /*
             * Nesta versão, o identificador é calculado utilizando
             * a quantidade de alunos existentes mais um.
             *
             * Posteriormente, o banco de dados será responsável
             * por gerar esse identificador automaticamente.
             */
            id: AlunoModel.alunos.length + 1,

            // Dados recebidos e normalizados anteriormente.
            ra: ra,
            nome: nome,
            email: email,
            curso: curso,
            turma: turma,

            /*
             * Todo novo aluno começa como ativo.
             *
             * No futuro, esse valor poderá ser alterado sem
             * precisarmos apagar definitivamente o cadastro.
             */
            ativo: true
        };

        /*
         * Adiciona o objeto aluno ao final do array.
         *
         * A partir desse momento, o aluno faz parte
         * dos dados mantidos pelo Model.
         */
        AlunoModel.alunos.push(aluno);

        /*
         * Informa que o cadastro foi concluído com sucesso.
         *
         * Também devolvemos o aluno criado para que o Controller
         * possa encaminhá-lo para a View.
         */
        return {
            sucesso: true,
            aluno: aluno
        };
    },

    /*
     * Devolve a lista de alunos cadastrados.
     *
     * O operador spread (...) cria um novo array contendo
     * os mesmos alunos.
     *
     * Assim, não devolvemos diretamente o array original
     * armazenado dentro do Model.
     */
    listar() {
        return [...AlunoModel.alunos];
    }
};

