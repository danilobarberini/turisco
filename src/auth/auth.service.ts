import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AgenciesService } from '../agencies/agencies.service';
import { UsersService } from '../users/users.service';
import { Agency } from '../agencies/entities/agency.entity';
import * as jwt from 'jsonwebtoken';
import { LoginGoogleDto } from 'src/users/dto/login-google.dto';

export interface AuthenticationData {
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @Inject(forwardRef(() => AgenciesService))
    private agenciesService: AgenciesService,
  ) {}

  async login(email: string, password: string) {
    const userOrAgency = await this.checkAgencyOrUser(email);
    const verifiedPass = await bcrypt.compare(password, userOrAgency.password);

    if (userOrAgency && verifiedPass) {
      const { password, ...resto } = userOrAgency;
      const access_token = await this.sign(userOrAgency);
      const { id, email, ...rest } = userOrAgency;
      return { access_token, id, email };
    } else {
      throw new UnauthorizedException('Invalid email or password.');
    }
  }

  async loginGoogle(loginGoogleDto: LoginGoogleDto) {
    const user = await this.usersService.findByEmail(loginGoogleDto.email);

    if (!user) {
      const googleUser = await this.usersService.createGoogleUser(
        loginGoogleDto,
      );
      const { id, email, ...rest } = googleUser;
      const access_token = this.jwtService.sign({ id, email });
      return { access_token, id, email };
    } else {
      const verifiedPass = await bcrypt.compare(
        loginGoogleDto.password,
        user.password,
      );

      if (verifiedPass == true) {
        const { id, email, ...rest } = user;
        const access_token = this.jwtService.sign({ id, email });
        return { access_token, id, email };
      } else {
        throw new UnauthorizedException('Invalid email or password');
      }
    }
  }

  async checkAgencyOrUser(email: string) {
    const user = await this.usersService.findByEmail(email);
    const agency = await this.agenciesService.getByEmail(email);

    if (user) {
      return user;
    } else if (agency) {
      return agency;
    } else {
      throw new UnauthorizedException('email does not exist.');
    }
  }

  async sign(userOrAgency: User | Agency) {
    const payload = { id: userOrAgency.id, email: userOrAgency.email };
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }

  async verify(access_token: string) {
    const aux = access_token.split(' ')[1];

    const payload = jwt.verify(
      aux,
      process.env.JWT_SECRET_KEY,
    ) as AuthenticationData;

    const result = {
      id: payload.id,
    };

    return result;
  }
}
