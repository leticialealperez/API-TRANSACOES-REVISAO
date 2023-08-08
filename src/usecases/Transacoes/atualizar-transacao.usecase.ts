import { RetornoTransacoes } from '..';
import { TipoTransacao } from '../../models';
import { TransacoesRepository, UsuariosRepository } from '../../repositories';

type AtualizarTransacaoDTO = {
	idUsuario: string;
	idTransacao: string;
	novosDados: {
		valor?: number;
		tipo?: TipoTransacao;
	};
};

export class AtualizarTransacao {
	public execute(dados: AtualizarTransacaoDTO): RetornoTransacoes {
		const { idUsuario, idTransacao, novosDados } = dados;

		const repositoryUsuario = new UsuariosRepository();
		const repositoryTransacao = new TransacoesRepository();

		const usuarioEncontrado =
			repositoryUsuario.buscaUsuarioPorID(idUsuario);

		if (!usuarioEncontrado) {
			return {
				sucesso: false,
				mensagem:
					'Usuário não encontrado. Não foi possível atualizar a transação.',
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

		const transacaoAtualizada = repositoryTransacao.atualizarTransacao({
			idTransacao,
			tipo: novosDados.tipo,
			valor: novosDados.valor,
		});

		const saldo = repositoryTransacao.calcularSaldo(idUsuario);

		return {
			sucesso: true,
			mensagem: 'Transação atualizada com sucesso',
			dados: {
				saldo,
				transacao: transacaoAtualizada,
			},
		};
	}
}
