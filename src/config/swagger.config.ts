import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API BookingPhoto')
    .setDescription('Tài liệu API cho dự án Mạng xã hội Drugconnection')
    .setVersion('1.0')
    .addBearerAuth() // nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // giữ lại token sau khi nhập
    },
  });
}
