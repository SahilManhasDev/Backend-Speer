/*globals require, module */

const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const FranchiseController = require("../../franchise/franchise.controller");
const AuthController = require("../../shared/controller/auth.controller");
const SubAccountController = require("../../franchise/subAccount.controller");
const { USER_ROLES } = require("../../../common/constants");
const validation = require('../../../middleware/requestValidation');
const UserController = require("../../shared/controller/user.controller");
const CustomersController = require("../../franchise/customers.controller");
const OrderController = require("../../franchise/order.controller");
const PaymentController = require("../../franchise/payments.controller");
const InvoiceController = require("../../franchise/invoice.controller");

router.post("/auth", validation.validate('userLogin'), AuthController.userAuth);
router.post("/", auth(USER_ROLES.ADMIN), validation.validate('userCreate'), FranchiseController.createAccount);
router.get("/me", auth(USER_ROLES.FRANCHISE_OWNER), FranchiseController.getMe);
router.put("/me", auth(USER_ROLES.FRANCHISE_OWNER), FranchiseController.updateMe);
router.post("/sub-account", validation.validate('franchiseSubAccount'), auth(USER_ROLES.FRANCHISE_OWNER), SubAccountController.createSubAccount);
router.get("/sub-account", auth(USER_ROLES.FRANCHISE_OWNER), SubAccountController.listSubAccount);
router.get("/sub-account/:account_id", auth(USER_ROLES.FRANCHISE_OWNER), SubAccountController.getSubAccountDetails);
router.delete("/sub-account/:account_id", auth(USER_ROLES.FRANCHISE_OWNER), SubAccountController.deleteSubAccount);
router.put("/sub-account/:account_id", auth(USER_ROLES.FRANCHISE_OWNER), validation.validate('updateSubAccount'), SubAccountController.updateSubAccountDetails);
router.post("/update-password", auth(USER_ROLES.FRANCHISE_OWNER, USER_ROLES.FRANCHISE_MANAGER, USER_ROLES.FRANCHISE_STAFF, USER_ROLES.PICKUP_AGENT), UserController.userUpdatePassword);
router.get("/orders", auth(USER_ROLES.FRANCHISE_OWNER), OrderController.getOrderLists);
router.get("/order-invoice/:order_id", auth(USER_ROLES.FRANCHISE_OWNER), OrderController.getOrderInvoice);
router.get("/payments", auth(USER_ROLES.FRANCHISE_OWNER), PaymentController.getPaymentLists);
router.get("/payments/:order_id", auth(USER_ROLES.FRANCHISE_OWNER), PaymentController.getPaymentDetails);
router.get("/customers", auth(USER_ROLES.FRANCHISE_OWNER), CustomersController.getCustomersList);
router.get("/invoices", auth(USER_ROLES.FRANCHISE_OWNER), InvoiceController.getInvoiceList);
router.get("/invoices/:invoice_id", auth(USER_ROLES.FRANCHISE_OWNER), InvoiceController.getInvoiceDetails);
router.get("/orders/:order_id", auth(USER_ROLES.FRANCHISE_OWNER), OrderController.getOrderDetails);
router.put("/orders/status/:order_id", auth(USER_ROLES.FRANCHISE_OWNER), validation.validate('orderStatusUpdate'), OrderController.updateOrderStatus);
router.post("/orders/assign/:order_id", auth(USER_ROLES.FRANCHISE_OWNER), validation.validate('assignOrder'), OrderController.assignOrder);
module.exports = router;