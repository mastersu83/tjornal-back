import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  findByCond(cond: CreateUserDto) {
    return this.userRepository.findOne({
      where: {
        email: cond.email,
        password: cond.password,
      },
    });
  }

  async search(userDto: SearchUserDto) {
    const qb = this.userRepository.createQueryBuilder('user');

    qb.limit(userDto.limit || 0);
    qb.take(userDto.take || 10);

    if (userDto.email) {
      qb.where(`user.email ILIKE :email`);
    }

    if (userDto.fullName) {
      qb.where(`user.fullName ILIKE :fullName`);
    }

    qb.setParameters({
      email: `%${userDto.email}%`,
      fullName: `%${userDto.fullName}%`,
    });

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
