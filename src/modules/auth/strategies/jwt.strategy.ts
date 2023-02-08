import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Configuration } from '../../../config/config.keys';
import { ConfigService } from '../../../config/config.service';
import { AuthRepository } from '../auth.repository';
import { IJwtPayload } from '../jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StatusType } from '../../../shared/statustype.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    // @InjectRepository(AuthRepository) not necessary
    private readonly _authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(Configuration.JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;
    const user = await this._authRepository.findOneBy({
      username,
      status: StatusType.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
