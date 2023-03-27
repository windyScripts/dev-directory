import fs from 'fs';
import { EOL } from 'os';

import log from 'server/lib/log';

function updateOrAddToEnvFile(file: string, key: string, value: string) {
  try {
    const envContents = fs.readFileSync(file, 'utf-8');
    const { newContents, oldValue } = updateOrAddInEnvString(envContents, key, value);

    fs.writeFileSync(file, newContents);
    log(`'${key}' has been updated in ${file}'!${oldValue && ` Old value: ${oldValue}`}`);
  } catch(error) {
    log(`Failed to write changes to the '${file}' file.`);
  }
}

/**
 * Set the value of a specific key in a .env-formatted string.
 *
 * @param envContents A string following .env format.
 * @param key The key to set the value of.
 * @param value The value to set.
 * @returns {{oldValue: string, newContents: string}}
 */
function updateOrAddInEnvString(envContents: string, key: string, value: string) {
  let newContents = envContents;
  const newValue = `${key}=${value}`;

  let oldValue = '';
  const keyRegex = new RegExp(`^${key}\\s*=.*$`, 'gm');

  if (keyRegex.test(newContents)) {
    newContents = newContents.replace(keyRegex, match => {
      oldValue = match.replace(new RegExp(`^${key}=`, 'gm'), '');
      return newValue;
    });
  } else {
    newContents += `${EOL}${newValue}${EOL}`;
  }

  return {
    newContents,
    oldValue,
  };
}

export {
  updateOrAddToEnvFile,
  updateOrAddInEnvString,
};
