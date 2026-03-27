const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
 createRequest,
 listRequests,
 submitRequest,
 approveRequest,
 rejectRequest,
 getRequest,
 updateRequest
} = require('../controllers/purchaseRequestController');

router.use(auth);

router.post('/', createRequest);
router.get('/', listRequests);
router.get('/:id', getRequest);
router.patch('/:id', updateRequest);
router.patch('/:id/submit', submitRequest);
router.patch('/:id/approve', approveRequest);
router.patch('/:id/reject', rejectRequest);

module.exports = router;