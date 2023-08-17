import { pgHelper } from '../../database';
import { TipoTransacao, TransacaoJSON, UsuarioJSON } from '../../models';

type CadastrarDTO = {
	usuario: UsuarioJSON;
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
// type KeyEnumTipo = keyof typeof ETipo;

export class TransacoesRepository {
	public async cadastrar(dados: CadastrarDTO): Promise<TransacaoJSON> {
		const { valor, tipo, usuario } = dados;
		const idUsuario = usuario.id;
		const tipoNumero = ETipo[tipo];

		await pgHelper.client.query('INSERT INTO transacoes (valor, tipo, id_usuario) VALUES ($1, $2, $3)', [
			valor,
			tipoNumero,
			idUsuario,
		]);

		const resultado = await pgHelper.client.query(
			'SELECT t.id, t.valor, t.id_usuario, t.tipo, t.criadoem, u.email FROM transacoes t INNER JOIN usuarios u ON u.id = t.id_usuario ORDER BY t.criadoEm DESC LIMIT 1'
		);

		const [ultimaTransacao] = resultado;

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

	public async calcularSaldo(idUsuario: string): Promise<number> {
		const transacoesUsuario = await pgHelper.client.query('SELECT * FROM transacoes WHERE id_usuario = $1', [
			idUsuario,
		]);

		if (!transacoesUsuario.length) return 0;

		const soma = transacoesUsuario.reduce((result: number, transacao: any) => {
			ETipo[1];
			if (ETipo[transacao.tipo as number] === 'entrada') {
				return result + transacao.valor;
			} else {
				return result - transacao.valor;
			}
		}, 0);

		return soma;
	}

	public async listarTransacoesDeUmUsuario(idUsuario: string, filtros?: Filtros): Promise<TransacaoJSON[]> {
		const transacoesUsuario = await pgHelper.client.query(
			'SELECT t.id as id_transacao, t.valor, t.tipo, t.criadoem, u.id as id_usuario, u.email FROM transacoes t INNER JOIN usuarios u ON t.id_usuario = u.id WHERE id_usuario = $1',
			[idUsuario]
		);

		const listaTransacoesUsuario: TransacaoJSON[] = transacoesUsuario.map((v: any) => {
			return {
				id: v.id_transacao,
				valor: v.valor,
				tipo: ETipo[v.tipo],
				criadoEm: v.criadoem,
				autor: {
					id: v.id_usuario,
					email: v.email,
				},
			};
		});

		return listaTransacoesUsuario;
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
