import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';
import { POI } from 'src/poi/entities/poi.entity';
import { PoiService } from 'src/poi/poi.service';
import { CryptService } from '../auth/crypt.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { RemoveFavoriteDto } from './dto/remove-favorite.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Favorite } from './entities/favorites.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Favorite)
    private favoriteModel: typeof Favorite,
    @Inject(forwardRef(() => CryptService))
    private cryptService: CryptService,
    @Inject(forwardRef(() => PoiService))
    private poiService: PoiService,
  ) {}

  // CREATE, LOGIN AND UPLOAD AVATAR//
  async create(createUserDto: CreateUserDto) {
    try {
      const hashPass = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashPass;
      return await this.userModel.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.errors[0].message, HttpStatus.BAD_REQUEST);
    }
  }

  // CREATE AND LOGIN GOOGLE // ADD, LOGIN //

  async createGoogleUser(loginGoogleDto: LoginGoogleDto) {
    const hashPass = await bcrypt.hash(loginGoogleDto.password, 10);
    loginGoogleDto.password = hashPass;
    const googleUser = await this.userModel.create(loginGoogleDto);
    return googleUser;
  }

  // // // //

  async upload(id: string, url: string) {
    const user = await this.userModel.findByPk(id);
    user.picture = url;
    user.save();
    return user;
  }

  // FAVORITES // GET, ADD, REMOVE //

  async getFavorites(id: string) {
    const favorites = await this.favoriteModel.findAll({
      include: [POI],
      where: { userId: id },
    });
    return favorites;
  }

  async addFavorite(createFavoriteDto: CreateFavoriteDto) {
    const fav = await this.favoriteModel.findOne({
      include: [User, POI],
      where: {
        userId: createFavoriteDto.userId,
        poiId: createFavoriteDto.poiId,
      },
    });
    if (fav === null) {
      const newFav = await this.favoriteModel.create(createFavoriteDto);
      return newFav;
    } else return fav;
  }

  async removeFavorite(removeFavoriteDto: RemoveFavoriteDto) {
    const user = await this.userModel.findByPk(removeFavoriteDto.userId);
    const fav = await this.favoriteModel.findOne({
      include: [User, POI],
      where: {
        userId: removeFavoriteDto.userId,
        poiId: removeFavoriteDto.poiId,
      },
    });
    if (fav === null) {
      throw new HttpException('Favorite not on user list.', 400);
    } else {
      await this.favoriteModel.destroy({ where: { id: fav.id } });
      return user;
    }
  }

  // FIND BY MAIL, FINDALL AND FINDONE //

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: string) {
    return await this.userModel.findByPk(id);
  }

  // UPDATE AND DELETE USER //

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    const hashPass = await this.cryptService.crypt(updateUserDto.password);
    user.password = hashPass;
    await user.save();
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  // FORGOT MY PASSWORD AND RESET PASSWORD //
  async newPassword(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);
    const hashPass = await this.cryptService.crypt(updateUserDto.password);
    user.password = hashPass;
    await user.save();
    return user;
  }

  async sendMail(email: string) {
    const user = await this.findByEmail(email);

    let testAccount = await createTestAccount();
    let transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: 'GUIA TURISTICO <no-reply@guiaturistico.com>',
      to: `${email}`,
      subject: 'Link para recuperação de senha! :D',
      text: '',
      html: `<br><b> Olá ${user.username}! </br>
      Seu link de recuperação:</br>
      <a href="localhost:3000/users/resetpassword/${user.id}">Recupere sua senha!</a></b>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.log(err);

      console.log(`Message sent: ${info.messageId}`);
      console.log(`Message preview: ${getTestMessageUrl(info)}`);
    });
  }
}
