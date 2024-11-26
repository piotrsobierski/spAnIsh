import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Spanish Vocabulary API',
    description: 'API for Spanish vocabulary learning application'
  },
  host: 'localhost:3001',
  schemes: ['http'],
  tags: [
    {
      name: 'Example',
      description: 'Example endpoints'
    }
  ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc); 