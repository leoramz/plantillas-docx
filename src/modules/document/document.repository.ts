import { EntityRepository, Repository } from "typeorm";
import { Document } from "./document.entity";

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> {}