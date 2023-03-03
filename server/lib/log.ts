// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function log(...args: any[]) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  console.log(new Date(), ...args);
}
