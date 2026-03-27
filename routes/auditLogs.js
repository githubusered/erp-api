const express = require('express');
const router = express.Router();
const prisma  = require('../db/prismaClient');
const auth = require('../middleware/authMiddleware');

router.use(auth); // require authentication

// GET /api/audit-logs
router.get('/', async (req, res) => {
  try {
    const { role, companyId } = req.user;

    let logs;
    if (role === "Staff") {
      // Staff sees only their actions
      logs = await prisma.auditLog.findMany({
        where: { actorUserId: req.user.id },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Manager/Admin sees all logs for their company
      logs = await prisma.auditLog.findMany({
        where: { entityType: "PurchaseRequest" }, // optional filter
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;