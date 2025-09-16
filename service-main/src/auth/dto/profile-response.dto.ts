export class ProfileResponse {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  avatar: string | null;
  username: string | null;
  status: 'ACTIVE' | 'INACTIVE' | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}