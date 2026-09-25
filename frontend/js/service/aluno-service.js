/*
 * SERVICE DE ALUNOS
 *
 * O Service coordena a utilização do Model
 * e a persistência dos dados.
 *
 * Nesta versão, a persistência utiliza localStorage.
 *
 * Em uma versão futura, este arquivo utilizará fetch()
 * para se comunicar com a API.
 */
const AlunoService = {

    /*
     * Nome utilizado para armazenar os alunos
     * dentro do localStorage.
     *
     * É importante utilizar um nome específico para
     * evitar conflito com dados de outras aplicações.
     */
    CHAVE_STORAGE: "sistema-academico-ds2:alunos",

    /*
     * Recupera os alunos armazenados.
     */
    listar() {

        /*
         * getItem() recupera o texto associado à chave.
         *
         * Se a chave não existir, o resultado será null.
         */
        const textoJson = localStorage.getItem(
            AlunoService.CHAVE_STORAGE
        );

        /*
         * Se não houver nada armazenado, devolve
         * um array vazio.
         */
        if (textoJson === null) {
            return [];
        }

        /*
         * try permite tentar executar uma operação
         * que pode gerar erro.
         *
         * JSON.parse() gera erro quando recebe
         * um JSON inválido.
         */
        try {
            const dados = JSON.parse(textoJson);

            /*
             * Confirma se o resultado é realmente um array.
             */
            if (!Array.isArray(dados)) {
                return [];
            }

            return dados;

        } catch (erro) {

            /*
             * Se o conteúdo estiver corrompido,
             * remove o valor inválido.
             */
            localStorage.removeItem(
                AlunoService.CHAVE_STORAGE
            );

            return [];
        }
    },

    /*
     * Converte o array para JSON e salva no navegador.
     */
    salvar(alunos) {
        const textoJson = JSON.stringify(alunos);

        localStorage.setItem(
            AlunoService.CHAVE_STORAGE,
            textoJson
        );
    },

    /*
     * Coordena o cadastro de um aluno.
     */
    cadastrar(dados) {

        /*
         * Recupera a lista atual.
         */
        const alunos = AlunoService.listar();

        /*
         * Solicita ao Model a validação e a criação.
         */
        const resultado = AlunoModel.criar(
            dados,
            alunos
        );

        /*
         * Se o Model identificar um problema,
         * devolve o mesmo resultado ao Controller.
         */
        if (!resultado.sucesso) {
            return resultado;
        }

        /*
         * Adiciona o aluno criado ao array.
         */
        alunos.push(resultado.aluno);

        /*
         * Salva o array atualizado.
         */
        AlunoService.salvar(alunos);

        /*
         * Devolve o resultado ao Controller.
         */
        return resultado;
    },

    /*
     * Remove toda a lista armazenada.
     */
    limpar() {
        localStorage.removeItem(
            AlunoService.CHAVE_STORAGE
        );
    }
};
