import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { BookRepository } from './book.repository';
import { StatusType } from '../../shared/statustype.enum';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';
import { plainToInstance } from 'class-transformer';
import { Book } from './book.entity';
import { RoleType } from '../role/roletype.enum';
import { Role } from '../role/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookService {
  constructor(
    private readonly _bookRepository: BookRepository,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    if (bookId) {
      throw new BadRequestException('bookId must be sent');
    }

    const book: Book = await this._bookRepository.findOneBy({
      id: bookId,
      status: StatusType.ACTIVE,
    });

    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    return plainToInstance(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.findBy({
      status: StatusType.ACTIVE,
    });

    return books.map((book: Book) => plainToInstance(ReadBookDto, book));
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('id must be sent');
    }

    const books: Book[] = await this._bookRepository.findBy({
      status: StatusType.ACTIVE,
      authors: In[authorId],
    });

    return books.map((book) => plainToInstance(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExists = await this._userRepository.findOneBy({
        id: authorId,
        status: StatusType.ACTIVE,
      });

      if (!authorExists) {
        throw new NotFoundException(
          `There's not an author with ${authorId} id`,
        );
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(`${authorId} is not an author`);
      }
      authors.push(authorExists);
    }

    const savedBook: Book = await this._bookRepository.save({
      title: book.title,
      description: book.description,
      authors,
    });

    return plainToInstance(ReadBookDto, savedBook);
  }

  async update(
    bookId: number,
    book: Partial<UpdateBookDto>,
    authorId: number,
  ): Promise<void> {
    const bookExists: Book = await this._bookRepository.findOneBy({
      id: bookId,
      status: StatusType.ACTIVE,
    });

    if (!bookExists) {
      throw new NotFoundException('This book does not exists');
    }

    const isOwnBook = bookExists.authors.some(
      (author) => author.id === authorId,
    );
    if (!isOwnBook) {
      throw new UnauthorizedException(`${authorId} isn't the book's author`);
    }

    await this._bookRepository.update(bookId, book);
  }

  async delete(bookId: number): Promise<void> {
    const bookExists: Book = await this._bookRepository.findOneBy({
      id: bookId,
      status: StatusType.ACTIVE,
    });

    if (!bookExists) {
      throw new NotFoundException('This book does not exists');
    }

    await this._bookRepository.update(bookId, { status: StatusType.INACTIVE });
  }
}
