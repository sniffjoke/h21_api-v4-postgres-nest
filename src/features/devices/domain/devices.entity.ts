import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('devices')
export class DeviceEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    deviceId: string;

    @Column()
    ip: string;

    @Column()
    title: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    lastActiveDate: string;

}
