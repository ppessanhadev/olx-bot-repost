import {
  Category,
  CategoryServiceFactory,
  CategoryConfiguration,
  LogLevel,
} from 'typescript-logging';

CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info));

const logger = {
  automator: new Category('AUTOMATOR'),
  create: new Category('CREATE'),
  delete: new Category('DELETE'),
  login: new Category('LOGIN'),
};

export default logger;
