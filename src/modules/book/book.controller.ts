import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto } from './dtos';
import { RoleType } from '../role/roletype.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role/role.guard';
import { Roles } from '../role/decorators/role.decorator';
import { GetUser } from '../auth/user.decorator';
import { Role } from '../role/role.entity';

@Controller('book')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @Get(':bookId')
  getBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto> {
    return this._bookService.get(bookId);
  }

  @Get('author/:authorId')
  getBooksByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<ReadBookDto[]> {
    return this._bookService.getBookByAuthor(authorId);
  }

  @Get()
  getBooks(): Promise<ReadBookDto[]> {
    return this._bookService.getAll();
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBook(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    return this._bookService.create(book);
  }

  @Patch(':bookId')
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  async updateBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() book: Partial<CreateBookDto>,
    @GetUser('id') authorId: number,
  ): Promise<void> {
    return this._bookService.update(bookId, book, authorId);
  }

  @Delete(':bookId')
  @Roles(RoleType.AUTHOR, RoleType.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  deleteBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<void> {
    return this._bookService.delete(bookId);
  }
}
