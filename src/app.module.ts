import { Module } from '@nestjs/common';
import { Configuration } from './config/config.keys';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './modules/category/category.module';
import { VariableModule } from './modules/variable/variable.module';
import { ValueModule } from './modules/value/value.module';

@Module({
  imports: [ConfigModule, DatabaseModule, CategoryModule, VariableModule, ValueModule],
  controllers: [],
  providers: [],
})
export class AppModule {    
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
      AppModule.port = this._configService.get(Configuration.PORT);
  }
}
