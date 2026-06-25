import { Injectable } from '@nestjs/common';
import { LanguageAlreadyExistsException, LanguageNotFoundException } from 'src/routes/language/language.error';
import { CreateLanguageBodyType, UpdateLanguageBodyType } from 'src/routes/language/language.model';
import { LanguageRepository } from 'src/routes/language/language.repository';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/utils';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  list() {
    return this.languageRepository.getListLanguage();
  }

  async findById(languageId: string) {
    try {
      return await this.languageRepository.findById(languageId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw LanguageNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreateLanguageBodyType) {
    try {
      return await this.languageRepository.create(createdById, body);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw LanguageAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({
    updatedById,
    body,
    languageId,
  }: {
    updatedById: number;
    body: UpdateLanguageBodyType;
    languageId: string;
  }) {
    try {
      return await this.languageRepository.update({
        updatedById,
        body,
        languageId,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw LanguageAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw LanguageNotFoundException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, languageId: string) {
    try {
      await this.languageRepository.delete(deletedById, languageId);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw LanguageAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw LanguageNotFoundException;
      }

      throw error;
    }
  }
}
