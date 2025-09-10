 🚌 Real-Time Bus Ticketing System

This project is a real-time bus ticketing platform built as part of the INE assignment.  
It is designed to simulate how passengers can reserve and purchase bus seats while organizers manage trips, seat layouts, and pricing. The platform ensures that seat availability is always synchronized across all users in real-time, avoiding double bookings and providing a smooth experience.  


## 🔗 Live Demo👉 https://online-bus-ticketing-system-seven.vercel.app/


## ✨ Overview of Features

The application brings together the essential components of a ticketing system in a compact, real-time environment:

- *Trip Management*
  Organizers can create and manage bus trips with all necessary details including routes, schedules, bus type, seating layout, and pricing rules.  

- *Real-Time Seat Map* 
  Passengers can view an interactive seating chart where every seat’s status (available, held, or sold) updates instantly through WebSockets, ensuring that everyone sees the same state without refreshing.  

- *Seat Holding with Expiry* 
  To give passengers a fair chance, seats can be temporarily held for a short period (2–5 minutes). These holds are managed in Redis with a built-in expiry time. Once the timer runs out, the seats are automatically released back to availability.  

- *Purchase Flow* 
  Checkout is designed to be atomic and safe. A purchase verifies that the hold is valid, marks the seat as sold in the database, and then finalizes the booking. This prevents double-selling even in high-concurrency scenarios.  

- *Notifications & Post-Sale Communication*
  Users are notified about upcoming hold expiries, seat releases, and successful purchases. After a purchase, both the passenger and the organizer receive a confirmation email with a PDF invoice, powered by SendGrid.  

- *Admin Features (Optional)*
  A dedicated panel can allow administrators to monitor active trips, live holds, and sales. Stuck reservations can be forcefully released and manual overrides are supported for unusual cases.  

---

## 🛠️ Technology Stack

The system integrates a modern, scalable stack to ensure reliability and real-time responsiveness:  

- *Frontend*: React.js (for intuitive seat maps and booking flows)  
- *Backend*: Node.js with Express (for APIs and WebSocket management)  
- *Database*: Supabase (PostgreSQL) managed with Sequelize ORM  
- *In-Memory Store*: Redis (Upstash) for seat holds and fast lookups  
- *Real-Time Communication*: WebSockets for live updates  
- *Email Service*: SendGrid for confirmations and invoices  
- *Deployment*:  Vercel   
