import { RetornoTransacoes } from '..';
import { TransacoesRepository, UsuariosRepository } from '../../repositories';

type DeletarTransacaoDTO = {
	idUsuario: string;
	idTransacao: string;
};

export class DeletarTransacao {
	public execute(dados: DeletarTransacaoDTO): RetornoTransacoes {
		const { idUsuario, idTransacao } = dados;

		const repositoryUsuario = new UsuariosRepository();
		const repositoryTransacao = new TransacoesRepository();

		const usuarioEncontrado =
			repositoryUsuario.buscaUsuarioPorID(idUsuario);

		if (!usuarioEncontrado) {
			return {
				sucesso: false,
				mensagem:
					'Usuário não encontrado. Não foi possível deletar a transação.',
				dados: {
					saldo: 0,
				},
			};
		}

		const transacao = repositoryTransacao.buscarPorID(
			idUsuario,
			idTransacao
		);

		if (!transacao) {
			return {
				sucesso: false,
				mensagem: 'Transação não encontrada.',
				dados: {
					saldo: 0,
				},
			};
		}

		const transacaoDeletada =
			repositoryTransacao.deletarTransacao(idTransacao);

		const saldo = repositoryTransacao.calcularSaldo(idUsuario);

		return {
			sucesso: true,
			mensagem: 'Transação deletada com sucesso',
			dados: {
				saldo,
				transacao: transacaoDeletada,
			},
		};
	}
}
