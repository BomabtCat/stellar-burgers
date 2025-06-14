import type { Config } from 'jest';

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom', // Используем jsdom для тестов синхронных экшенов
  verbose: true,
};

module.exports = config;

module.exports = config;
export default config;
