import { TypeOrmModule } from "@nestjs/typeorm"

export const TypeOrmConfig = TypeOrmModule.forRootAsync({
  useFactory: () => {
    // Se DATABASE_URL estiver definida, usar ela (comum no Docker)
    if (process.env.DATABASE_URL) {
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/../../modules/**/entities/*.entity{.ts,.js}'],
        synchronize: true,
        migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
        ssl: false, // Desabilitar SSL para desenvolvimento local
      };
    }

    // Caso contrário, usar variáveis individuais
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres123',
      database: process.env.DB_NAME || 'elastic_code',
      entities: [__dirname + '/../../modules/**/entities/*.entity{.ts,.js}'],
      synchronize: true,
      migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
      ssl: false, // Desabilitar SSL para desenvolvimento local
    };
  },
});