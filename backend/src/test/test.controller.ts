import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  async test() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.testService.test();
  }
}
