import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { TicketService } from "./ticket.service";

@Controller("ticket")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {
  }

  @Post("/create")
  async createNewTicket(@Res() res: Response, @Body() body): Promise<any> {
    res.json(await this.ticketService.newTicket(res.locals.userId, body));
  }

  @Get("/")
  async getTickets(@Res() res): Promise<any> {
    res.json(await this.ticketService.getTickets(res.locals.userId));
  }

  @Post("/email")
  async emailToUs(@Body() body) {
    return await this.ticketService.newEmailTicket(body);
  }
}
