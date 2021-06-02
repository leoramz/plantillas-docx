import { Status } from "../../shared/status.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Variable } from "../variable/variable.entity";

@Entity('values')
export class Value extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    value: string;    

    @ManyToOne(type => Variable, variable => variable.values, { eager: true })
    variable: Variable;

    @Column({ type: 'varchar', default: Status.ACTIVE, length: 8 })
    status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}