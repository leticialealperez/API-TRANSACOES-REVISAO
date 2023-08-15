import { Base } from './Base';

export type UsuarioJSON = {
	id: string;
	email: string;
	senha: string;
};

export class Usuario extends Base {
	constructor(private _email: string, private _senha: string) {
		super();
	}

	public toJSON(): UsuarioJSON {
		return {
			id: this._id,
			email: this._email,
			senha: this._senha,
		};
	}
}

/*

*/
