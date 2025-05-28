import { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 8000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Phone Mart Api',
    description: 'Rest api for Phone Mart',
    version: '1',
    path: 'api',
  },
  security: {
    // expiresIn: '2m',
    expiresIn: '7d',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
