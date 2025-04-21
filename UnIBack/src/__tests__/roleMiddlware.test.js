const authorizeRoles = require("../../roleMiddleware");

describe("authorizeRoles middleware", () => {
  const mockReq = (role) => ({
    user: { role },
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const next = jest.fn();

  it("should call next if role is allowed", () => {
    const req = mockReq("admin");
    const res = mockRes();

    const middleware = authorizeRoles("admin", "moderator");
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if role is not allowed", () => {
    const req = mockReq("user");
    const res = mockRes();

    const middleware = authorizeRoles("admin");
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
  });

  it("should return 403 if no role is provided", () => {
    const req = { user: {} };
    const res = mockRes();

    const middleware = authorizeRoles("admin");
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "No role provided" });
  });
});
