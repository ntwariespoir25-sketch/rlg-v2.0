const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');

router.use(adminProtect);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;