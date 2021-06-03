import { Status } from "../../utils/status.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Variable } from "../variable/variable.entity";

@Entity('documents')
export class Document extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToMany(() => Variable, variable => variable.documents, { eager: true })
    @JoinTable({ name: 'documents_variables'})
    variables: Variable[];

    @Column({ type: 'varchar', default: Status.ACTIVE, length: 8 })
    status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}