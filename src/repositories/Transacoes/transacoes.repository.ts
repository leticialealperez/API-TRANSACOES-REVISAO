import { transacoes } from '../../database';
import { TipoTransacao, Transacao, TransacaoJSON, Usuario } from '../../models';

type CadastrarDTO = {
	usuario: Usuario;
	valor: number;
	tipo: TipoTransacao;
};

type Filtros = {
	tipo?: TipoTransacao;
	valorMin?: number;
	valorMax?: number;
};

type AtualizarDTO = {
	idTransacao: string;
	valor?: number;
	tipo?: TipoTransacao;
};

export class TransacoesRepository {
	public cadastrar(dados: CadastrarDTO): Transacao {
		const { valor, tipo, usuario } = dados;

		const novaTransacao = new Transacao(valor, tipo, usuario);

		transacoes.push(novaTransacao);

		return novaTransacao;
	}

	public calcularSaldo(idUsuario: string): number {
		const transacoesUsuario = transacoes.filter(
			(transacao) => transacao.toJSON().autor.id === idUsuario
		);

		if (!transacoesUsuario.length) return 0;

		const soma = transacoesUsuario.reduce((result, transacao) => {
			const transacaoJSON = transacao.toJSON();

			if (transacaoJSON.tipo === 'entrada') {
				return result + transacaoJSON.valor;
			} else {
				return result - transacaoJSON.valor;
			}
		}, 0);

		return soma;
	}

	public listarTransacoesDeUmUsuario(
		idUsuario: string,
		filtros?: Filtros
	): TransacaoJSON[] {
		return transacoes
			.filter((transacao) => {
				const { autor, tipo } = transacao.toJSON();

				return filtros?.tipo
					? autor.id === idUsuario && tipo === filtros.tipo
					: autor.id === idUsuario;
			})
			.map((t) => t.toJSON());
	}

	public buscarPorID(
		idUsuario: string,
		idTransacao: string
	): TransacaoJSON | undefined {
		return transacoes
			.find(
				(t) =>
					t.toJSON().autor.id === idUsuario &&
					t.toJSON().id === idTransacao
			)
			?.toJSON();
	}

	public atualizarTransacao(dados: AtualizarDTO): TransacaoJSON {
		const indiceTransacao = transacoes.findIndex(
			(t) => t.toJSON().id === dados.idTransacao
		);

		transacoes[indiceTransacao].atualizarDetalhes({
			valor: dados.valor,
			tipo: dados.tipo,
		});

		return transacoes[indiceTransacao].toJSON();
	}

	public deletarTransacao(idTransacao: string): TransacaoJSON {
		const indiceTransacao = transacoes.findIndex(
			(t) => t.toJSON().id === idTransacao
		);

		const [transacaoExcluida] = transacoes.splice(indiceTransacao, 1);

		return transacaoExcluida.toJSON();
	}
}
