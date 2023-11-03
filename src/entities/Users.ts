import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
    @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
    id: number;

    @Column("text", { name: "fio" })
    fio: string;

    @Column("text", { name: "email" })
    email: string;

    @Column("text", { name: "password" })
    password: string;
}
