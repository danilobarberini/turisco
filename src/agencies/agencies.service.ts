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
import { PoiService } from 'src/poi/poi.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Agency } from './entities/agency.entity';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectModel(Agency)
    private agencyEntity: typeof Agency,
    @Inject(forwardRef(() => PoiService))
    private poiService: PoiService,
  ) {}

  async create(dto: CreateAgencyDto) {
    try {
      const agency = new Agency();
      agency.name = dto.name;
      agency.email = dto.email;
      agency.cnpj = dto.cnpj;
      agency.password = await bcrypt.hash(dto.password, 10);
      const agencyData = await agency.save();

      return agencyData;
    } catch (error) {
      throw new HttpException(error.errors[0].message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Agency[]> {
    return this.agencyEntity.findAll();
  }

  async findOne(id: string) {
    return await this.agencyEntity.findOne({
      where: {
        id: id,
      },
    });
  }

  async getByEmail(email: string): Promise<Agency> {
    const agency = await this.agencyEntity.findOne({
      where: {
        email,
      },
    });
    return agency;
  }

  async update(id: string, dto: UpdateAgencyDto) {
    const agency = await this.agencyEntity.update(dto, {
      where: {
        id: id,
      },
    });

    return agency;
  }

  async remove(id: string) {
    const agency = await this.findOne(id);
    await agency.destroy();

    return agency;
  }

  async newPassword(id: string, updateAgencyDto: UpdateAgencyDto) {
    const agency = await this.agencyEntity.findByPk(id);
    const hashPass = await bcrypt.hash(updateAgencyDto.password, 10);
    agency.password = hashPass;
    await agency.save();
    return agency;
  }

  async sendMail(email: string) {
    const agency = await this.getByEmail(email);

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
      html: `<br><b>Seu link de recuperação: <a href="localhost:3000/users/resetpassword/${agency.id}">Recupere sua senha!</a></b>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.log(err);

      console.log(`Message sent: ${info.messageId}`);
      console.log(`Message preview: ${getTestMessageUrl(info)}`);
    });
  }

  async upload(id: string, url: string) {
    const agency = await this.agencyEntity.findByPk(id);
    agency.picture = url;
    return agency;
  }
}
