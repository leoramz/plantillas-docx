import { Status } from "../../utils/status.enum.utils";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Variable } from "../variable/variable.entity";

@Entity('categories')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;    

    @Column({ type: 'varchar', length: 35, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', default: Status.ACTIVE, length: 8 })
    status: string;

    @OneToMany(() => Variable, variable => variable.category)
    variables: Variable[];
    
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}