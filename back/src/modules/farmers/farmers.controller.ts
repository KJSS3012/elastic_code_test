import { Controller } from "@nestjs/common";
import { FarmersService } from "./farmers.service";

@Controller("farmers")
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) { }

  
}