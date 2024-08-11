import * as upyun from 'upyun'
import type { DynamicModule, InjectionToken, Provider } from '@nestjs/common'
import { Module } from '@nestjs/common'
import type { Promisable } from '@naiable/utils'
import { UpyunService } from './upyun.service'

export interface UpyunSingletonOptions {
  bucket: string
  operator: string
  password: string
}

export type UpyunMultipleOptions = UpyunSingletonOptions & {
  provide: InjectionToken
}

export type UpyunModuleOptions = UpyunSingletonOptions | UpyunMultipleOptions[]

export type UpyunModuleAsyncOptions = {
  useFactory: (...args: any[]) => Promisable<UpyunSingletonOptions>
  inject?: any[]
} | {
  useFactory: (...args: any[]) => Promisable<UpyunMultipleOptions>
  inject?: any[]
  provide: InjectionToken
}[]

@Module({})
export class UpyunModule {
  public static forRoot(options: UpyunModuleOptions): DynamicModule {
    const providers: Provider[] = []
    if (Array.isArray(options)) {
      options.forEach(option => providers.push({
        provide: option.provide,
        useValue: new upyun.Client(new upyun.Bucket(option.bucket, option.operator, option.password)),
      }),
      )
    }
    else {
      providers.push({
        provide: UpyunService,
        useValue: new upyun.Client(new upyun.Bucket(options.bucket, options.operator, options.password)),
      })
    }

    return {
      module: UpyunModule,
      providers,
      exports: providers,
      global: true,
    }
  }

  public static forRootAsync(options: UpyunModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = []
    if (Array.isArray(options)) {
      options.forEach(options => providers.push({
        provide: options.provide,
        inject: options.inject,
        async useFactory(...args) {
          const result = await options.useFactory(...args)
          return new upyun.Client(new upyun.Bucket(result.bucket, result.operator, result.password))
        },
      }))
    }
    else {
      providers.push({
        provide: UpyunService,
        inject: options.inject,
        async useFactory(...args) {
          const result = await options.useFactory(...args)
          return new upyun.Client(new upyun.Bucket(result.bucket, result.operator, result.password))
        },
      })
    }

    return {
      module: UpyunModule,
      providers,
      exports: providers,
      global: true,
    }
  }
}
