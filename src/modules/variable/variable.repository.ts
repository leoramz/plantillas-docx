import { EntityRepository, Repository } from "typeorm";
import { Variable } from "./variable.entity";

@EntityRepository(Variable)
export class VariableRepository extends Repository<Variable> {}