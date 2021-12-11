import 'dotenv/config';
import 'reflect-metadata';

import { Automator } from './automator';
import websiteConfigs from './config/website';

const automator = new Automator(websiteConfigs.baseUrl);

automator.start();
