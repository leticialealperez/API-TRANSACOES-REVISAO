import { Database } from '../../database';
import { TipoTransacao, TransacaoJSON, Usuario } from '../../models';

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

enum ETipo {
	'entrada' = 1,
	'saida' = 2,
}

export class TransacoesRepository {
	public async cadastrar(dados: CadastrarDTO): Promise<TransacaoJSON | undefined> {
		const { valor, tipo, usuario } = dados;
		const idUsuario = usuario.toJSON().id;
		const tipoNumero = ETipo[tipo];

		await Database.query('INSERT INTO transacoes (valor, tipo, id_usuario) VALUES ($1, $2, $3)', [
			valor,
			tipoNumero,
			idUsuario,
		]);

		const resultado = await Database.query(
			'SELECT t.id, t.valor, t.id_usuario, t.tipo, t.criadoem, u.email FROM transacoes t INNER JOIN usuarios u ON u.id = t.id_usuario ORDER BY t.criadoEm DESC LIMIT 1'
		);

		const [ultimaTransacao] = resultado.rows;

		return {
			id: ultimaTransacao.id,
			tipo: ETipo[ultimaTransacao.tipo] as TipoTransacao,
			valor: ultimaTransacao.valor,
			criadoEm: ultimaTransacao.criadoem,
			autor: {
				id: ultimaTransacao.id_usuario,
				email: ultimaTransacao.email,
			},
		};
	}

	public calcularSaldo(idUsuario: string): number {
		const transacoesUsuario = transacoes.filter((transacao) => transacao.toJSON().autor.id === idUsuario);

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

	public listarTransacoesDeUmUsuario(idUsuario: string, filtros?: Filtros): TransacaoJSON[] {
		return transacoes
			.filter((transacao) => {
				const { autor, tipo } = transacao.toJSON();

				return filtros?.tipo ? autor.id === idUsuario && tipo === filtros.tipo : autor.id === idUsuario;
			})
			.map((t) => t.toJSON());
	}

	public buscarPorID(idUsuario: string, idTransacao: string): TransacaoJSON | undefined {
		return transacoes.find((t) => t.toJSON().autor.id === idUsuario && t.toJSON().id === idTransacao)?.toJSON();
	}

	public atualizarTransacao(dados: AtualizarDTO): TransacaoJSON {
		const indiceTransacao = transacoes.findIndex((t) => t.toJSON().id === dados.idTransacao);

		transacoes[indiceTransacao].atualizarDetalhes({
			valor: dados.valor,
			tipo: dados.tipo,
		});

		return transacoes[indiceTransacao].toJSON();
	}

	public deletarTransacao(idTransacao: string): TransacaoJSON {
		const indiceTransacao = transacoes.findIndex((t) => t.toJSON().id === idTransacao);

		const [transacaoExcluida] = transacoes.splice(indiceTransacao, 1);

		return transacaoExcluida.toJSON();
	}
}
