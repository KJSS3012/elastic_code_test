import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { cleanDatabase } from './utils/test-helpers';

describe('API E2E Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    await app.listen(3001);

    dataSource = moduleFixture.get<DataSource>(DataSource);
    pactum.request.setBaseUrl('http://localhost:3001');
  });

  beforeEach(async () => {
    if (dataSource) {
      await cleanDatabase(dataSource);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should return app health status', async () => {
      await pactum
        .spec()
        .get('/health')
        .expectStatus(200)
        .expectJsonLike({
          status: 'ok',
          timestamp: /.+/,
        });
    });
  });

  describe('Authentication Flow', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      await pactum
        .spec()
        .post('/auth/register')
        .withBody(userData)
        .expectStatus(201)
        .expectJsonLike({
          message: 'User registered successfully',
          data: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
          },
        });
    });

    it('should login with valid credentials', async () => {
      // First register a user
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      await pactum
        .spec()
        .post('/auth/register')
        .withBody(userData)
        .expectStatus(201);

      // Then login
      await pactum
        .spec()
        .post('/auth/login')
        .withBody({
          email: userData.email,
          password: userData.password,
        })
        .expectStatus(200)
        .expectJsonLike({
          access_token: /.+/,
          user: {
            email: userData.email,
          },
        })
        .stores('authToken', 'access_token');
    });

    it('should reject invalid credentials', async () => {
      await pactum
        .spec()
        .post('/auth/login')
        .withBody({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        })
        .expectStatus(401);
    });
  });

  describe('Crops CRUD Operations', () => {
    beforeEach(async () => {
      // Setup authentication for protected routes
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      await pactum
        .spec()
        .post('/auth/register')
        .withBody(userData)
        .expectStatus(201);

      await pactum
        .spec()
        .post('/auth/login')
        .withBody({
          email: userData.email,
          password: userData.password,
        })
        .expectStatus(200)
        .stores('authToken', 'access_token');
    });

    it('should create a new crop', async () => {
      const cropData = {
        crop_name: 'Milho Teste E2E',
      };

      await pactum
        .spec()
        .post('/crops')
        .withHeaders('Authorization', 'Bearer $S{authToken}')
        .withBody(cropData)
        .expectStatus(201)
        .expectJsonLike({
          message: 'Crop created successfully',
          data: {
            crop_name: cropData.crop_name,
            id: /.+/,
          },
        })
        .stores('cropId', 'data.id');
    });

    it('should reject unauthorized crop creation', async () => {
      const cropData = {
        crop_name: 'Milho Não Autorizado',
      };

      await pactum
        .spec()
        .post('/crops')
        .withBody(cropData)
        .expectStatus(401);
    });

    it('should get all crops', async () => {
      // Create a few crops first
      const crops = ['Milho', 'Soja', 'Trigo'];

      for (const cropName of crops) {
        await pactum
          .spec()
          .post('/crops')
          .withHeaders('Authorization', 'Bearer $S{authToken}')
          .withBody({ crop_name: cropName })
          .expectStatus(201);
      }

      await pactum
        .spec()
        .get('/crops')
        .withHeaders('Authorization', 'Bearer $S{authToken}')
        .expectStatus(200)
        .expectJsonLike({
          data: [{
            crop_name: /^(Milho|Soja|Trigo)$/,
            id: /.+/,
          }],
          total: crops.length,
          page: 1,
          lastPage: 1,
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      const invalidCropData = {
        crop_name: '', // Empty name should fail validation
      };

      await pactum
        .spec()
        .post('/crops')
        .withBody(invalidCropData)
        .expectStatus(400);
    });

    it('should handle not found errors', async () => {
      const nonExistentId = 'non-existent-id';

      await pactum
        .spec()
        .get(`/crops/${nonExistentId}`)
        .expectStatus(401); // Should be unauthorized without token
    });
  });
});
