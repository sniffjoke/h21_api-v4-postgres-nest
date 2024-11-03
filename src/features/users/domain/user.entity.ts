import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailConfirmationEntity } from './email-confirmation.entity';


@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  login: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: string

  // @One-to-One() JoinColumn
  // @Column(() => EmailConfirmationDto)
  // emailConfirmation: EmailConfirmationModel
  @OneToOne(() => EmailConfirmationEntity, (emailConfirmation) => emailConfirmation.user, {cascade: true})
  @JoinColumn()
  emailConfirmation: EmailConfirmationEntity

}
