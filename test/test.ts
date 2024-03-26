import { Request, Response } from "express";
import { createUser, login } from '../src/controller/user'; 
import { addProduct, updateProduct, getSingleProduct, getAllProducts, sellProduct } from '../src/controller/products';


const generateRandomNumber = () => Math.floor(Math.random() * 1000);
const randNum = generateRandomNumber();
describe("User Controller Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = { status: statusMock } as Partial<Response>;
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
        req.body = {
            fullName: "John Doe",
            username: `john_doee_${randNum}`,
            password: "password123",
            confirmPassword: "password123"
        };

        await createUser(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should log in a user with valid credentials", async () => {
      req.body = {
        username: `john_doee_${randNum}`,
        password: "password123"
      };

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalled();
    });
  });
});