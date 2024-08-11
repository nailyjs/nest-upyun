import { Injectable } from '@nestjs/common'
import { Client } from 'upyun'

@Injectable()
export class UpyunService extends Client {}
