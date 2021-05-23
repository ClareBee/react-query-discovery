export type User = {
  id?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  email?: string;
};

type Support = {
  text: string;
  url: string;
};

export type Users = {
  data: Array<User>;
  page: number;
  per_page: number;
  support: Support;
  total: number;
  total_pages: number;
};
