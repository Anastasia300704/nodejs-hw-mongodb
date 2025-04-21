import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Contact = mongoose.model('Contact', contactSchema);

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find(); 
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/contacts/:contactId', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId); 
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
