import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signUp')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signupDto: SignupDto): Promise<void> {
    return this._authService.signUp(signupDto);
  }

  @Post('/signIn')
  @UsePipes(ValidationPipe)
  async signIn(@Body() signinDto: SigninDto) {
    return this._authService.signIn(signinDto);
  }
}
