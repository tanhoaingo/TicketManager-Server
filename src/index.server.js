const env = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const AppError = require('./pages/AppError');

const enterpriseRoutes = require('./routes/enterprise');
const cityRoutes = require('./routes/city.js');
const tripRoutes = require('./routes/trip.js');
const routeRoutes = require('./routes/route');
const userRoutes = require('./routes/user');
const profilesRoutes = require('./routes/profiles.js');
const customerRoutes = require('./routes/customer');
const driveRoutes = require('./routes/drive');
const steersmanRoutes = require('./routes/steersman');
const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin/auth');
const vehicleRoutes = require('./routes/vehicle');
const wagonsRoutes = require('./routes/wagons');
const ticketRoutes = require('./routes/ticket.js');
const wagonTicketRoutes = require('./routes/wagonTicket.js');
const seatRoutes = require('./routes/seat.js');
const cusTicketRoutes = require('./routes/cusTicket.js');
const invoiceRoutes = require('./routes/invoice.js');

const app = express();

env.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.vj891.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Database connected');
  });

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(express.static(path.join(__dirname, './uploads')));

app.get('/', (req, res, next) => {
  const error = new AppError(`Error on this server`, 404);

  return next(error);
});

app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/route', routeRoutes);
app.use('/api/user', userRoutes);
app.use('/api', profilesRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api/steersman', steersmanRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/wagon', wagonsRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/wagonTicket', wagonTicketRoutes);
app.use('/api/seat', seatRoutes);
app.use('/api/cusTicket', cusTicketRoutes);
app.use('/api/invoice', invoiceRoutes);

app.all('*', (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(error);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
