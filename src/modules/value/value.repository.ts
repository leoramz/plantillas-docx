import { EntityRepository, Repository } from "typeorm";
import { Value } from "./value.entity";

@EntityRepository(Value)
export class ValueRepository extends Repository<Value> {}