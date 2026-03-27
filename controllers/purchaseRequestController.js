const prisma = require('../db/prismaClient');
const logAction = require('../utils/audit'); 

const createRequest = async (req, res) => {

 const { title, description } = req.body;

 const pr = await prisma.purchaseRequest.create({
  data: {
   title,
   description,
   status: "Draft",
   companyId: req.user.companyId,
   createdBy: req.user.id
  }
 });

 await logAction("CREATE", pr.id, req.user.id, { title, description });
 res.json(pr);
};

const getRequest = async (req, res) => {

 const id = parseInt(req.params.id);

 const pr = await prisma.purchaseRequest.findUnique({
  where: { id }
 });

 if (!pr) return res.status(404).json({ message: "Not found" });

 
 if (req.user.role === "Staff" && pr.createdBy !== req.user.id)
  return res.status(404).json({ message: "Not found" });

 if (req.user.role === "Manager" && pr.companyId !== req.user.companyId)
  return res.status(404).json({ message: "Not found" });

 res.json(pr);
};
const updateRequest = async (req, res) => {

 const id = parseInt(req.params.id);
 const { title, description } = req.body;

 const pr = await prisma.purchaseRequest.findUnique({
  where: { id }
 });

 if (!pr) return res.status(404).json({ message: "Not found" });

 if (pr.createdBy !== req.user.id)
  return res.status(403).json({ message: "Forbidden" });

 if (pr.status !== "Draft")
  return res.status(400).json({ message: "Cannot edit after submission" });

 const updated = await prisma.purchaseRequest.update({
  where: { id },
  data: { title, description }
 });

 await logAction("UPDATE_DRAFT", updated.id, req.user.id);

 res.json(updated);
};

const listRequests = async (req, res) => {

 let where = {};

 if (req.user.role === "Staff") {
  where.createdBy = req.user.id;
 }

 if (req.user.role === "Manager") {
  where.companyId = req.user.companyId;
 }

 const data = await prisma.purchaseRequest.findMany({ where });

 res.json(data);
};

const submitRequest = async (req, res) => {

 const id = parseInt(req.params.id);

 const pr = await prisma.purchaseRequest.findUnique({ where: { id } });

 if (!pr) return res.status(404).json({ message: "Not found" });

 if (pr.createdBy !== req.user.id)
  return res.status(403).json({ message: "Forbidden" });

 if (pr.status !== "Draft")
  return res.status(400).json({ message: "Invalid state" });

 const updated = await prisma.purchaseRequest.update({
  where: { id },
  data: { status: "Submitted" }
 });

 await logAction("SUBMIT", updated.id, req.user.id);
 res.json(updated);
};

const approveRequest = async (req, res) => {

 if (!["Manager","Admin"].includes(req.user.role))
  return res.status(403).json({ message: "Forbidden" });

 const id = parseInt(req.params.id);

 const pr = await prisma.purchaseRequest.findUnique({ where: { id } });

 if (!pr) return res.status(404).json({ message: "Not found" });

 // Manager can approve only inside their company
 if (
  req.user.role === "Manager" &&
  pr.companyId !== req.user.companyId
 )
  return res.status(403).json({ message: "Forbidden" });

 if (pr.status !== "Submitted")
  return res.status(400).json({ message: "Invalid state" });

 const updated = await prisma.purchaseRequest.update({
  where: { id },
  data: { status: "Approved" }
 });

 await logAction("APPROVE", updated.id, req.user.id);

 res.json(updated);
};

const rejectRequest = async (req, res) => {

 if (!["Manager","Admin"].includes(req.user.role))
  return res.status(403).json({ message: "Forbidden" });

 const id = parseInt(req.params.id);

 const pr = await prisma.purchaseRequest.findUnique({ where: { id } });

 if (!pr) return res.status(404).json({ message: "Not found" });

 // Manager can reject only inside their company
 if (
  req.user.role === "Manager" &&
  pr.companyId !== req.user.companyId
 )
  return res.status(403).json({ message: "Forbidden" });

 if (pr.status !== "Submitted")
  return res.status(400).json({ message: "Invalid state" });

 const updated = await prisma.purchaseRequest.update({
  where: { id },
  data: { status: "Rejected" }
 });

 await logAction("REJECT", updated.id, req.user.id);

 res.json(updated);
};


module.exports = {
  createRequest,
  listRequests,
  submitRequest,
  approveRequest,
  rejectRequest,
  getRequest,
  updateRequest
};