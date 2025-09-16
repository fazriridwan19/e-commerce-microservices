import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemRequest } from './create-cart-item-request.dto';

export class UpdateCartDto extends PartialType(CreateCartItemRequest) {}
