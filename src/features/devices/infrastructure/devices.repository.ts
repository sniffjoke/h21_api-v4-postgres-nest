import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DeviceEntity } from '../domain/devices.entity';


@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(DeviceEntity) private readonly dRepository: Repository<DeviceEntity>,
  ) {
  }

  async createSession(deviceData: any) {
    const result = await this.dRepository.save(
      deviceData
      // 'INSERT INTO devices ("userId", "deviceId", "title", "ip", "lastActiveDate") VALUES ($1, $2, $3, $4, $5) RETURNING *', [
      // deviceData.userId,
      // deviceData.deviceId,
      // deviceData.title,
      // deviceData.ip,
      // deviceData.lastActiveDate,
    // ]
    );
    return result;
  }

  async findManyDevices(filter: any) {
    const findedDevice = await this.dRepository.findOne(
      {where: {userId: filter.userId, ip: filter.ip, title: filter.title}}
      // 'SELECT * FROM devices WHERE "userId" = $1 AND "ip" = $2 AND "title" = $3',
      // [filter.userId, filter.ip, filter.title],
    );
    // if (!findedDevice) {
    //   throw new NotFoundException('Device not found');
    // }
    return findedDevice;
  }

  async findDeviceByUserId(filter: any) {
    const findedDevice = await this.dRepository.find(
      {where: {userId: filter.userId}}
      // 'SELECT * FROM devices WHERE "userId" = $1',
      // [filter.userId],
    );
    if (!findedDevice) {
      throw new NotFoundException('Device not found');
    }
    return findedDevice;
  }

  async findDeviceByDeviceId(filter: any) {
    const findedDevice = await this.dRepository.findOne(
      {where: {deviceId: filter.deviceId}}
      // 'SELECT * FROM devices WHERE "deviceId" = $1',
      // [filter.deviceId],
    );
    if (!findedDevice) {
      throw new NotFoundException('Device not found');
    }
    return findedDevice;
  }

  // update device info

  async updateDeviceById(id: string, newDate: any) {
    return await this.dRepository.update(
      {id},
      {lastActiveDate: newDate},
      // 'UPDATE devices SET "lastActiveDate" = $1 WHERE id = $2', [newDate, id]
    );
  }

  // update device info after refresh tokens

  async updateDeviceByIdAndByDeviceId(id: string, deviceId: string, newDate: any) {
    return await this.dRepository.update(
      {userId: id, deviceId},
      {lastActiveDate: newDate}
      // `// UPDATE devices SET "lastActiveDate" = $1 WHERE "userId" = $2 AND "deviceId" = $3`,
      // [deviceData, id, deviceId]);
    )
  }

  async deleteDeviceByDeviceId(filter: any) {
    const finderDevice = this.findDeviceByDeviceId(filter.deviceId);
    return await this.dRepository.delete(
      {deviceId: filter.deviceId}
      // 'DELETE FROM devices WHERE "deviceId" = $1', [filter.deviceId]
    );
  }

  async deleteAllDevicesExceptCurrent(filter: any) {
    const deleteDevices = await this.dRepository.delete(
      {deviceId: Not(filter.deviceId), userId: filter.userId}
      // `// DELETE  FROM devices WHERE "deviceId" <> $1 AND "userId" = $2`,
      // [
      //             filter.deviceId, filter.userId,
      //           ],
    );
    return deleteDevices;
  }

}
