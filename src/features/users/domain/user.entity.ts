import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, TreeChildren } from 'typeorm';
import { EmailConfirmationModel } from '../api/models/input/create-user.dto';
// Entity
class EmailConfirmationDto {
  @Column()
  isConfirmed: boolean;

  @Column({nullable: true})
  confirmationCode: string

  // Foreign

  @Column({nullable: true})
  expirationDate: string
}


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
  @Column(() => EmailConfirmationDto)
  emailConfirmation: EmailConfirmationModel

}
