import { Module } from '@nestjs/common';
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

@Module({
  imports: [JwtModule.registerAsync(jwtFactory), PassportModule],
  controllers: [PlayerController, JornadaController],
  providers: [
    PlayerService,
    {
      provide: PlayerRepository,
      useClass: PlayerDataProvider,
    },
    PartidoService,
    {
      provide: PartidoRepository,
      useClass: PartidoDataProvider,
    },
    JornadaService,
    {
      provide: JornadaRepository,
      useClass: JornadaDataProvider,
    },
  ],
  exports: [PlayerService, PassportModule, PartidoService, JornadaService],
})
export default class UserModule {}
