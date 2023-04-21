import log from 'server/lib/log';
import User from 'server/models/User.model';

(async () => {
  await resetDB();
})();

export async function resetDB(): Promise<void> {
  try {
    // should return number of rows destroyed
    const deletedUsers = await User.destroy({ truncate: true });
    log(`Deleted ${deletedUsers} users!`);
  } catch (error) {
    log('Error deleting users', error);
  }
}
