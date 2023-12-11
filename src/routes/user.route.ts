import {Router} from "express";
import userController from "../controller/user.controller";
import validateUser from "../middlewares/validateUser";
const userRouter = Router();
// specifies the endpoint and the method to call
userRouter.post("/signup", validateUser, userController.addNewUser);
userRouter.post("/login", validateUser, userController.loginUser);
userRouter.patch("/update", validateUser, userController.updateUser);
userRouter.delete("/delete", validateUser, userController.deleteUser);
userRouter.get("/stats", userController.getUserStatistics);

// export the router
export default userRouter;
