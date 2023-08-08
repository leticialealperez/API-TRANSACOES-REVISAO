import { TipoTransacao, TransacaoJSON } from '../../models';
import { TransacoesRepository, UsuariosRepository } from '../../repositories';

type CadastrarTransacaoDTO = {
	idUsuario: string;
	valor: number;
	tipo: TipoTransacao;
};

export type RetornoTransacoes = {
	sucesso: boolean;
	mensagem: string;
	dados: {
		saldo: number;
		transacao?: TransacaoJSON;
		transacoes?: Array<TransacaoJSON>;
	};
};

export class CadastrarTransacao {
	public execute(dados: CadastrarTransacaoDTO): RetornoTransacoes {
		// para criar uma transação precisa ter um usuario válido
		const repositoryUsuario = new UsuariosRepository();
		const usuarioEncontrado = repositoryUsuario.buscaUsuarioPorID(
			dados.idUsuario
		);

		if (!usuarioEncontrado) {
			return {
				sucesso: false,
				mensagem:
					'Usuário não encontrado. Não foi possível cadastrar a transação.',
				dados: {
					saldo: 0,
				},
			};
		}

		const repositoryTransacoes = new TransacoesRepository();
		const transacaoCriada = repositoryTransacoes.cadastrar({
			usuario: usuarioEncontrado,
			tipo: dados.tipo,
			valor: dados.valor,
		});

		const somaTransacoes = repositoryTransacoes.calcularSaldo(
			dados.idUsuario
		);
		const transacoesUsuario =
			repositoryTransacoes.listarTransacoesDeUmUsuario(dados.idUsuario);

		return {
			sucesso: true,
			mensagem: 'Transação cadastrada com sucesso',
			dados: {
				saldo: somaTransacoes,
				transacao: transacaoCriada.toJSON(),
				transacoes: transacoesUsuario,
			},
		};
	}
}
