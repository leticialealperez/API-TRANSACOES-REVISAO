import { RetornoTransacoes } from '..';
import { TransacoesRepository, UsuariosRepository } from '../../repositories';

type ListarPorIdDTO = {
	idUsuario: string;
	idTransacao: string;
};

export class ListarPorID {
	public execute(dados: ListarPorIdDTO): RetornoTransacoes {
		const { idUsuario, idTransacao } = dados;

		const repositoryUsuario = new UsuariosRepository();
		const repositoryTransacao = new TransacoesRepository();

		const usuarioEncontrado =
			repositoryUsuario.buscaUsuarioPorID(idUsuario);

		if (!usuarioEncontrado) {
			return {
				sucesso: false,
				mensagem:
					'Usuário não encontrado. Não foi possível listar a transação.',
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

		const saldo = repositoryTransacao.calcularSaldo(idUsuario);

		return {
			sucesso: true,
			mensagem: 'Transação buscada com sucesso',
			dados: {
				saldo,
				transacao,
			},
		};
	}
}
