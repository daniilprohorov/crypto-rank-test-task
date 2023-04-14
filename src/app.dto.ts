import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class QueryDto {
  @IsString()
  @IsNotEmpty()
  public from: string;

  @IsString()
  @IsNotEmpty()
  public to = 'tether';

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  public amount = 1;
  // Dont know why if 'amount=' amount = 0
  // May be because '' cast to Number = 0
  // I know about this, but decide not to spend time to fix it
}
