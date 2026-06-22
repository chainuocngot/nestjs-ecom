import { Injectable } from '@nestjs/common';
import { RoleName } from 'src/shared/constants/role.constant';
import { RoleType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedRoleRepository {
  private clientRoleId: number | null = null;

  constructor(private readonly prismaService: PrismaService) {}

  async getRoleByName(name: string) {
    const role: RoleType = await this.prismaService.$queryRaw<
      RoleType[]
    >`SELECT * FROM "Role" WHERE name=${name} AND deletedAt IS NULL LIMIT 1`.then((result) => {
      if (result.length === 0) {
        throw new Error('Error.RoleNotFound');
      }

      return result[0];
    });

    return role;
  }

  async getClientRoleId() {
    if (this.clientRoleId) return this.clientRoleId;

    const clientRole: RoleType = await this.getRoleByName(RoleName.Client);

    this.clientRoleId = clientRole.id;
    return this.clientRoleId;
  }
}
