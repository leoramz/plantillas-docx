import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { Configuration } from "../config/config.keys";
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        async useFactory(config: ConfigService) {
          return {
            type: config.get(Configuration.DB_TYPE),
            host: config.get(Configuration.DB_HOST),
            username: config.get(Configuration.DB_USERNAME),
            port: config.get(Configuration.DB_PORT),
            database: config.get(Configuration.DB_NAME),
            password: config.get(Configuration.DB_PASSWORD),
            entities: ['dist/**/**/*.entity{.ts,.js}'],
            synchronize: true
          } as ConnectionOptions;
        },
    }),
]
