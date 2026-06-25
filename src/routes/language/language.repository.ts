import { Injectable } from '@nestjs/common';
import { CreateLanguageBodyType, UpdateLanguageBodyType } from 'src/routes/language/language.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class LanguageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListLanguage() {
    const [total, records] = await Promise.all([
      this.prismaService.language.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.language.findMany({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      total,
      records,
    };
  }

  findById(languageId: string) {
    return this.prismaService.language.findUniqueOrThrow({
      where: {
        id: languageId,
        deletedAt: null,
      },
    });
  }

  create(createdById: number, body: CreateLanguageBodyType) {
    return this.prismaService.language.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({ updatedById, body, languageId }: { updatedById: number; body: UpdateLanguageBodyType; languageId: string }) {
    return this.prismaService.language.update({
      where: {
        id: languageId,
        deletedAt: null,
      },
      data: {
        ...body,
        updatedById,
      },
    });
  }

  delete(deletedById: number, languageId: string) {
    return this.prismaService.language.update({
      where: {
        id: languageId,
        deletedAt: null,
      },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
}
