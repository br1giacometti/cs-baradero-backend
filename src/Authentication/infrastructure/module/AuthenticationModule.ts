import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import PlayerDataProvider from '../dataProvider/PlayerDataProvider';
import PlayerRepository from 'Authentication/application/repository/PlayerRepository';

import PlayerService from 'Authentication/application/service/PlayerService';
import PlayerController from '../controller/PlayerController';
import JornadaController from '../controller/JornadaController';
import PartidoService from 'Authentication/application/service/PartidoService';
import JornadaService from 'Authentication/application/service/JornadaService';
import PartidoRepository from 'Authentication/application/repository/PartidoRepository';
import PartidoDataProvider from '../dataProvider/PartidoDataProvider';
import JornadaRepository from 'Authentication/application/repository/JornadaRepository';
import JornadaDataProvider from '../dataProvider/JornadaDataProvider';
import PuntuacionService from 'Authentication/application/service/PuntuacionService';
import PuntuacionRepository from 'Authentication/application/repository/PuntuacionRepository';
import PuntuacionDataProvider from '../dataProvider/PuntuacionDataProvider';
import AuthenticationController from '../controller/AuthenticationController';
import LocalStrategy from '../strategy/LocalStrategy';
import JwtStrategy from '../strategy/JwtStrategy';
import AuthenticationService from 'Authentication/application/service/AuthenticationService';
import UserService from 'Authentication/application/service/UserService';
import UserRepository from 'Authentication/application/repository/UserRepository';
import UserDataProvider from '../dataProvider/UserDataProvider';

const jwtFactory = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET_KEY'),
    signOptions: {
      expiresIn: configService.get('JWT_EXP_D'),
    },
  }),
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [JwtModule.registerAsync(jwtFactory), PassportModule],
  controllers: [PlayerController, JornadaController, AuthenticationController],
  providers: [
    PlayerService,
    LocalStrategy,
    JwtStrategy,
    AuthenticationService,
    UserService,
    PartidoService,
    {
      provide: PlayerRepository,
      useClass: PlayerDataProvider,
    },

    {
      provide: PartidoRepository,
      useClass: PartidoDataProvider,
    },
    JornadaService,
    {
      provide: JornadaRepository,
      useClass: JornadaDataProvider,
    },
    PuntuacionService,
    {
      provide: PuntuacionRepository,
      useClass: PuntuacionDataProvider,
    },
    {
      provide: UserRepository,
      useClass: UserDataProvider,
    },
  ],
  exports: [
    PlayerService,
    PassportModule,
    PartidoService,
    JornadaService,
    PuntuacionService,
  ],
})
export default class UserModule {}
