/**
 * @author Harry Tang <harry@powerkernel.com>
 * @link https://powerkernel.com
 * @copyright Copyright (c) 2022 Power Kernel
 */

import { MongoDbClient } from '.';
import { Binary, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
});

afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
});

it('should throw error when getting the Db without connecting first', async () => {
  expect(() => {
    MongoDbClient.db;
  }).toThrow();
});

it('should generate an UUID object from UUID string', () => {
  const uuidString = '63cd4ac5-6664-4247-8854-28bc8871da5e';
  const uuidObject = MongoDbClient.createUuid(uuidString);
  expect(uuidObject).toBeInstanceOf(Binary);
});

it('should generate an UUID string from UUID object', () => {
  const uuidString = '63cd4ac5-6664-4247-8854-28bc8871da5e';
  const uuidObject = MongoDbClient.createUuid(uuidString);
  const result = MongoDbClient.stringifyUuid(uuidObject);
  expect(result).toEqual(uuidString);
});

it('should connect to the MongoDB server', async () => {
  try {
    await MongoDbClient.connect({
      dbUri: mongoServer.getUri(),
      dbName: 'admin',
    });
    await MongoDbClient.close();
  } catch (err) {
    fail('it should not reach here');
  }
});

it('should return the Db instance', async () => {
  try {
    await MongoDbClient.connect({
      dbUri: mongoServer.getUri(),
      dbName: 'admin',
    });
    const db = MongoDbClient.db;
    await MongoDbClient.close();
    expect(db).toBeInstanceOf(Db);
  } catch (err) {
    fail('it should not reach here');
  }
});
