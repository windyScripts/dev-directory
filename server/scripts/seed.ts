import log from 'server/lib/log';
import { createUsers } from 'server/test/utils';

export async function seed(numberOfUsersToCreate: number): Promise<void> {
  try {
    const userArray = await createUsers(numberOfUsersToCreate);
    log(`Created ${userArray.length} users!`);
  } catch (error) {
    log('Error inserting users', error);
  }
}

(async () => {
  await seed(100);
})();
