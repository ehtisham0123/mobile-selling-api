import { PrismaService } from "../prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PasswordService } from "./password.service";
import { SecurityConfig } from "../configs/config.interface";
import { SignupInput } from "./dto/signup.input";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {}

  // Method to create a new user
  // Method to create a new user
  async createUser(payload: SignupInput) {
    // Hash the password
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    console.log(payload);

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create the user in the database
        const { ...userPayload } = payload;
        const user = await prisma.user.create({
          data: {
            ...userPayload,
            password: hashedPassword,
          },
        });

        return user;
      });

      const { password: _, ...userWithoutPassword } = result;

      // Send verification email after transaction is successful
      return {
        user: userWithoutPassword,
        // message: `Sign up successful Now you can login to system`,
        message: `Registration successful for ${userWithoutPassword.email}. You can now log in to your account.`,
      };
    } catch (e) {
      // Handle errors, such as email duplication
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      }
      throw new Error(e);
    }
  }

  // Method to authenticate a user
  async login(email: string, password: string): Promise<any> {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    // Check if user exists
    if (!user) {
      throw new NotFoundException(`Invalid email or password.`);
    }
    // Validate the password
    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );
    if (!passwordValid) {
      throw new BadRequestException("Invalid email or password.");
    }
    // Generate tokens for the authenticated user
    const tokens = this.generateTokens({
      userId: user.id,
    });
    // Return user data along with tokens
    const { password: _, ...userWithoutPassword } = user;

    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  // Method to validate a user
  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  // Method to get user details from token
  getUserFromToken(token: string): Promise<User> {
    const { userId } = this.jwtService.decode(token);
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  // Method to generate access and refresh tokens
  generateTokens(payload: { userId: string }): any {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  // Method to generate access token
  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  // Method to generate refresh token
  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>("security");
    return this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });
      const user = this.prisma.user.findUnique({ where: { id: userId } });
      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
