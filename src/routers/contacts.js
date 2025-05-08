import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; 
import { getContacts, getContactById } from '../controllers/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactById));

export default router;
