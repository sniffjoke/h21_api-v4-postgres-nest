import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('tokens')
export class TokenEntity {

    @PrimaryGeneratedColumn()
    id: string

    @Column()
    userId: string;

    @Column()
    deviceId: string;

//TODO iat
    @Column()
    refreshToken: string;

    @Column()
    blackList: boolean;

}
