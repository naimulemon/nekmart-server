import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
//Validation Pipe
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Pipe Use
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();