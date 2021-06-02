import { Status } from "../../shared/status.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../category/category.entity";
import { Value } from "../value/value.entity";

@Entity('variables')
export class Variable extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    type_variable: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(type => Category, category => category.variables, { eager: true })
    category: Category;
    
    @OneToMany(type => Value, value => value.variable)
    values: Value[];

    @Column({ type: 'varchar', default: Status.ACTIVE, length: 8 })
    status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}