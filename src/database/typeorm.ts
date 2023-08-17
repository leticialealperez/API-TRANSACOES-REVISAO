import { DataSource } from 'typeorm';
import configuracoes from './ormconfig';

export const dataSource = new DataSource(configuracoes);
