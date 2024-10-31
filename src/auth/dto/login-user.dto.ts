export class LoginUserDto {
  username: string;
  password: string;
}

export class AuthResponseDto {
  token: string;
  user: {
    _id: string;
    username: string;
  };
}
