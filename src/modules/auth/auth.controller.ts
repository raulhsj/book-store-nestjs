import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto, LoggedInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signUp')
  @UsePipes(ValidationPipe) // Field validation in the input
  signUp(@Body() signupDto: SignupDto): Promise<void> {
    return this._authService.signUp(signupDto);
  }

  @Post('/signIn')
  @UsePipes(ValidationPipe)
  signIn(@Body() signinDto: SigninDto): Promise<LoggedInDto> {
    return this._authService.signIn(signinDto);
  }
}
