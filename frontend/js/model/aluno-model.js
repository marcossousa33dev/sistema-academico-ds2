/*
 * MODEL DE ALUNOS — VERSÃO 0.3
 *
 * O Model contém as regras relacionadas ao aluno.
 *
 * Ele não sabe:
 * - de onde os dados vieram;
 * - como serão apresentados;
 * - onde serão armazenados.
 */
const AlunoModel = {

    /*
     * Converte o valor para texto e remove
     * espaços no começo e no final.
     */
    normalizarTexto(valor) {
        if (valor === null || valor === undefined) {
            return "";
        }

        return String(valor).trim();
    },

    /*
     * Realiza uma validação introdutória do e-mail.
     */
    validarEmail(email) {
        return email.includes("@") && email.includes(".");
    },

    /*
     * Procura um aluno pelo RA dentro do array recebido.
     *
     * Agora o Model não possui mais um array próprio.
     * A lista é entregue pela camada Service.
     */
    localizarPorRa(alunos, ra) {
        return alunos.find(
            aluno => aluno.ra === ra
        );
    },

    /*
     * Calcula o próximo identificador.
     *
     * Se não houver alunos, o primeiro ID será 1.
     */
    gerarProximoId(alunos) {
        if (alunos.length === 0) {
            return 1;
        }

        /*
         * map() cria um array contendo somente os IDs.
         *
         * Exemplo:
         * alunos = [{ id: 1 }, { id: 4 }]
         * ids = [1, 4]
         */
        const ids = alunos.map(
            aluno => aluno.id
        );

        /*
         * Math.max() encontra o maior ID.
         *
         * O operador spread (...) entrega cada número
         * do array como argumento para Math.max().
         */
        const maiorId = Math.max(...ids);

        return maiorId + 1;
    },

    /*
     * Valida os dados e cria um novo objeto aluno.
     *
     * O Model não salva o objeto.
     * Ele apenas o devolve para a camada Service.
     */
    criar(dados, alunos) {
        const ra = AlunoModel.normalizarTexto(dados.ra);
        const nome = AlunoModel.normalizarTexto(dados.nome);
        const email = AlunoModel.normalizarTexto(dados.email);
        const curso = AlunoModel.normalizarTexto(dados.curso);
        const turma = AlunoModel.normalizarTexto(dados.turma);

        /*
         * Verifica os campos obrigatórios.
         */
        if (
            ra === "" ||
            nome === "" ||
            email === "" ||
            curso === "" ||
            turma === ""
        ) {
            return {
                sucesso: false,
                mensagem: "Todos os campos são obrigatórios."
            };
        }

        /*
         * Verifica o formato básico do e-mail.
         */
        if (!AlunoModel.validarEmail(email)) {
            return {
                sucesso: false,
                mensagem: "Informe um e-mail válido."
            };
        }

        /*
         * Verifica se o RA já existe na lista recebida.
         */
        if (AlunoModel.localizarPorRa(alunos, ra)) {
            return {
                sucesso: false,
                mensagem: "Já existe um aluno com esse RA."
            };
        }

        /*
         * Cria o objeto depois que todas as validações
         * forem aprovadas.
         */
        const aluno = {
            id: AlunoModel.gerarProximoId(alunos),
            ra: ra,
            nome: nome,
            email: email,
            curso: curso,
            turma: turma,
            ativo: true
        };

        /*
         * Devolve o objeto para a camada Service.
         *
         * O Model não utiliza push() nem localStorage.
         */
        return {
            sucesso: true,
            aluno: aluno
        };
    }
};
