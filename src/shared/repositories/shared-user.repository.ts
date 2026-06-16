import { Injectable } from '@nestjs/common';
import { RoleType, UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(uniqueObject: { email: string } | { id: number }): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    });
  }

  findUniqueIncludeRole(
    uniqueObject: { email: string } | { id: number },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true,
      },
    });
  }
}
