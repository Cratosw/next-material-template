declare namespace _User {
    export interface LoginInfo {
      id: string;
      userName: string;
      email: string;
      roles: string[];
      isVerified: boolean;
      jwToken: string;
      refreshToken: string;
      permissions: string[];
    }
    export interface LoginForm {
      userName: string;
      password: string;
    }
    export interface VerificatenAuthenticate {
      userName: string,
      password: string,
      verifyParam: {
        key: string,
        positionX: number,
        positionY: number,
        removeIfSuccess: boolean;
      }
    }
    export interface JwtToken {
      sub: string;
      jti: string;
      email: string;
      uid: string;
      uname: string;
      ip: string;
      roles: string[];
      exp: number;
      iss: string;
      aud: string;
    }
    export interface UserDetailProps extends BaseResult{
      id: string;
      userName: string;
      email: string;
      isActive: boolean;
      emailConfirmed: boolean;
      phoneNumber: string;
      phoneNumberConfirmed: boolean;
      isAdmin: boolean;
      creatTime: string;
      lockoutEnd: string;
      lockoutEnabled: boolean;
      accessFailedCount: number;
      openId: string;
      inviteCode: string;
      inviterId: string;
      isSuperAdmin: boolean;
      manualEntryKey: string;
      balance: number;
      point: number;
      grade: number;
      parentId: string;
      userWx: number;
    }
    export interface UserRoleProps {
      roleId: string;
      roleName: string;
      enabled: boolean;
    }
    export interface UserRolesProps {
      UserRoles: UserRoleProps[];
    }
  
    export interface AddUserProps {
      userName: string;
      organizeId: string;
      headImg?: string;
      email: string;
      phoneNumber: string;
      isAdmin?: boolean;
    }
  }
  