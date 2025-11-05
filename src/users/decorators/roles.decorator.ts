import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY ='roles';
export const Roles =(...roles:string[])=> SetMetadata(ROLES_KEY,roles);
// for example , we pass'admin,'user'as role to the Roles drcotaroe as @Roles('admin.'user)
// then it will set the metadat with key'roles' and values ["admin",'user'] for that routes handler as similar to the object below
//{
//roles:['admin','user']
//}