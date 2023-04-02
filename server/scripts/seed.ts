import Db from 'server/lib/db';
import log from 'server/lib/log';
import User from 'server/models/User.model';
import { createManyUsers } from 'server/test/utils';

export async function seed(numberOfUsersToCreate: number): Promise<void> {
  try {
    const userArray = await createManyUsers(numberOfUsersToCreate);
    await Db.sequelize.transaction(async transaction => {
      await User.bulkCreate(userArray, { transaction });
    });
    log(`Created ${userArray.length} users!`);
  } catch (error) {
    console.log(error);
    log('Error inserting users');
  }
}

(async () => {
  await seed(100);
})();
