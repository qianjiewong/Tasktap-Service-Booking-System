declare module "bcryptjs" {
  export function hash(
    password: string,
    salt: number | string
  ): Promise<string>;
  export function hashSync(password: string, salt: number | string): string;
  export function compare(password: string, hash: string): Promise<boolean>;
  export function compareSync(password: string, hash: string): boolean;
  export function genSaltSync(rounds?: number): string;
  export function genSalt(rounds?: number): Promise<string>;
}
