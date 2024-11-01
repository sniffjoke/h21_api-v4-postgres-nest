import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../domain/devices.entity';


@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(DeviceEntity) private readonly dRepository: Repository<DeviceEntity>,
  ) {
  }

  async createSession(deviceData: any) {
    return this.dRepository.save(deviceData);
  }

  async findManyDevices(filter: any) {
    const findedDevice = await this.dRepository.findOne({where: {...filter}});
    // if (!findedDevice) {
    //   throw new NotFoundException('Device not found');
    // }
    return findedDevice;
  }

  async findDevice(filter: any) {
    const findedDevice = await this.dRepository.find(filter);
    if (!findedDevice) {
      throw new NotFoundException('Device not found');
    }
    return findedDevice;
  }

  async updateDeviceById(id: string, deviceData: any) {
    return this.dRepository.save({
      id,
      ...deviceData
    });
  }

}
