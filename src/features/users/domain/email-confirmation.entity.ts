import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class EmailConfirmationEntity {

  @PrimaryColumn()
  userId: string


  @Column()
  isConfirm: boolean;

  @Column({nullable: true})
  confirmationCode: string

  // Foreign

  @Column({nullable: true})
  expirationDate: string

  @OneToOne(() => UserEntity,(user) => user.emailConfirmation)
  user: UserEntity;

}
