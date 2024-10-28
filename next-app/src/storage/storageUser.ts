import { USER } from './storageConfig';
import { UserDTO } from '../dtos/UserDTO';

export async function storageUserSave(user: UserDTO) {
  localStorage.setItem(USER, JSON.stringify(user));
}

export async function storageUserGet() {
  const storage = localStorage.getItem(USER);
  const mainUser: UserDTO = storage ? JSON.parse(storage) : {};
  return mainUser;
}

export async function storageUserRemove() {
  localStorage.removeItem(USER);
}
