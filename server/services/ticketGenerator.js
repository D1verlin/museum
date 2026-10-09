import { Visit } from '../models/index.js';

export async function generateTicketNumber() {
  let unique = false;
  let ticketNumber = '';

  while (!unique) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    ticketNumber = `AURA-${randomSixDigits}`;

    const existing = await Visit.findOne({ where: { ticketNumber } });
    if (!existing) {
      unique = true;
    }
  }

  return ticketNumber;
}
