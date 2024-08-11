# ☁️ Upyun SDK for nest.js

A upyun sdk for nest.js.

## Installation

```bash
pnpm i @nailyjs.nest.modules/upyun
```

## Usage

```typescript
import { Module } from '@nestjs/common';
import { UpyunModule } from '@nailyjs.nest.modules/upyun';

@Module({
  imports: [
    UpyunModule.forRoot({
      operator: 'operator',
      password: 'password',
      bucket: 'bucket',
      domain: 'domain',
    }),
  ],
})
export class AppModule {}
```

## Async Usage

`UpyunModule` provide `forRoot` and `forRootAsync` methods to create upyun client.

```typescript
import { Module } from '@nestjs/common';
import { UpyunModule } from '@nailyjs.nest.modules/upyun';

@Module({
  imports: [
    UpyunModule.forRootAsync({
      useFactory: () => ({
        operator: 'operator',
        password: 'password',
        bucket: 'bucket',
      }),
    }),
  ],
})
export class AppModule {}
```

## Use `UpyunService`

Then you can use `UpyunService` in your service or controller.

```typescript
import { Injectable } from '@nestjs/common';
import { UpyunService } from '@nailyjs.nest.modules/upyun';

@Injectable()
export class AppService {
  constructor(private readonly upyunService: UpyunService) {}

  async upload() {
    return this.upyunService.listDir('/');
  }
}
```

## Multiple Upyun Instances

```typescript
import { Module } from '@nestjs/common';
import { UpyunModule } from '@nailyjs.nest.modules/upyun';

// In real project, recommend to create a separate file to store constants.
export const UPYUN_CLIENT_1 = 'upyun1';
export const UPYUN_CLIENT_2 = 'upyun2';

@Module({
  imports: [
    UpyunModule.forRoot([
      {
        provide: UPYUN_CLIENT_1,
        operator: 'operator1',
        password: 'password1',
        bucket: 'bucket1',
      },
      {
        name: UPYUN_CLIENT_2,
        operator: 'operator2',
        password: 'password2',
        bucket: 'bucket2',
      },
    ])
  ],
})
export class AppModule {}
```

> Also you can use `forRootAsync` to create multiple upyun instances.

Then you must use `@Inject` decorator (import from `@nestjs/common`) to inject the service.

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { UpyunService } from '@nailyjs.nest.modules/upyun';
import { UPYUN_CLIENT_1, UPYUN_CLIENT_2 } from './app.module';

@Injectable()
export class AppService {
  constructor(
    @Inject(UPYUN_CLIENT_1)
    private readonly upyunService1: UpyunService,
    @Inject(UPYUN_CLIENT_2)
    private readonly upyunService2: UpyunService,
  ) {}

  async upload() {
    return this.upyunService1.listDir('/');
  }
}
```

## FAQ

### Why I not have types for upyun sdk?

Upyun sdk is written in javascript, but you can use `@types/upyun` to get types.

```bash
pnpm i -D @types/upyun
```

> The author of `@types/upyun` is also me (QAQ)

## Author

👤 **Naily Zero** <zero@naily.cc>

## License

MIT
