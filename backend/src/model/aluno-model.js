/*
 * Array utilizado temporariamente para armazenar
 * os alunos na memória do servidor.
 *
 * Os dados ainda serão perdidos quando o servidor
 * for encerrado.
 */
const alunos = [];

/*
 * O Model concentra os dados e as regras
 * relacionadas aos alunos.
 */
const AlunoModel = {
    /*
     * Converte um valor para texto e remove
     * os espaços do início e do final.
     */
    normalizarTexto(valor) {
        if (valor === null || valor === undefined) {
            return "";
        }

        return String(valor).trim();
    },

    /*
     * Realiza uma validação inicial do e-mail.
     */
    validarEmail(email) {
        return email.includes("@") && email.includes(".");
    },

    /*
     * Converte um ID para número.
     *
     * Retorna null quando o valor não representa
     * um número inteiro positivo.
     */
    converterId(id) {
        const idNumerico = Number(id);

        if (
            !Number.isInteger(idNumerico) ||
            idNumerico <= 0
        ) {
            return null;
        }

        return idNumerico;
    },

    /*
     * Localiza a posição de um aluno no array
     * utilizando seu ID.
     *
     * findIndex() devolve o índice do elemento.
     *
     * Quando o aluno não é encontrado,
     * findIndex() devolve -1.
     */
    localizarIndicePorId(id) {
        const idNumerico = AlunoModel.converterId(id);

        if (idNumerico === null) {
            return -1;
        }

        return alunos.findIndex(
            aluno => aluno.id === idNumerico
        );
    },

    /*
     * Procura um aluno pelo RA.
     *
     * O parâmetro idIgnorado será utilizado
     * durante a atualização.
     *
     * Ele evita que o RA do próprio aluno seja
     * considerado duplicado.
     */
    localizarPorRa(ra, idIgnorado = null) {
        return alunos.find(
            aluno =>
                aluno.ra === ra &&
                aluno.id !== idIgnorado
        );
    },

    /*
     * Gera o próximo identificador.
     */
    gerarProximoId() {
        if (alunos.length === 0) {
            return 1;
        }

        const ids = alunos.map(aluno => aluno.id);
        const maiorId = Math.max(...ids);

        return maiorId + 1;
    },

    /*
     * Normaliza e valida os dados recebidos.
     *
     * Esse método será utilizado tanto no cadastro
     * quanto na atualização.
     */
    validarDados(dados, idIgnorado = null) {
        /*
         * Normaliza os valores recebidos.
         */
        const alunoValidado = {
            ra: AlunoModel.normalizarTexto(dados?.ra),
            nome: AlunoModel.normalizarTexto(dados?.nome),

            email: AlunoModel
                .normalizarTexto(dados?.email)
                .toLowerCase(),

            curso: AlunoModel.normalizarTexto(dados?.curso),
            turma: AlunoModel.normalizarTexto(dados?.turma)
        };

        /*
         * Verifica os campos obrigatórios.
         */
        if (
            alunoValidado.ra === "" ||
            alunoValidado.nome === "" ||
            alunoValidado.email === "" ||
            alunoValidado.curso === "" ||
            alunoValidado.turma === ""
        ) {
            return {
                sucesso: false,
                status: 400,
                mensagem: "Todos os campos são obrigatórios."
            };
        }

        /*
         * Verifica o formato inicial do e-mail.
         */
        if (!AlunoModel.validarEmail(alunoValidado.email)) {
            return {
                sucesso: false,
                status: 400,
                mensagem: "Informe um e-mail válido."
            };
        }

        /*
         * Verifica a duplicidade do RA.
         */
        if (
            AlunoModel.localizarPorRa(
                alunoValidado.ra,
                idIgnorado
            )
        ) {
            return {
                sucesso: false,
                status: 409,
                mensagem: "Já existe um aluno com esse RA."
            };
        }

        /*
         * Retorna os dados normalizados.
         */
        return {
            sucesso: true,
            dados: alunoValidado
        };
    },

    /*
     * Cadastra um novo aluno.
     */
    cadastrar(dados) {
        /*
         * Valida os dados recebidos.
         */
        const validacao =
            AlunoModel.validarDados(dados);

        /*
         * Retorna o erro encontrado pelo Model.
         */
        if (!validacao.sucesso) {
            return validacao;
        }

        /*
         * Cria o novo aluno.
         */
        const aluno = {
            id: AlunoModel.gerarProximoId(),

            /*
             * Espalha as propriedades validadas:
             *
             * ra, nome, email, curso e turma.
             */
            ...validacao.dados,

            ativo: true
        };

        /*
         * Adiciona o aluno ao array.
         */
        alunos.push(aluno);

        return {
            sucesso: true,
            status: 201,

            /*
             * Retorna uma cópia do aluno.
             */
            aluno: { ...aluno }
        };
    },

    /*
     * Lista todos os alunos.
     */
    listar() {
        /*
         * map() cria um novo array.
         *
         * Também criamos uma cópia de cada aluno.
         */
        return alunos.map(
            aluno => ({ ...aluno })
        );
    },

    /*
     * Busca um aluno pelo ID.
     */
    buscarPorId(id) {
        /*
         * Localiza a posição do aluno.
         */
        const indice =
            AlunoModel.localizarIndicePorId(id);

        /*
         * O índice -1 indica que o aluno
         * não foi encontrado.
         */
        if (indice === -1) {
            return {
                sucesso: false,
                status: 404,
                mensagem: "Aluno não encontrado."
            };
        }

        return {
            sucesso: true,
            status: 200,
            aluno: { ...alunos[indice] }
        };
    },

    /*
     * Atualiza os dados de um aluno.
     */
    atualizar(id, dados) {
        /*
         * Localiza o aluno que será atualizado.
         */
        const indice =
            AlunoModel.localizarIndicePorId(id);

        if (indice === -1) {
            return {
                sucesso: false,
                status: 404,
                mensagem: "Aluno não encontrado."
            };
        }

        /*
         * Recupera o aluno armazenado no array.
         */
        const alunoAtual = alunos[indice];

        /*
         * Valida os novos dados.
         *
         * O ID atual é ignorado na verificação
         * de RA duplicado.
         */
        const validacao = AlunoModel.validarDados(
            dados,
            alunoAtual.id
        );

        if (!validacao.sucesso) {
            return validacao;
        }

        /*
         * Atualiza somente os campos editáveis.
         *
         * O ID e a situação do aluno são preservados.
         */
        alunos[indice] = {
            ...alunoAtual,
            ...validacao.dados
        };

        return {
            sucesso: true,
            status: 200,
            aluno: { ...alunos[indice] }
        };
    },

    /*
     * Exclui um aluno pelo ID.
     */
    remover(id) {
        /*
         * Localiza a posição do aluno.
         */
        const indice =
            AlunoModel.localizarIndicePorId(id);

        if (indice === -1) {
            return {
                sucesso: false,
                status: 404,
                mensagem: "Aluno não encontrado."
            };
        }

        /*
         * splice() remove um elemento do array.
         *
         * O primeiro argumento é a posição.
         * O segundo é a quantidade removida.
         *
         * O método devolve um array com os
         * elementos removidos.
         */
        const removidos = alunos.splice(indice, 1);

        /*
         * Recupera o primeiro elemento removido.
         */
        const alunoRemovido = removidos[0];

        return {
            sucesso: true,
            status: 200,
            aluno: { ...alunoRemovido }
        };
    }
};

/*
 * Exporta o Model.
 */
export default AlunoModel;