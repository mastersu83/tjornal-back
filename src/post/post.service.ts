import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { SearchPostDto } from './dto/search-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  create(createPostDto: CreatePostDto) {
    return this.postRepository.save({ ...createPostDto, user: { id: 7 } });
  }

  findAll() {
    return this.postRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async popular() {
    const qb = this.postRepository.createQueryBuilder();

    qb.orderBy('views', 'ASC');
    qb.limit(10);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
    };
    // return this.postRepository.find({
    //   order: {
    //     views: 'DESC',
    //   },
    // });
  }

  async search(createPostDto: SearchPostDto) {
    const qb = this.postRepository.createQueryBuilder('post');

    qb.limit(createPostDto.limit || 0);
    qb.take(createPostDto.take || 10);

    if (createPostDto.views) {
      qb.orderBy('views', createPostDto.views);
    }

    if (createPostDto.shortDesc) {
      qb.where(`post.shortDesc ILIKE :shortDesc`);
    }

    if (createPostDto.longDesc) {
      qb.where(`post.longDesc ILIKE :longDesc`);
    }

    if (createPostDto.title) {
      qb.where(`post.title ILIKE :title`);
    }

    if (createPostDto.tag) {
      qb.where(`post.tag ILIKE :tag`);
    }

    qb.setParameters({
      title: `%${createPostDto.title}%`,
      longDesc: `%${createPostDto.longDesc}%`,
      shortDesc: `%${createPostDto.shortDesc}%`,
      tag: `%${createPostDto.tag}%`,
      views: createPostDto.views || '',
    });

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
    };
    // return this.postRepository.find({
    //   order: {
    //     createdAt: 'DESC',
    //   },
    // });
  }

  async findOne(id: number) {
    await this.postRepository
      .createQueryBuilder('posts')
      .whereInIds(id)
      .update()
      .set({ views: () => `views + 1` })
      .execute();

    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException({ message: 'Статья не найдена' });
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException({ message: 'Статья не найдена' });
    }
    return this.postRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException({ message: 'Статья не найдена' });
    }
    return this.postRepository.delete(id);
  }
}
