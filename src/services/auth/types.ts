export type User = {
  id: string;
  password: string;
  created_at: Date;
};

export type Session = {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
};
