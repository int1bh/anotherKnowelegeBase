import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("articles_pkey", ["id"], { unique: true })
@Entity("articles", { schema: "public" })
export class Articles {
    @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
    id: number;

    @Column("text", { name: "title" })
    title: string;

    @Column("text", { name: "content" })
    content: string;

    @Column("text", { name: "tags", nullable: true })
    tags: string | null;

    @Column("boolean", { name: "isPublic", default: () => "true" })
    isPublic: boolean;
}
