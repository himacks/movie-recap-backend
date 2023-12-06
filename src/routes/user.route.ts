import {Router} from "express";
import userController from "../controller/user.controller";
const userRouter = Router();
// specifies the endpoint and the method to call
userRouter.post("/signup", userController.addNewUser);
userRouter.post("/login", userController.loginUser);

// export the router
export default userRouter;
