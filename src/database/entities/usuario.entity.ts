import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EnderecoEntity } from './endereco.entity';

// PADRÃO => active records
// @Entity({ name: 'usuarios' })
// export class UsuarioEntity extends BaseEntity {
// 	@PrimaryColumn()
// 	id!: string;

// 	@Column({ unique: true, type: 'varchar', length: 150 })
// 	email!: string;

// 	@Column({ type: 'varchar', length: 255 })
// 	senha!: string;

// 	@Column({ name: 'criadoem' })
// 	criadoEm!: Date;

// 	@BeforeInsert()
// 	beforeInsert() {
// 		// this.id = randomUUID();
// 		this.criadoEm = new Date();
// 	}
// }

@Entity({ name: 'usuarios' })
export class UsuarioEntity {
	@PrimaryColumn()
	id!: string;

	@Column({ unique: true, type: 'varchar', length: 150 })
	email!: string;

	@Column({ type: 'varchar', length: 255 })
	senha!: string;

	@Column({ name: 'criadoem' })
	criadoEm!: Date;

	@OneToOne(() => EnderecoEntity)
	@JoinColumn({ name: 'id_endereco', foreignKeyConstraintName: 'fk_enderecos', referencedColumnName: 'id' })
	endereco?: EnderecoEntity;

	@BeforeInsert()
	beforeInsert() {
		// this.id = randomUUID();
		this.criadoEm = new Date();
	}
}
