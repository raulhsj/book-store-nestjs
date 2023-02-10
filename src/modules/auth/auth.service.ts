import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { LoggedInDto, SigninDto, SignupDto } from './dto';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(AuthRepository) not necessary
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto): Promise<void> {
    const { username, email } = signupDto;
    const userExists = await this._authRepository.findOneBy({
      username,
      email,
    });

    if (userExists) {
      throw new ConflictException('username or email already exists');
    }

    return this._authRepository.signUp(signupDto);
  }

  async signIn(signInDto: SigninDto): Promise<LoggedInDto> {
    const { username, password } = signInDto;

    const user: User = await this._authRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = this._jwtService.sign(payload);

    return plainToInstance(LoggedInDto, { token, user });
  }
}
