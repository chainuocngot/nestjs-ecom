import { Injectable } from '@nestjs/common';
import { UpdateProfileBodyType } from 'src/routes/profile/profile.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(profileId: number) {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: profileId,
      },
      include: {
        role: {
          include: {
            permissions: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }

  update(profileId: number, body: UpdateProfileBodyType) {
    return this.prismaService.user.update({
      where: {
        id: profileId,
      },
      data: {
        ...body,
        updatedById: profileId,
      },
      omit: {
        password: true,
        totpSecret: true,
      },
    });
  }

  changePassword(profileId: number, hashedNewPassword: string) {
    return this.prismaService.user.update({
      where: {
        id: profileId,
      },
      data: {
        password: hashedNewPassword,
        updatedById: profileId,
      },
    });
  }
}
