import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; 
import { getContacts, getContactById, createContact, } from '../controllers/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createContact));  

export default router;
