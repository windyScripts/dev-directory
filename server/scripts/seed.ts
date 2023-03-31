import Db from 'server/lib/db';
import log from 'server/lib/log';
import User from 'server/models/User.model';
import { makeUser } from 'server/test/utils';
import { UserObject } from 'server/types/User';

async function create100Users(): Promise<UserObject[]> {
  const promises = Array.from({ length: 100 }, makeUser);
  const userArray = await Promise.all(promises);
  return userArray;
}

async function insertUsers(userArray: UserObject[]) {
  try {
    await Db.sequelize.transaction(async transaction => {
      await User.bulkCreate(userArray, { transaction });
    });
    log('Successfully inserted 100 users');
  } catch (error) {
    console.log(error);
    log('Error inserting users');
  }
}

export async function seed(): Promise<void> {
  try {
    const userArray = await create100Users();
    await insertUsers(userArray);
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  await seed();
})();
