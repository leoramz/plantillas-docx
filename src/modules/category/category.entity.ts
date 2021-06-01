import { Status } from "../../shared/status.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('categories')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;    

    @Column({ type: 'varchar', length: 20, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'varchar', default: Status.ACTIVE, length: 8 })
    status: string;

    @OneToMany(type => Variable, variable => variable.category)
    variables: Variable[];
    
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
}