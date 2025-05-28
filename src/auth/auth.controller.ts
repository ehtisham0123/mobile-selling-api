import { Body, Controller, Post, Get, Req, UnauthorizedException, UseGuards, HttpStatus, Res, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { Request } from 'express';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SignupInput } from './dto/signup.input';
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() signupInput: SignupInput) {
    signupInput.email = signupInput.email.toLowerCase();
    return await this.authService.createUser(signupInput);
  }

  @Post('login')
  async login(@Body() { email, password }: LoginInput) {
    return await this.authService.login(email.toLowerCase(), password);
  }

  @Post('refresh')
  async refreshToken(@Body() { token }: RefreshTokenInput) {
    return await this.authService.refreshToken(token);
  }

  @Get('user')
  async getUser(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Authorization header is missing.');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Bearer token is missing.');

    return await this.authService.getUserFromToken(token);
  }

  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
  }

  @ApiOperation({ summary: 'Facebook OAuth Callback', description: 'Callback endpoint for Facebook OAuth.' }) // Swagger operation description
  @ApiQuery({ name: 'code', description: 'Authorization code received from Facebook.', required: true })
  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(@Req() req, @Res() res) {
    try {
      const jwt = await this.authService.generateTokens(req.user.user);
      return { accessToken: jwt.accessToken };
    } catch (error) {
      throw new HttpException('Facebook login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {
    // Initiates the Google login flow
  }

  @ApiOperation({ summary: 'Facebook OAuth Callback', description: 'Callback endpoint for Facebook OAuth.' }) // Swagger operation description
  @ApiQuery({ name: 'code', description: 'Authorization code received from Facebook.', required: true })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res): Promise<any> {
   try {
      const jwt = await this.authService.generateTokens(req.user.user);
      return { accessToken: jwt.accessToken };
    } catch (error) {
      throw new HttpException('Facebook login failed', HttpStatus.UNAUTHORIZED);
    }
  }

}
