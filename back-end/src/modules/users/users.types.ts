export interface CreateUserInput {
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}
