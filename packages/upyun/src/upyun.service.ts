import { Injectable } from '@nestjs/common'
import * as upyun from 'upyun'

@Injectable()
export class UpyunService extends upyun.Client {}
