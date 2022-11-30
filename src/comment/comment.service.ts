import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    return this.commentRepository.save({
      text: createCommentDto.text,
      post: { id: createCommentDto.postId },
      user: { id: 6 },
    });
  }

  findAll() {
    return this.commentRepository.find();
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new NotFoundException({ message: 'Комментарий не найдена' });
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const post = await this.commentRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException({ message: 'Комментарий не найдена' });
    }

    return this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: number) {
    const post = await this.commentRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException({ message: 'Комментарий не найдена' });
    }
    return this.commentRepository.delete(id);
  }
}
