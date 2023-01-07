import { ConfigService } from '@nestjs/config';

export const getHashConfig = async (configService: ConfigService) => ({
  saltRounds: configService.get('SALT_ROUNDS') || 10,
});
