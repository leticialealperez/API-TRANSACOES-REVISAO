import { pgHelper } from '../../database';
import { TipoTransacao, Transacao, Usuario } from '../../models';

type CadastrarDTO = {
	idUsuario: string;
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
	idUsuario: string;
	valor: number;
	tipo: number;
	criadoem: Date;
};

export enum ETipo {
	'entrada' = 1,
	'saida' = 2,
}
type KeyEnumTipo = keyof typeof ETipo;

interface DadosDBTransacao {
	id: string;
	valor: number;
	tipo: number;
	criadoem: Date;
	id_usuario: string;
	email: string;
	senha: string;
}

export class TransacoesRepository {
	public async cadastrar(dados: CadastrarDTO): Promise<Transacao> {
		const { valor, tipo, idUsuario } = dados;

		await pgHelper.client.query('INSERT INTO transacoes (valor, tipo, id_usuario) VALUES ($1, $2, $3)', [
			valor,
			ETipo[tipo],
			idUsuario,
		]);

		const [ultimInserido] = await pgHelper.client.query(
			'SELECT t.id, t.valor, t.tipo, t.id_usuario, t.criadoem, u.email, u.senha FROM transacoes t INNER JOIN usuarios u ON t.id_usuario = u.id WHERE t.id_usuario = $1 ORDER BY t.criadoEm DESC LIMIT 1',
			[idUsuario]
		);

		return this.entityToModel(ultimInserido);
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

	public async listarTransacoesDeUmUsuario(idUsuario: string, filtros?: Filtros): Promise<Transacao[]> {
		let sql = `	SELECT t.id, t.valor, t.tipo, t.criadoem, t.id_usuario, u.email, u.senha 
					FROM transacoes t 
					INNER JOIN usuarios u 
					ON t.id_usuario = u.id 
					WHERE t.id_usuario = ${idUsuario} 
				  `;

		if (filtros) {
			if (filtros.tipo) {
				sql += ` AND t.tipo = ${ETipo[filtros.tipo]}`;
			}

			if (filtros.valorMin) {
				sql += ` AND t.valor >= ${filtros.valorMin}`;
			}

			if (filtros.valorMax) {
				sql += ` AND t.valor <= ${filtros.valorMax}`;
			}
		}

		const transacoesUsuario = await pgHelper.client.query(sql);

		return transacoesUsuario.map((row: any) => this.entityToModel(row));
	}

	public async buscarPorID(idUsuario: string, idTransacao: string): Promise<Transacao | undefined> {
		const [transacaoEncontrada] = await pgHelper.client.query(
			`	SELECT t.id, t.valor, t.tipo, t.criadoem, t.id_usuario, u.email, u.senha 
				FROM transacoes t 
				INNER JOIN usuarios u 
				ON t.id_usuario = u.id 
				WHERE t.id_usuario = $1
				AND t.id =  $2
			`,
			[idUsuario, idTransacao]
		);

		if (!transacaoEncontrada) return undefined;

		return this.entityToModel(transacaoEncontrada);
	}

	public async atualizarTransacao(dados: AtualizarDTO): Promise<void> {
		await pgHelper.client.query(`UPDATE transacoes SET 
										valor=${dados.valor}
										tipo=${dados.tipo}
										criadoem=${dados.criadoem}
									WHERE id = ${dados.idTransacao}
									`);
	}

	public async deletarTransacao(idTransacao: string): Promise<void> {
		await pgHelper.client.query(`DELETE FROM transacoes WHERE id = ${idTransacao}`);
	}

	// TRANSFORMA RESULTADO DA BUSCA EM UMA INSTANCIA DA MODEL
	private entityToModel(dadosDB: DadosDBTransacao): Transacao {
		const usuario = new Usuario(dadosDB.id, dadosDB.email, dadosDB.senha);

		return new Transacao(dadosDB.id, dadosDB.valor, ETipo[dadosDB.tipo] as KeyEnumTipo, usuario);
	}
}
