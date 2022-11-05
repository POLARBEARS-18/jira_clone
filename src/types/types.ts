// authSlice.ts
export interface LoginUser {
  id: number;
  username: string;
}

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

export interface Profile {
  id: number;
  user_profile: number;
  img: string | null;
}

export interface PostProfile {
  id: number;
  img: File | null;
}

export interface CRED {
  username: string;
  password: string;
}

export interface JWT {
  refresh: string;
  access: string;
}

export interface User {
  id: number;
  username: string;
}

export interface AuthState {
  isLoginView: boolean;
  loginUser: LoginUser;
  profiles: Profile[];
}

// taskSlice.ts
export interface ReadTask {
  id: number;
  task: string;
  description: string;
  criteria: string;
  status: string;
  status_name: string;
  category: number;
  category_item: string;
  estimate: number;
  responsible: number;
  responsible_username: string;
  owner: number;
  owner_username: string;
  created_at: string;
  updated_at: string;
}

export interface PostTask {
  id: number;
  task: string;
  description: string;
  criteria: string;
  status: string;
  category: number;
  estimate: number;
  responsible: number;
}

export interface Category {
  id: number;
  item: string;
}

export interface TaskState {
  tasks: ReadTask[];
  editedTask: PostTask;
  selectedTask: ReadTask;
  users: User[];
  category: Category[];
}

// TaskList.ts
export interface SortState {
  rows: ReadTask[];
  order: 'desc' | 'asc';
  activeKey: string;
}
